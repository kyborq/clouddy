import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto) {
    return new this.userModel(createUserDto).save();
  }

  async findByLogin(login: string) {
    return await this.userModel.findOne({ login });
  }

  async findById(id: string) {
    return await this.userModel.findOne({ _id: id });
  }

  async setRefreshToken(id: string, token?: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      { token: token || null },
    );
  }
}
