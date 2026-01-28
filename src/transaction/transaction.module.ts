import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";

@Module({
  imports: [JwtModule.register({})],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
