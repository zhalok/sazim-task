import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { CreateOrderOutput } from './dto/create-order.output';
import { GetOrdersOutput } from './dto/get-orders.output';
import { GetOrdersFilter } from './dto/filter-orders.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => CreateOrderOutput)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ) {
    const order = await this.orderService.create(createOrderInput);

    return {
      data: {
        id: order.id,
        totalPayableAmount: order.totalPayableAmount,
        status: order.status,
        paymentId: order.paymentId,
        orderType: order.type,
      },
    };
  }

  @Query(() => GetOrdersOutput, { name: 'orders' })
  async findAll(
    @Args('limit', { type: () => Int }) limit: number,
    @Args('page', { type: () => Int }) page: number,
    @Args('filter', { type: () => GetOrdersFilter, nullable: true })
    filter: GetOrdersFilter,
  ) {
    const { orders, totalOrders } = await this.orderService.findAll({
      limit,
      page,
      filter,
    });

    return {
      pagination: {
        limit,
        page,
        total: totalOrders,
      },
      data: orders,
    };
  }

  @Query(() => Order, { name: 'order' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.orderService.findOne(id);
  }

  @Query(() => GetOrdersOutput, { name: 'myOrders' })
  async findMyOrders(
    @Args('email', { type: () => String }) customerEmail: string,
    @Args('limit', { type: () => Int }) limit: number,
    @Args('page', { type: () => Int }) page: number,
  ) {
    const { orders, totalOrders } = await this.orderService.findMyOrders({
      limit,
      page,
      customerEmail,
    });
    return {
      pagination: {
        limit,
        page,
        total: totalOrders,
      },
      data: orders,
    };
  }

  @Mutation(() => Order, { name: 'cancelOrder' })
  cancelOrder(
    @Args('id', { type: () => String }) id: string,
    @Args('email') email: string,
    @Args('reason', { type: () => String! }) reason?: string,
  ) {
    return this.orderService.cancelOrder(id, email, reason);
  }

  @Mutation(() => Order, { name: 'completeOrder' })
  competeOrder(
    @Args('id', { type: () => String }) id: string,
    @Args('email') email: string,
  ) {
    return this.orderService.completeOrder(id, email);
  }
}
