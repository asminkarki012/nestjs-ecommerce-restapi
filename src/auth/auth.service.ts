import {
  Injectable,
  Logger,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";
import { jwtConstants } from "./constants";
import { response } from "express";
import { MailerService } from "@nestjs-modules/mailer/dist";
import config from "../config/keys";
import { HttpException } from "@nestjs/common/exceptions";
import { HttpStatus } from "@nestjs/common/enums";

@Injectable()
export class AuthService {
  logger: Logger;
  tokenList = new Object();
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService:MailerService

  ) {
    this.logger = new Logger("Validation logger");
  }

  async validateUser(email: string, password: string): Promise<any> {
    console.log("Auth service validate User");
    const user = await this.usersService.findOne(email);
    this.logger.debug("test");
    // const isPasswordMatch = await bcrypt.compare(password, user.password);
    // this.logger.debug(user);
    // console.log(user);
    if (user && password === user.password) {
      console.log(user);
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    //called from login controller
    console.log("JWT validation");
    console.log(user);
    console.log(user.email, user._id);
    if(user.active !== true){
      return "Email not Verified";
    }
    const payload = { username: user.email, sub: user._id, roles: user.roles };
    const tokens = await this.getTokens(payload);
    this.tokenList[tokens.refreshToken] = tokens;
    // console.log(this.tokenList);
    return tokens;
  }

  async getTokens(payload: any) {
    console.log("getToken function");
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: "40s",
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.secretRefreshKey,
        expiresIn: "24h",
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(payload: any, refreshToken: string): Promise<object> {
    console.log("Running refreshtokens function");
    console.log(refreshToken);
    const { iat, exp, ...data } = payload;
    if (refreshToken in this.tokenList) {
      const tokens = await this.getTokens(data);
      return { access_token: tokens.accessToken };
    } else {
      throw new ForbiddenException("Access Denied");
    }
  }

  async changePassword(payload:any,changePassword:any):Promise<Object> {
    console.log("changePassword function working");
    console.log(payload);
    //for future update use access token payload to get email
    const user = await this.usersService.findOne(payload.username);
    
    console.log(user);
    if (!user) {
      return new NotFoundException();
    }
    const oldpassword = changePassword.oldpassword;
    // const validated = await bcrypt.compare(oldpassword, user.password);
    // console.log(validated);
    if (oldpassword !== user.password) {
      return new UnauthorizedException();
    }
    const newpassword = changePassword.newpassword;
    const confirmpassword = changePassword.confirmpassword;
    if (newpassword !== confirmpassword) {
      return response
        .status(401)
        .json({ message: "New password doesnot match with confirm password" });
    }

    // const newhashedPass = await bcrypt.hash(confirmpassword, 10);
    const updatedPasswordUser = await this.usersService.updatePassword(
      user.email,
      confirmpassword
    );

    console.log(updatedPasswordUser);
    return updatedPasswordUser;
  }

  async mailer(recepient:string):Promise<any>{
    console.log("authservice mailer function");
      const otp =  Math.floor(1000 + Math.random() * 9000);
      // const hashedOtp 
      console.log(otp);
      
    await this.mailService.sendMail({
      to:recepient,
      from:"Testingnoreply@gmail.com",
      subject:"OTP",
      html:`Your OTP code is <b>${otp}</b> \n expires in 2 minutes`
    })

  return  this.usersService.addOtp(recepient,otp);
  }

  async otpVerify(email:string,otp:number):Promise<any>{
    console.log("otpVerify function in authservice");
    const user = await this.usersService.findOne(email);
    console.log(user);
    // console.log(user.otpExpiresAt-Date.now());

    //check otp expiration time for 2 minutes
    if( Date.now()-user.otpExpiresAt  >= 120000){
      return "OTP expired";
    }

    if(user.otp === otp){
      return this.usersService.updateActive(user.email)
    }else{
      //call resend mailer function 
      
    }
     

  }

  async forgotPassword(email:string,){
    console.log("forgotpassword function in auth service");





  }


  async forgotPasswordMailer(recepient:string):Promise<any>{
    console.log("authservice mailer function");
      const otp =  Math.floor(1000 + Math.random() * 9000);
      // const hashedOtp 
      console.log(otp);
      
    await this.mailService.sendMail({
      to:recepient,
      from:"Testingnoreply@gmail.com",
      subject:"Reset Your Password",
      html:`Your OTP code is <b>${otp}</b> to reset password \n expires in 1 minute`
    })

  return  this.usersService.addOtp(recepient,otp);
  }
 
  async forgotPasswordOtpVerify(email:string,otp:number){


  }
}
