import { Controller, Patch, Body, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../common/guards";
import { CurrentUser } from "../common/decorators";
import { UserResponseDto } from "../auth/dto";

@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Patch("me")
  @ApiOperation({ summary: "Update current user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile updated",
    type: UserResponseDto,
  })
  async updateMe(
    @CurrentUser() user: { sub: string },
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(user.sub, dto);
  }
}
