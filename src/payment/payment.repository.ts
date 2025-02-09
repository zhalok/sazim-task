import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/order/order.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderRepository: OrderRepository,
  ) {}

  async checkout({ paymentId }: { paymentId: string }) {
    const prisma = this.prismaService.getPrismaClient();
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
      },
    });
    const paymentExpirationTime = payment.expiredAt;
    const now = new Date();
    if (now > paymentExpirationTime) {
      await prisma.payment.delete({
        where: {
          id: paymentId,
        },
      });
      throw new HttpException('Payment is expired', HttpStatus.BAD_REQUEST);
    }
    const order = await prisma.order.findFirst({
      where: {
        id: payment.orderId,
      },
    });
    if (order.status !== 'PENDING') {
      throw new HttpException('Order is not pending', HttpStatus.BAD_REQUEST);
    }
    const rentPeriodInDays = order.rentPeriod;
    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + rentPeriodInDays);

    const result = await prisma.$transaction(async (prismatx) => {
      const updatedPayment = await prismatx.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: 'SUCCESSFULL',
        },
      });
      const updatedOrder = await prismatx.order.update({
        where: {
          id: payment.orderId,
        },
        data: {
          status: order.type === 'RENT' ? 'ON_RENT' : 'PLACED',
          expireAt,
        },
      });
      setTimeout(
        () => {
          this.orderRepository.expireRentOrder(payment.orderId);
        },
        rentPeriodInDays * 24 * 60 * 60 * 1000,
      );
      return {
        paymentStatus: updatedPayment.status,
        orderStatus: updatedOrder.status,
        orderId: order.id,
      };
    });
    return result;
  }
}
