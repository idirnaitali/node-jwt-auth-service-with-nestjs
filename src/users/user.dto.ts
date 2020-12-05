export class UserDto {
  readonly createdDate: Date = new Date();
  password: string;
  lastConnectionDate: Date;
  connectionsCount = 0;
  constructor(
    readonly userId: string,
    readonly firstname: string,
    readonly lastname: string,
    readonly username: string,
    readonly roles: string[],
  ) {
    this.password = userId.substring(0, 8);
  }

  updateConnectionInfo(): void {
    this.lastConnectionDate = new Date();
    this.connectionsCount = this.connectionsCount + 1;
  }
}
