import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UserSchema } from "./schemas/user.schema";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "src/auth/auth.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
  exports:[UsersService,UsersModule],
  controllers: [UsersController],
  providers: [UsersService,AuthService,JwtService],
})
export class UsersModule {}
