import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { WalletModule } from "./wallet/wallet.module";
import { CategoryModule } from "./category/category.module";
import { TransactionModule } from "./transaction/transaction.module";
import { ReportModule } from "./report/report.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    WalletModule,
    CategoryModule,
    TransactionModule,
    ReportModule,
    HealthModule,
  ],
})
export class AppModule {}
