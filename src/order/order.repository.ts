import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOrderInput } from './dto/create-order.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrder(createOrderInput: CreateOrderInput,customerId:string) {
    const prisma = this.prismaService.getPrismaClient();
    const { orderItems } = createOrderInput;
    const dummyCustomer = await prisma.customer.findFirst();
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
          customerId:dummyCustomer.id,
          totalAmount: totalAmount,
          OrderItems: {
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

      return {
        id: order.id,
        totalPayableAmount: totalAmount,
        status: order.status,
        paymentId: payment.id,
      };
    });
    return order;
  }
}
