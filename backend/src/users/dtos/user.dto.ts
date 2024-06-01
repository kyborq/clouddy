import { User } from '../schemas/user.schema';

export class UserDto {
  public id: string;
  public login: string;
  public name: string;

  constructor(user: User) {
    this.id = user._id;
    this.login = user.login;
    this.name = user.name;
  }
}
