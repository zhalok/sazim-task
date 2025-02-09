import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
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

  findOne(id: string) {
    return this.orderRepository.getOrder(id);
  }

  update(id: number, updateOrderInput: UpdateOrderInput) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
