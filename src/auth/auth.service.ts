import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<object> {
    const user = await this.usersService.findUser(username);
    if (user && user.password === password) {
      user.updateConnectionInfo();
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserDto) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  async changePass(userId: string, newPass: string) {
    await this.usersService.changePass(userId, newPass);
  }

  getConnectedUsersInfo(): UserDto[] {
    return this.usersService.getConnectedUsersInfo();
  }
}
