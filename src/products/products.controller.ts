import { Controller,Post,Body,Get,NotFoundException,Param, Put, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './dto/product.dto';
import { FilterProductDTO } from './dto/product.dto';

@Controller('store/products')
export class ProductsController {
    constructor(private productService:ProductsService){}

    @Get('/')
    async getProducts(@Query() filterProductDTO: FilterProductDTO) {
      console.log(filterProductDTO);

      if (Object.keys(filterProductDTO).length) {
        console.log("first in getproducts");
        const filteredProducts = await this.productService.getFilteredProducts(filterProductDTO);
        console.log(filteredProducts);
        return filteredProducts;
      } else {
        const allProducts = await this.productService.getAllProducts();
        return allProducts;
      }
    }

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
    async updateProduct(@Param('id') id: string, @Body() createProductDTO: CreateProductDTO) {
      const product = await this.productService.updateProduct(id, createProductDTO);
      if (!product) {
        return new NotFoundException("Product does not exist!");
      }

    return product;
    }

    @Delete('/:id')
    async deleteProduct(@Param('id') id: string) {
      const product = await this.productService.deleteProduct(id);
      if (!product) return new NotFoundException('Product does not exist');
      return product;
    }






}
