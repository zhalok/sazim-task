import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { CreateOrderOutput } from './dto/create-order.output';

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
      },
    };
  }

  @Query(() => [Order], { name: 'order' })
  findAll() {
    return this.orderService.findAll();
  }

  @Query(() => Order, { name: 'order' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.orderService.findOne(id);
  }

  @Mutation(() => Order)
  updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.orderService.update(updateOrderInput.id, updateOrderInput);
  }

  @Mutation(() => Order)
  removeOrder(@Args('id', { type: () => Int }) id: number) {
    return this.orderService.remove(id);
  }
}
