import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserDto } from './user.dto';

export enum Role {
  DEV = 'DEV',
  ADMIN = 'ADMIN',
}

@Injectable()
export class UsersService {
  private readonly users: UserDto[];

  constructor() {
    this.users = this.initUsers();
  }

  async findUser(username: string): Promise<UserDto | undefined> {
    return this.users.find(user => user.username === username);
  }

  async changePass(userId: string, newPass: string) {
    const user: UserDto = await this.users.find(u => u.userId === userId);

    if (!user) {
      throw new ForbiddenException();
    }

    if (user.password === newPass) {
      throw new BadRequestException(
        'Unchanged pass value',
        'Must be different from the old one',
      );
    }

    user.password = newPass;
  }

  getConnectedUsersInfo(): UserDto[] {
    return this.users.map(user => {
      const { username, password, firstname, lastname, ...result } = user;
      return result as UserDto;
    });
  }

  private initUsers() {
    return Array.of(
      new UserDto(
        '57e0d1de-ea51-4f4c-b4b1-860cdc993d4b',
        'Dev',
        'Developer',
        'dev@gmail.com',
        [Role.DEV],
      ),
      new UserDto(
        '1f3dd8da-b0ff-43a2-b58d-08de952b52d8',
        'Admin',
        'Administration',
        'admin@gmail.com',
        [Role.ADMIN, Role.DEV],
      ),
    );
  }
}
