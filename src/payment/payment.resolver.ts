import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/create-payment.input';
import { MakePaymentOutput } from './dto/create-payment.output';
import { OrderStatus } from '@prisma/client';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => MakePaymentOutput, { name: 'makePayment' })
  async makePayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
  ): Promise<MakePaymentOutput> {
    try {
      const { orderId, orderStatus, paymentStatus } =
        await this.paymentService.create(createPaymentInput);
      return {
        ok: true,
        orderId,
        orderStatus,
        paymentStatus,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.message,
      };
    }
  }

  @Query(() => [Payment], { name: 'payment' })
  findAll() {
    return this.paymentService.findAll();
  }

  @Query(() => Payment, { name: 'payment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.paymentService.findOne(id);
  }

  @Mutation(() => Payment)
  removePayment(@Args('id', { type: () => Int }) id: number) {
    return this.paymentService.remove(id);
  }
}
