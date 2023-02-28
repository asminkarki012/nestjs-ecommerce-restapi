import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { CartSchema } from "./schemas/cart.schema";
import { UsersModule } from "src/users/users.module";
import { ProductsService } from "src/products/products.service";
import { ProductsModule } from "src/products/products.module";
@Module({
  imports: [UsersModule,ProductsModule,MongooseModule.forFeature([{ name: "Cart", schema: CartSchema }])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
