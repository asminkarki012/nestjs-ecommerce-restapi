import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { User } from "./interfaces/user.interface";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { RegisterUserDto } from "./dto/user.dto";
import * as bcrypt from "bcrypt";
import { UserDocument } from "./schemas/user.schema";
import { response } from "express";

@Injectable()
export class UsersService {
  logger: Logger;
  constructor(
    @InjectModel("User") private readonly userModel: Model<UserDocument>
  ) {
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

  async registerUser(registerUser: RegisterUserDto): Promise<any> {
    const { email } = registerUser;
    console.log(registerUser);
    const user = await this.userModel.findOne({ email: email });
    // console.log(user);
    if (user) {
      return new HttpException("user already exists", HttpStatus.BAD_REQUEST);
    }
    const newUser = new this.userModel(registerUser);
    // newUser.password = await bcrypt.hash(newUser.password, 10);
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
    const { password, ...result } = updateUser;
    return result;
  }

  async updatePassword(email: string, confirmpassword: string) {
    console.log("updatePassword function in users service");

    // const newhashedPass = await bcrypt.hash(confirmpassword, 10);
    const updatedPassword = await this.userModel.findOneAndUpdate(
      { email: email },
      { $set: { password: confirmpassword } },
      { new: true }
    );
    return updatedPassword;
  }

  async addOtp(email: string, otp: number): Promise<object> {
    console.log("add otp in user service");
    console.log("otp");
    const updatedOtp = await this.userModel.findOneAndUpdate(
      { email: email },
      { $set: { otp: otp, otpExpiresAt: Date.now() } },
      { new: true }
    );
    return updatedOtp;
  }

  async updateActive(email: string): Promise<String> {
    console.log("users service updateactive function");
    console.log(email);
    await this.userModel.findOneAndUpdate(
      { email: email },
      { $set: { active: true, otpExpiresAt: Date.now() } },
      { new: true }
    );
    return "Email Verification successfull";
  }

  async forgotPasswordAddOtp(email: string, otp: number) {
    console.log("add forgot password otp in user service");
    const updatedForgotPasswordOtp = await this.userModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          forgotPasswordOtp: otp,
          forgotPasswordOtpExpiresAt: Date.now(),
        },
      },
      { new: true }
    );
    return updatedForgotPasswordOtp;
  }

  async updateForgotPasswordFlag(email: string): Promise<object> {
    console.log("users service updateforgotpasswordflag function");
    console.log(email);
    const user = await this.userModel.findOne({ email: email });
    // user.forgotPasswordOtpFlag = true;
    if (user.forgotPasswordOtpFlag === false) {
      const updateForgotPasswordFlag = await user.updateOne(
        { $set: { forgotPasswordOtpFlag: true } },
        { new: true }
      );
      return {
        message: "You can your resetpassword",
        updateForgotPasswordFlag,
      };
    // } else {
    //   const updateForgotPasswordFlag = await user.updateOne(
    //     { $set: { forgotPasswordOtpFlag: false } },
    //     { new: true }
    //   );
    //   return updateForgotPasswordFlag;
    }

  }

   
  async initialForgotPasswordFlag(email: string): Promise<object> {
    const user = await this.userModel.findOne({ email: email });
    // user.forgotPasswordOtpFlag = true;
      const updateForgotPasswordFlag = await user.updateOne(
        { $set: { forgotPasswordOtpFlag: false } },
        { new: true }
      );
      return updateForgotPasswordFlag;
      };
  // async forgotPassword(email:string){
  //   console.log("forgotPassword function in users service");
  //   const updatedPassword = await this.userModel.findOneAndUpdate(
  //     { email: email },
  //     { $set: { password: newhashedPass } },
  //     { new: true }
  //   );
  //   return updatedPassword;

  // }
}
