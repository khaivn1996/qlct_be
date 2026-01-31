import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import * as crypto from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto, LoginDto } from "./dto";
import { TransactionType } from "../common/enums";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    // Hash password
    const passwordHash = await argon2.hash(dto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
      },
    });

    // Create default wallet
    await this.prisma.wallet.create({
      data: {
        userId: user.id,
        name: "Ví chính",
        currency: "VND",
      },
    });

    // Create default categories
    const defaultCategories = [
      { name: "Ăn uống", icon: "Bowl", type: TransactionType.EXPENSE },
      { name: "Mua sắm", icon: "ShoppingCart", type: TransactionType.EXPENSE },
      { name: "Đi lại", icon: "Van", type: TransactionType.EXPENSE },
      { name: "Hóa đơn", icon: "Document", type: TransactionType.EXPENSE },
      { name: "Sức khỏe", icon: "FirstAidKit", type: TransactionType.EXPENSE },
      { name: "Giải trí", icon: "Film", type: TransactionType.EXPENSE },
      { name: "Giáo dục", icon: "Reading", type: TransactionType.EXPENSE },
      { name: "Khác", icon: "More", type: TransactionType.EXPENSE },
      { name: "Lương", icon: "Money", type: TransactionType.INCOME },
      { name: "Thưởng", icon: "Present", type: TransactionType.INCOME },
      { name: "Thu khác", icon: "Coin", type: TransactionType.INCOME },
    ];

    await this.prisma.category.createMany({
      data: defaultCategories.map((cat) => ({
        userId: user.id,
        name: cat.name,
        icon: cat.icon,
        type: cat.type,
      })),
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  async refresh(refreshToken: string) {
    // Hash the refresh token to compare with stored hash
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // Find the token in database
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!storedToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    // Revoke old token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Generate new tokens
    const tokens = await this.generateTokens(
      storedToken.user.id,
      storedToken.user.email,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: storedToken.user.id,
        email: storedToken.user.email,
        avatar: storedToken.user.avatar,
      },
    };
  }

  async logout(refreshToken: string) {
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    return { message: "Logged out successfully" };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    return user;
  }

  private async generateTokens(userId: string, email: string) {
    const accessTokenPayload = { sub: userId, email };
    const refreshTokenPayload = { sub: userId, email, type: "refresh" };

    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
      expiresIn:
        this.configService.get<string>("JWT_ACCESS_EXPIRES_IN") || "15m",
    });

    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn:
        this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") || "7d",
    });

    // Store refresh token hash in database
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}
