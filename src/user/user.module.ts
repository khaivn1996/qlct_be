import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthModule } from "../auth/auth.module";
import { UserController } from "./user.controller";

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
