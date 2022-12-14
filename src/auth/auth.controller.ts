import { Controller,Body,Post,Get,Logger, Param,Request} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";
import { LoginUserDto } from "src/users/dto/create-user.dto";
import { UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./local-auth.guard";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/interfaces/user.interface";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("/api/auth")
export class AuthController {

  private readonly logger = new Logger(); 
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Post("/register")
  registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {

    return this.usersService.registerUser(createUserDto);
  }
 
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  login(@Request() req): any {
    
    // information are stored in request
    // const user = await this.userService.findOne(LoginDTO.email);
    console.log("login route");
    //return everything except password
    const {password,...result} = req.user._doc;
    return this.authService.login(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getallusers')
  findAll(): Promise<User[]> {
    console.log("getall users route");
    return this.usersService.findAll();
  }
}
