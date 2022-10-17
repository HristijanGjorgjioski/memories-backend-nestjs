import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { UserLoginDto, UserRegisterDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {}

  async register({ email, password, name }: UserRegisterDto): Promise<User> {
    return this.prisma.user.create({
      data: { email, password, name },
    });
  }

  async login({ email, password }: UserLoginDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials Incorrect');

    const passwordMatch = await argon.verify(user.password, password);
    if (!passwordMatch) throw new ForbiddenException('Credentials Incorrect');

    return user;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
