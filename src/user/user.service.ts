import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEditDto, UserLoginDto, UserRegisterDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });

    return { access_token };
  }

  async register({ email, password, name }: UserRegisterDto) {
    return this.prisma.user.create({
      data: { email, password, name },
    });
  }

  async login({ email, password }: UserLoginDto) {
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

  async editUser(userId: number, dto: UserEditDto) {
    const newUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete newUser.password;

    return newUser;
  }
}
