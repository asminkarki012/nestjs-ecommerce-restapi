import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from './auth/auth.module';
import config from "./config/keys";
import { ProductsModule } from './products/products.module';
import { MailerModule } from "@nestjs-modules/mailer";
import { CartModule } from './cart/cart.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OrdersModule } from './orders/orders.module';


@Module({
  imports: [UsersModule, MongooseModule.forRoot(config.mongoURI), AuthModule,MailerModule.forRoot({
    transport:{
      service:"gmail",
      host:"smtp.gmail.com",
      secure:false,
      auth:{
        user:config.GMAIL_ACC,
        pass:config.GMAIL_PASS
      }
    }
  }) ,ProductsModule, CartModule, CloudinaryModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
