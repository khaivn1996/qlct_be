import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { WalletService } from "./wallet.service";
import { JwtAuthGuard } from "../common/guards";
import { CurrentUser } from "../common/decorators";

@ApiTags("Wallets")
@Controller("wallets")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: "Get all wallets for current user" })
  @ApiResponse({ status: 200, description: "List of wallets with balance" })
  async findAll(@CurrentUser() user: { sub: string }) {
    return this.walletService.findAll(user.sub);
  }
}
