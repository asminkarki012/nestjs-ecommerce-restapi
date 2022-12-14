import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UserSchema } from "./schemas/user.schema";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
  exports:[UsersService],
  controllers: [UsersController],
  providers: [UsersService,AuthService,JwtService],
})
export class UsersModule {}
