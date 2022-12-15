import {
  Controller,
  Body,
  Post,
  Get,
  Logger,
  Param,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";
import { LoginUserDto } from "src/users/dto/user.dto";
import { UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./local-auth.guard";
import { RegisterUserDto } from "src/users/dto/user.dto";
import { User } from "src/users/interfaces/user.interface";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Roles } from "./roles.decorator";
import { Role } from "./role.enum";
import { RolesGuard } from "./roles.guard";

@Controller("/api/auth/users")
export class AuthController {
  private readonly logger = new Logger();
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Post("/register")
  registerUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    console.log("register route");
    return this.usersService.registerUser(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  login(@Request() req): any {
    // information are stored in request
    // const user = await this.userService.findOne(LoginDTO.email);
    console.log("login route");
    //return everything except password
    const { password, ...result } = req.user._doc;
    // return result;
    return this.authService.login(result);
  }
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.Admin)
  @Get("/getallusers")
  findAll(): Promise<User[]> {
    console.log("getall users route");
    return this.usersService.findAll();
  }

  @Get(":email")
  findOne(@Param("email") email):Promise<User>{
    console.log("get one user route");
    return this.usersService.findOne(email);
  }

}
