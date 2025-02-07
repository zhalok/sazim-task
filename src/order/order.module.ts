import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { OrderRepository } from './order.repository';

@Module({
  providers: [OrderResolver, OrderService,OrderRepository],
})
export class OrderModule {}
