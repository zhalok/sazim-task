import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService {
  private prismaClient: PrismaClient;
  constructor() {
    if (!this.prismaClient) {
      this.prismaClient = new PrismaClient();
    }
  }
  getPrismaClient(): PrismaClient {
    if (!this.prismaClient) {
      this.prismaClient = new PrismaClient();
    }
    return this.prismaClient;
  }
}
