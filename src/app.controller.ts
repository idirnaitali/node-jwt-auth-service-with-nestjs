import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  BadRequestException,
  Body,
  Put,
  HttpCode,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { UserDto } from './users/user.dto';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';
import { Role } from './users/users.service';

interface TokenPayload {
  readonly username: string;
  readonly password: string;
}

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    @InjectPinoLogger(AppController.name)
    private readonly log: PinoLogger,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/users/login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/current')
  getProfile(@Request() req) {
    const { userId, firstname, lastname, username, roles } = req.user;
    return { userId, firstname, lastname, username, roles };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/users/pass')
  @HttpCode(204)
  async changePass(
    @Request() req,
    @Body() payload: TokenPayload,
  ): Promise<void> {
    if (!payload || !payload.password) {
      throw new BadRequestException();
    }
    await this.authService.changePass(req.user.userId, payload.password);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/users/connected')
  async getConnectedUsersInfo(@Request() req): Promise<UserDto[]> {
    return this.authService.getConnectedUsersInfo();
  }
}
