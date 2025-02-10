import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { CommonModule } from './common/common.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true, // Auto-generates the schema
      playground: true, // Enable playground (GraphQL IDE)
      driver: ApolloDriver,
      context: ({ req }) => ({ req }),
    }),
    ProductModule,
    CommonModule,
    OrderModule,
    PaymentModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
