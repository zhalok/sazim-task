import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { OrderModule } from 'src/order/order.module';
import { PaymentRepository } from './payment.repository';

@Module({
  imports: [OrderModule],
  providers: [PaymentResolver, PaymentService, PaymentRepository],
})
export class PaymentModule {}
