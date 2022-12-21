import { Controller,Post,Body,Get,NotFoundException,Param, Put, Delete } from '@nestjs/common';
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

    @Put('/:id')
    async updateProduct(@Param('id') id: string, @Body() createProductDTO: CreateProductDTO): Promise<import("c:/Users/hp/Documents/VS_code/GritFeat-Fellowship/nestJS-api/nest-rest-api/src/products/schemas/product.schema").Product> {
      const product = await this.productService.updateProduct(id, createProductDTO);
      if (!product) throw new NotFoundException('Product does not exist!');
      return product;
    }

    @Delete('/:id')
    async deleteProduct(@Param('id') id: string) {
      const product = await this.productService.deleteProduct(id);
      if (!product) throw new NotFoundException('Product does not exist');
      return product;
    }

    




}
