import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { User } from "./interfaces/user.interface";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { RegisterUserDto } from "./dto/user.dto";
import * as bcrypt from "bcrypt";
import { UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  logger: Logger;
  constructor(@InjectModel("User") private readonly userModel: Model<UserDocument>) {
    this.logger = new Logger();
  }

  async findAll(): Promise<User[]> {
    console.log("findAll function");
    return await this.userModel.find();
  }

  async findOne(email: string): Promise<User> {
    console.log("findOne function");
    const user = await this.userModel.findOne({ email: email });
    return user;

  }

  async registerUser(registerUser: RegisterUserDto): Promise<User> {
    
    const { email } = registerUser;
    console.log(registerUser);
    const user = await this.userModel.findOne({ email: email });
    // console.log(user);
    if (user) {
      throw new HttpException("user already exists", HttpStatus.BAD_REQUEST);
    }
    const newUser = new this.userModel(registerUser);
    newUser.password = await bcrypt.hash(newUser.password, 10); 
     return await newUser.save();
  }


  // async loginUser(email:string): Promise<User> {
  //   const user = await this.userModel.findOne({email:email});
  //   this.logger.log(user);
  //   return user;
  // }

  async deleteUser(email: string): Promise<User> {
    return await this.userModel.findByIdAndDelete({ email: email });
  }

  async updateUser(email: string, user: User): Promise<User> {
    const updateUser = await this.userModel.findOneAndUpdate(
      { email: email },
      {
        $set: user,
      },
      { new: true }
    );
    const{password,...result} = updateUser;
    return result;
  }

  async updatePassword(email:string,newhashedPass:string){

    const updatedPasswordUser = await this.userModel.findOneAndUpdate(
      {email:email,
        $set: { password: newhashedPass },
      },
      { new: true }
    );
    return updatedPasswordUser
    }
}
