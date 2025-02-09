import { Injectable } from '@nestjs/common';
import { OrderStatus, PrismaClient } from '@prisma/client';
import { CreateOrderInput } from './dto/create-order.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetOrdersFilter } from './dto/filter-orders.input';

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrder(createOrderInput: CreateOrderInput) {
    const prisma = this.prismaService.getPrismaClient();
    const { orderItems } = createOrderInput;
    const order = await prisma.$transaction(async (prismatx) => {
      const products = await prismatx.product.findMany({
        where: {
          id: {
            in: orderItems.map((item) => item.productId.toString()),
          },
          stock: {
            gt: 0,
          },
        },
      });
      await prismatx.product.updateMany({
        where: {
          id: {
            in: orderItems.map((item) => item.productId.toString()),
          },
        },
        data: {
          stock: { decrement: 1 },
        },
      });
      if (products.length !== orderItems.length) {
        throw new Error('Not enough stock');
      }

      const totalAmount = products.reduce((acc, product) => {
        return (
          acc +
          product.price *
            orderItems.find((item) => item.productId.toString() === product.id)
              .quantity
        );
      }, 0);

      const order = await prismatx.order.create({
        data: {
          customerEmail: createOrderInput.customerEmail,
          customerPhone: createOrderInput.customerPhone,
          totalAmount: totalAmount,
          orderItems: {
            createMany: {
              data: orderItems.map((item) => ({
                productId: item.productId.toString(),
                quantity: item.quantity,
              })),
            },
          },
          status: 'PENDING',
        },
      });

      const payment = await prismatx.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          status: 'PENDING',
          expiredAt: new Date(Date.now() + 1000 * 60 * 60),
        },
      });
      setTimeout(() => {
        this.cancelOrderIfPending(order.id);
      }, 5000 * 60);

      return {
        id: order.id,
        totalPayableAmount: totalAmount,
        status: order.status,
        paymentId: payment.id,
      };
    });
    return order;
  }

  async cancelOrderIfPending(orderId: string) {
    const prisma = this.prismaService.getPrismaClient();
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    if (order.status === 'PENDING') {
      await prisma.$transaction(async (prismatx) => {
        const orderItems = await prismatx.orderItems.findMany({
          where: {
            orderId: orderId,
          },
        });
        const productIds = orderItems.map((item) => item.productId);
        await prismatx.product.updateMany({
          where: {
            id: {
              in: productIds,
            },
          },
          data: {
            stock: { increment: 1 },
          },
        });
        await prismatx.orderItems.deleteMany({
          where: {
            orderId: orderId,
          },
        });
        await prismatx.order.update({
          where: {
            id: orderId,
          },
          data: {
            status: 'CANCELLED',
          },
        });
        const payment = await prismatx.payment.findFirst({
          where: {
            orderId: orderId,
          },
        });
        await prismatx.payment.delete({
          where: {
            id: payment.id,
          },
        });

        console.log(`Order cleaned ${orderId}`);
      });
    }
  }

  async cancelOrder(orderId: string) {
    const prisma = this.prismaService.getPrismaClient();
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    if (order.status === 'COMPLETED') {
      return;
    }
    await prisma.$transaction(async (prismatx) => {
      const orderItems = await prismatx.orderItems.findMany({
        where: {
          orderId: orderId,
        },
      });
      const productIds = orderItems.map((item) => item.productId);
      await prismatx.product.updateMany({
        where: {
          id: {
            in: productIds,
          },
        },
        data: {
          stock: { increment: 1 },
        },
      });
      await prismatx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: 'CANCELLED',
        },
      });
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
        query['customerEmail'] = filter.customerEmail;
      }
      if (filter.status) {
        query['status'] = filter.status as OrderStatus;
      }
      if (filter.createdAt) {
        query['createdAt'] = filter.createdAt;
      }
    }

    const prisma = this.prismaService.getPrismaClient();
    const totalOrders = await prisma.order.count({
      where: query,
    });
    const orders = await prisma.order.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: query,
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
        orderItems: true,
      },
    });
    return order;
  }
}
