import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Body,
  Param,
  Logger,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { User } from "./interfaces/user.interface";
import { LocalAuthGuard } from "src/auth/local-auth.guard";
import { AuthGuard } from "@nestjs/passport/dist";
import { Req, UseGuards } from "@nestjs/common/decorators";
@Controller("/api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger();

  // @Post("/register")
  // registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {

  //   return this.usersService.registerUser(createUserDto);
  // }

  // @UseGuards(LocalAuthGuard)
  // @Post("/login")
  // loginUser(@Req() req):any  {
  //   return "Login route";
  // }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // @UseGuards(AuthGuard('local'))
  @Get(":email")
  findOne(@Param("email") email): Promise<User> {
    this.logger.debug("get email route");
    return this.usersService.findOne(email);
  }

  @Put(":email")
  updateUser(
    @Param("email") email,
    @Body() updateUser: CreateUserDto
  ): Promise<User> {
    return this.usersService.updateUser(email, updateUser);
  }

  @Delete(":email")
  deleteUser(@Param("email") email): Promise<User> {
    return this.usersService.deleteUser(email);
  }
}
