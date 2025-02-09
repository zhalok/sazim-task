import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderRepository } from './order.repository';
import { GetOrdersFilter } from './dto/filter-orders.input';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
  async create(createOrderInput: CreateOrderInput) {
    //sending dummy customer id for now
    const order = await this.orderRepository.createOrder(createOrderInput);
    return order;
  }

  async findAll({
    page,
    limit,
    filter,
  }: {
    page: number;
    limit: number;
    filter?: GetOrdersFilter;
  }) {
    return this.orderRepository.getAllOrders({ page, limit, filter });
  }

  async findOne(id: string) {
    return this.orderRepository.getOrder(id);
  }

  async findMyOrders({
    page,
    limit,
    customerEmail,
  }: {
    page: number;
    limit: number;
    customerEmail: string;
  }) {
    const { orders, totalOrders } = await this.orderRepository.getAllOrders({
      limit: limit,
      page: page,
      filter: {
        customerEmail,
      },
    });
    return { orders, totalOrders };
  }

  async cancelOrder(id: string, customerEmail: string) {
    const order = await this.orderRepository.getOrder(id);
    if (order.customerEmail !== customerEmail) {
      throw new HttpException(
        'Murubbi!, Murubbi!!, not your order',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.orderRepository.cancelOrder(id);
  }

  async completeOrder(id: string, customerEmail: string) {
    const order = await this.orderRepository.getOrder(id);

    if (order.customerEmail !== customerEmail) {
      throw new HttpException(
        'Murubbi!, Murubbi!!, not your order',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.orderRepository.completeOrder(id);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
