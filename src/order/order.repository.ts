import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Order, OrderStatus, OrderType } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOrderInput } from "./dto/create-order.input";
import { GetOrdersFilter } from "./dto/filter-orders.input";

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrder(createOrderInput: CreateOrderInput) {
    const prisma = this.prismaService.getPrismaClient();
    const { orderItems, orderType, rentPeriodInDays } = createOrderInput;

    const order = await prisma.$transaction(async (prismatx) => {
      const products = await prismatx.product.findMany({
        where: {
          id: {
            in: orderItems.map((item) => item.productId.toString()),
          },
        },
      });

      const totalAmount = products.reduce((acc, product) => {
        if (
          product.stock <
          orderItems.find((item) => item.productId.toString() === product.id)
            .quantity
        ) {
          throw new HttpException(
            `Product ${product.name} is out of stock`,
            HttpStatus.BAD_REQUEST,
          );
        }
        return (
          acc +
          product.price *
            orderItems.find((item) => item.productId.toString() === product.id)
              .quantity
        );
      }, 0);

      const productDeductionPromises = orderItems.map((item) => {
        return prismatx.product.update({
          where: {
            id: item.productId.toString(),
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      });

      await Promise.all(productDeductionPromises);

      const order = await prismatx.order.create({
        data: {
          customerName: createOrderInput.customerName,
          customerEmail: createOrderInput.customerEmail,
          customerPhone: createOrderInput.customerPhone,
          customerAddress: createOrderInput.customerAddress,
          totalAmount: totalAmount,
          type: orderType,
          rentPeriod: orderType === "RENT" ? rentPeriodInDays : null,
          orderItems: {
            createMany: {
              data: orderItems.map((item) => ({
                productId: item.productId.toString(),
                quantity: item.quantity,
              })),
            },
          },
          status: "PENDING",
        },
      });

      const payment = await prismatx.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          status: "PENDING",
          expiredAt: new Date(Date.now() + 1000 * 60 * 60),
        },
      });
      setTimeout(() => {
        this.deleteOrderIfPending(order.id);
      }, 5000 * 60);

      return {
        id: order.id,
        totalPayableAmount: totalAmount,
        status: order.status,
        type: order.type,
        paymentId: payment.id,
      };
    });
    return order;
  }

  async deleteOrder(orderId: string) {
    const prisma = this.prismaService.getPrismaClient();
    await prisma.$transaction(async (prismatx) => {
      const orderItems = await prismatx.orderItems.findMany({
        where: {
          orderId: orderId,
        },
      });
      const productUpdatePromises = orderItems.map((item) => {
        return prismatx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: { increment: item.quantity },
          },
        });
      });
      await Promise.all(productUpdatePromises);
      await prismatx.orderItems.deleteMany({
        where: {
          orderId: orderId,
        },
      });
      await prismatx.payment.deleteMany({
        where: {
          orderId: orderId,
        },
      });
      await prismatx.order.delete({
        where: {
          id: orderId,
        },
      });

      console.log(`Order cleaned ${orderId}`);
    });
  }

  async deleteOrderIfPending(orderId: string) {
    const prisma = this.prismaService.getPrismaClient();
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    if (order.status === "PENDING") {
      await this.deleteOrder(orderId);
    }
  }

  async expireRentOrder(orderId: string) {
    const prisma = this.prismaService.getPrismaClient();
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    const rentExpireAt = order.expireAt;
    const now = new Date();

    if (order.type === "RENT" && now > rentExpireAt) {
      await prisma.$transaction(async (prsimatx) => {
        const orderItems = await prsimatx.orderItems.findMany({
          where: {
            orderId: orderId,
          },
        });
        const productUpdatePromises = orderItems.map((item) => {
          return prsimatx.product.update({
            where: {
              id: item.productId,
            },
            data: {
              stock: { increment: item.quantity },
            },
          });
        });
        await Promise.all(productUpdatePromises);
        await prsimatx.orderItems.deleteMany({
          where: {
            orderId: orderId,
          },
        });
        await prsimatx.order.update({
          where: {
            id: orderId,
          },
          data: {
            status: "EXPIRED",
          },
        });
      });
    }
  }

  async cancelOrder(orderId: string, reason?: string) {
    const prisma = this.prismaService.getPrismaClient();
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    if (order.status === "COMPLETED") {
      throw new HttpException(
        "Order already completed",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (order.status === "CANCELLED") {
      throw new HttpException(
        "Order already cancelled",
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedOrder = await prisma.$transaction(async (prismatx) => {
      const orderItems = await prismatx.orderItems.findMany({
        where: {
          orderId: orderId,
        },
      });
      const productUpdatePromises = orderItems.map((item) => {
        return prismatx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: { increment: item.quantity },
          },
        });
      });
      await Promise.all(productUpdatePromises);
      await prismatx.orderItems.deleteMany({
        where: {
          orderId: orderId,
        },
      });
      return await prismatx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "CANCELLED",
          cancellationReason: reason,
        },
      });
    });

    return updatedOrder;
  }

  async completeOrder(orderId: string) {
    const prisma = this.prismaService.getPrismaClient();
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        payment: true,
      },
    });

    const payments = order.payment;
    if (payments.length === 0) {
      await prisma.payment.create({
        data: {
          orderId: orderId,
          amount: order.totalAmount,
          status: "PENDING",
        },
      });
      throw new HttpException("No payment found", HttpStatus.BAD_REQUEST);
    }

    const payment = order.payment[0];

    if (payment.status !== "SUCCESSFULL") {
      if (payment.expiredAt.getTime() < new Date().getTime()) {
        await prisma.payment.deleteMany({
          where: {
            orderId,
          },
        });
        await prisma.payment.create({
          data: {
            orderId: orderId,
            amount: order.totalAmount,
            status: "PENDING",
          },
        });
      }

      throw new HttpException("Payment not successful", HttpStatus.BAD_REQUEST);
    }

    if (order.status === "COMPLETED") {
      throw new HttpException(
        "Order already completed",
        HttpStatus.BAD_REQUEST,
      );
    }

    this.addAdditionalCharges(order).catch((e) => console.log(e));

    return await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "COMPLETED",
      },
    });
  }
  async getAllOrders({
    limit,
    page,
    filter,
  }: {
    limit: number;
    page: number;
    filter?: GetOrdersFilter;
  }) {
    const query = {};

    if (filter) {
      if (filter.customerEmail) {
        query["customerEmail"] = filter.customerEmail;
      }
      if (filter.status) {
        query["status"] = filter.status as OrderStatus;
      }
      if (filter.createdAt) {
        query["createdAt"] = filter.createdAt;
      }
    }

    const prisma = this.prismaService.getPrismaClient();
    const totalOrders = await prisma.order.count({
      where: query,
    });
    const orders = await prisma.order.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { orders, totalOrders };
  }

  async getOrder(id: string) {
    const prisma = this.prismaService.getPrismaClient();
    const order = await prisma.order.findFirst({
      where: {
        id: id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });

    return order;
  }

  async addAdditionalCharges(order: Order) {
    const prisma = this.prismaService.getPrismaClient();
    const nowTime = new Date();
    if (order.type === OrderType.RENT && order.expireAt < nowTime) {
      // this is just for abstraction
      const extraTime = order.expireAt.getTime() - nowTime.getTime();
      const extraCharge = (extraTime / (1000 * 60 * 60)) * 0.1;
      const extraChargePayment = await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: extraCharge,
          status: "PENDING",
        },
      });
      console.log(
        `Sent email to ${order.customerEmail} for payment ${extraChargePayment.id}`,
      );
    }
  }

  async deleteIncompleteOrder(orderId: string) {
    const prisma = this.prismaService.getPrismaClient();

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order.status === "COMPLETED") {
      throw new HttpException(
        "Order cannot be deleted",
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.deleteOrder(orderId);
  }
}
