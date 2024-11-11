import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.prisma.user.findUnique({
      where: { id: result.id },
    });

    return this.returnUserFieldsWithTokens(user);
  }

  async login(dto: AuthDto) {
    const { password, email } = dto;
    const user = await this.findUserByEmail(email);

    if (!user) throw new NotFoundException('Invalid email or password');

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      throw new NotFoundException('Invalid email or password');

    return this.returnUserFieldsWithTokens(user);
  }

  async register(dto: AuthDto) {
    const { password, email } = dto;
    const existingUser = await this.findUserByEmail(email);

    if (existingUser) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return this.returnUserFieldsWithTokens(user);
  }

  // Private method to issue tokens
  private async issueTokens(userId: string) {
    const payload = { id: userId };
    const accessToken = this.jwt.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwt.sign(payload, { expiresIn: '1d' });
    return { accessToken, refreshToken };
  }

  // Private method to find a user by email
  private async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Private method to return user fields with tokens
  private async returnUserFieldsWithTokens(user: User) {
    const tokens = await this.issueTokens(user.id);
    return { user: { id: user.id, email: user.email }, ...tokens };
  }
}
