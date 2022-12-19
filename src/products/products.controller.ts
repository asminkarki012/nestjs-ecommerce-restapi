import { Controller,Post,Body,Get,NotFoundException,Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './dto/product.dto';
import { FilterProductDTO } from './dto/product.dto';

@Controller('store/products')
export class ProductsController {
    constructor(private productService:ProductsService){}

    @Post('/add')
    async addProduct(@Body() createProductDTO: CreateProductDTO) {
      const product = await this.productService.addProduct(createProductDTO);
      return product;
    }

    @Get('/:id')
    async getProduct(@Param('id') id: string) {
      const product = await this.productService.getProduct(id);
      if (!product) throw new NotFoundException('Product does not exist!');
      return product;
    }


}
