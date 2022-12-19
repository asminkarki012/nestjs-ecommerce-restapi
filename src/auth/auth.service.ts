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

@Injectable()
export class AuthService {
  logger: Logger;
  tokenList = new Object();
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
    this.logger = new Logger("Validation logger");
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    this.logger.debug("test");
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    // this.logger.debug(user);
    // console.log(user);
    if (user && isPasswordMatch) {
      console.log(user);
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    //called from login controller
    console.log("JWT validation");
    console.log(user.email, user._id);
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

  async changePassword(changePassword: any):Promise<Object> {
    console.log("changePassword function working");

    //for future update use access token payload to get email
    const user = await this.usersService.findOne(changePassword.email);
    if (!user) {
      return new NotFoundException();
    }
    const oldpassword = changePassword.oldpassword;
    const validated = await bcrypt.compare(oldpassword, user.password);
    console.log(validated);
    if (!validated) {
      return new UnauthorizedException();
    }
    const newpassword = changePassword.newpassword;
    const confirmpassword = changePassword.confirmpassword;
    if (newpassword !== confirmpassword) {
      return response
        .status(401)
        .json({ message: "New password doesnot match with confirm password" });
    }

    const newhashedPass = await bcrypt.hash(confirmpassword, 10);
    const updatedPasswordUser = await this.usersService.updatePassword(
      user.email,
      newhashedPass
    );

    console.log(updatedPasswordUser);
    return updatedPasswordUser;
  }
}
