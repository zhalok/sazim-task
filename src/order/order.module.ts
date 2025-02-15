import { Module } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { OrderResolver } from "./order.resolver";
import { OrderService } from "./order.service";

@Module({
  providers: [OrderResolver, OrderService, OrderRepository],
  exports: [OrderRepository],
})
export class OrderModule {}
