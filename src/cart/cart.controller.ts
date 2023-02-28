import { Controller, Post ,Delete,Body,Request,NotFoundException, UseGuards,Param} from "@nestjs/common";
import { AccessTokenGuard } from "src/auth/accessToken.guard";
import { Role } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { CartService } from "./cart.service";
import { ItemDTO } from "./dto/item.dto";

@Controller("cart")
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.User)
  @Post("/")
  async addItemToCart(@Request() req, @Body() itemDTO: ItemDTO) {
    const userId = req.user.userId;
    console.log(userId);
    const cart = await this.cartService.addItemToCart(userId, itemDTO);
    return cart;
  }

  @Delete("/")
  async removeItemFromCart(@Request() req, @Body() { productId }) {
    const userId = req.user.userId;
    const cart = await this.cartService.removeItemFromCart(userId, productId);
    if (!cart) throw new NotFoundException("Item does not exist");
    return cart;
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.User)
  @Delete('/:id')
  async deleteCart(@Param('id') userId: string) {
    const cart = await this.cartService.deleteCart(userId);
    if (!cart) throw new NotFoundException('Cart does not exist');
    return cart;
  } 

  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles(Role.User)
  // @Delete('/:id')
  // async getCart(@Param('id') userId: string) {
  //   const cart = await this.cartService.deleteCart(userId);
  //   if (!cart) throw new NotFoundException('Cart does not exist');
  //   return cart;
  // } 
  

}
