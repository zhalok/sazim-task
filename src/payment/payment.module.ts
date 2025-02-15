import { Module } from "@nestjs/common";
import { OrderModule } from "src/order/order.module";
import { PaymentRepository } from "./payment.repository";
import { PaymentResolver } from "./payment.resolver";
import { PaymentService } from "./payment.service";

@Module({
  imports: [OrderModule],
  providers: [PaymentResolver, PaymentService, PaymentRepository],
})
export class PaymentModule {}
