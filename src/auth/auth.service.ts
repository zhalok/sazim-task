import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  hash(plainPass) {
    // abstraction of hashing
    return plainPass;
  }

  hashCompare(hashedPass, plainPass) {
    if (this.hash(plainPass) === hashedPass) {
      return true;
    } else return false;
  }

  async login({ email, password }: { email: string; password: string }) {
    const prisma = this.prismaService.getPrismaClient();
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.UNAUTHORIZED);
    }

    if (!this.hashCompare(user.password, password)) {
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }

    const payload: {
      email: string;
      role: string;
      userId: string;
      sellerId?: string;
      companyId?: String;
    } = {
      email: user.email,
      role: user.role,
      userId: user.id,
    };

    switch (user.role) {
      case 'SELLER':
        const seller = await prisma.seller.findFirst({
          where: {
            userId: user.id,
          },
        });
        // in this case we have only one type of user
        // but in larger actual systems we may find several types of users with some of their own identities
        // therefore we will include them in the switch statement cases if required in the future
        payload['sellerId'] = seller.id;
        break;
    }
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
