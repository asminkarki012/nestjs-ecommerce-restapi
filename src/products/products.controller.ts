import {
  Controller,
  Post,
  Body,
  Get,
  NotFoundException,
  Param,
  Put,
  Delete,
  Query,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDTO } from "./dto/product.dto";
import { FilterProductDTO } from "./dto/product.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProductPicDto } from "./dto/productimage.dto";
@Controller("store/products")
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get("/")
  async getProducts(@Query() filterProductDTO: FilterProductDTO) {
    console.log(filterProductDTO);

    if (Object.keys(filterProductDTO).length) {
      console.log("first in getproducts");
      const filteredProducts = await this.productService.getFilteredProducts(
        filterProductDTO
      );
      console.log(filteredProducts);
      return filteredProducts;
    } else {
      const allProducts = await this.productService.getAllProducts();
      return allProducts;
    }
  }

  @Post("/add")
  @UseInterceptors(FileInterceptor("productpic"))
  async addProduct(
    @Body() createProductDTO: CreateProductDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 250000 }), //250kb
          new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    // createProductDTO.productimageurl= this. 
    const product = await this.productService.addProduct(createProductDTO,file);
    return product;
  }

  @Get("/:id")
  async getProduct(@Param("id") id: string) {
    const product = await this.productService.getProduct(id);
    if (!product) throw new NotFoundException("Product does not exist!");
    return product;
  }

  @Put("/:id")
  async updateProduct(
    @Param("id") id: string,
    @Body() createProductDTO: CreateProductDTO
  ) {
    const product = await this.productService.updateProduct(
      id,
      createProductDTO
    );
    if (!product) {
      return new NotFoundException("Product does not exist!");
    }

    return product;
  }

  @Delete("/:id")
  async deleteProduct(@Param("id") id: string) {
    const product = await this.productService.deleteProduct(id);
    if (!product) return new NotFoundException("Product does not exist");
    return product;
  }

  // @Post("/upload/productpic")
  // @UseInterceptors(FileInterceptor("productpic"))
  // uploadFile(
  //   @Body() productpicdto: ProductPicDto,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 250000 }), //250kb
  //         new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
  //       ],
  //     })
  //   )
  //   file: Express.Multer.File
  // ) {
  //   console.log(file);
  //   return this.productService.uploadProductPic(productpicdto.id, file);
  // }
}
