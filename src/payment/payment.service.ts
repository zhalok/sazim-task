import { Injectable } from "@nestjs/common";
import { CreatePaymentInput } from "./dto/create-payment.input";
import { PaymentRepository } from "./payment.repository";

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}
  create(createPaymentInput: CreatePaymentInput) {
    return this.paymentRepository.checkout({
      paymentId: createPaymentInput.id,
    });
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  cancelPayment(id: string) {
    return this.paymentRepository.cancelPayment(id);
  }
}
