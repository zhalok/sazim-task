import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { PrismaService } from './prisma/prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CommonModule } from './common/common.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true, // Auto-generates the schema
      playground: true, // Enable playground (GraphQL IDE)
      driver: ApolloDriver,
    }),
    ProductModule,
    CommonModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
