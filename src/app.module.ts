import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
// import { ItemsController } from "./items/items.controller";
// import { ItemsService } from "./items/items.service";
import { ItemsModule } from "./items/items.module";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from './auth/auth.module';
import config from "./config/keys";
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from "./auth/roles.guard";

@Module({
  imports: [UsersModule,ItemsModule, MongooseModule.forRoot(config.mongoURI), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
