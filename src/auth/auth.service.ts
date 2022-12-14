import { Injectable,Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { UsersService } from 'src/users/users.service';
// import { User } from 'src/users/interfaces/user.interface';
// import { Body } from '@nestjs/common/decorators';
// import { CreateUserDto } from 'src/users/dto/create-user.dto';
@Injectable()
export class AuthService {

    logger:Logger;

    constructor(private usersService: UsersService,private jwtService:JwtService) {
      this.logger = new Logger("Validation logger");

    }

    async validateUser(email:string,password:string): Promise<any> {
      const user = await this.usersService.findOne(email);
      this.logger.debug("test");
      // this.logger.debug(user);
      // console.log(user);
      if (user && user.password === password) {
          console.log(user);
          const {password,...result} = user;
          return result;
      }
    return null;
    }

    async login(user: any) {
      console.log("JWT validation")
      console.log(user.email,user._id);
      const payload = { username: user.email, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
      };


    }



}
