"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
const crypto = __importStar(require("crypto"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("Email already registered");
        }
        const passwordHash = await argon2.hash(dto.password);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
            },
        });
        await this.prisma.wallet.create({
            data: {
                userId: user.id,
                name: "Ví chính",
                currency: "VND",
            },
        });
        const defaultCategories = [
            { name: "Ăn uống", icon: "Bowl", type: client_1.TransactionType.EXPENSE },
            { name: "Mua sắm", icon: "ShoppingCart", type: client_1.TransactionType.EXPENSE },
            { name: "Đi lại", icon: "Van", type: client_1.TransactionType.EXPENSE },
            { name: "Hóa đơn", icon: "Document", type: client_1.TransactionType.EXPENSE },
            { name: "Sức khỏe", icon: "FirstAidKit", type: client_1.TransactionType.EXPENSE },
            { name: "Giải trí", icon: "Film", type: client_1.TransactionType.EXPENSE },
            { name: "Giáo dục", icon: "Reading", type: client_1.TransactionType.EXPENSE },
            { name: "Khác", icon: "More", type: client_1.TransactionType.EXPENSE },
            { name: "Lương", icon: "Money", type: client_1.TransactionType.INCOME },
            { name: "Thưởng", icon: "Present", type: client_1.TransactionType.INCOME },
            { name: "Thu khác", icon: "Coin", type: client_1.TransactionType.INCOME },
        ];
        await this.prisma.category.createMany({
            data: defaultCategories.map((cat) => ({
                userId: user.id,
                name: cat.name,
                icon: cat.icon,
                type: cat.type,
            })),
        });
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }
    async refresh(refreshToken) {
        const tokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");
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
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
        await this.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revokedAt: new Date() },
        });
        const tokens = await this.generateTokens(storedToken.user.id, storedToken.user.email);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: storedToken.user.id,
                email: storedToken.user.email,
            },
        };
    }
    async logout(refreshToken) {
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
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new common_1.BadRequestException("User not found");
        }
        return user;
    }
    async generateTokens(userId, email) {
        const accessTokenPayload = { sub: userId, email };
        const refreshTokenPayload = { sub: userId, email, type: "refresh" };
        const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
            secret: this.configService.get("JWT_ACCESS_SECRET"),
            expiresIn: this.configService.get("JWT_ACCESS_EXPIRES_IN") || "15m",
        });
        const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
            secret: this.configService.get("JWT_REFRESH_SECRET"),
            expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN") || "7d",
        });
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map