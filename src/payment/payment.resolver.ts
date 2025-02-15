import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CancelPaymentOutput } from "./dto/cancel-payment.output";
import { CreatePaymentInput } from "./dto/create-payment.input";
import { MakePaymentOutput } from "./dto/create-payment.output";
import { Payment } from "./entities/payment.entity";
import { PaymentService } from "./payment.service";

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => MakePaymentOutput, { name: "makePayment" })
  async makePayment(
    @Args("createPaymentInput") createPaymentInput: CreatePaymentInput,
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

  @Mutation(() => CancelPaymentOutput)
  cancelPayment(@Args("id") paymentId: string) {
    return this.paymentService.cancelPayment(paymentId);
  }
}
