import { Injectable, Logger, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";
import { jwtConstants } from "./constants";
// import { User } from 'src/users/interfaces/user.interface';
// import { Body } from '@nestjs/common/decorators';
// import { CreateUserDto } from 'src/users/dto/create-user.dto';

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
    // return {
    //   access_token: this.jwtService.sign(payload),
    // };
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

  async refreshTokens(payload: any, refreshToken: string) {
    console.log("Running refreshtokens function");
    console.log(refreshToken);
    const {iat,exp,...data} = payload
    if (refreshToken in this.tokenList) {
      const tokens = await this.getTokens(data);
      return { access_token: tokens.accessToken };
    } else {
      throw new ForbiddenException("Access Denied");
    }
  }
}
