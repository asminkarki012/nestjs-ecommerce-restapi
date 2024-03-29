import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Product, ProductDocument } from "./schemas/product.schema";
import { CreateProductDTO } from "./dto/product.dto";
import { FilterProductDTO } from "./dto/product.dto";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel("Product")
    private readonly productModel: Model<ProductDocument>,
    private cloudinary: CloudinaryService
  ) {}

  async addProduct(createProductDTO: CreateProductDTO,file:Express.Multer.File): Promise<Product> {
    //typecasting into number since it is stored in formdata
    createProductDTO.actualprice = Number(createProductDTO.actualprice);
    createProductDTO.discountpercent = Number(createProductDTO.discountpercent);
    createProductDTO.productimageurl =  await this.uploadProductPic(file);
    console.log((createProductDTO.productimageurl));
    const newProduct = await this.productModel.create(createProductDTO);
    return newProduct.save();
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find();
    return products;
  }

  async getProduct(id: string): Promise<Product> {
    //populate is used for referencing
    // const product =  (await this.productModel.findById(id).populate("Product","name actualprice"));

    const product = await this.productModel.findById(id);
    console.log(product);
    return product;
  }

  async getFilteredProducts(
    filterProductDTO: FilterProductDTO
  ): Promise<Product[]> {
    const { category, search } = filterProductDTO;
    console.log("getFilteredProducts function in product service");
    let products = await this.getAllProducts();

    if (search) {
      products = products.filter(
        (product) =>
          product.name.includes(search) || product.description.includes(search)
      );
    }

    if (category) {
      products = products.filter((product) =>
        product.category.includes(category)
      );
    }

    return products;
  }

  async updateProduct(
    id: string,
    createProductDTO: CreateProductDTO
  ): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      { _id: id },
      createProductDTO,
      { new: true }
    );
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndRemove(id);
    return deletedProduct;
  }

  async uploadProductPic(file: Express.Multer.File): Promise<object> {
    const productPic = await this.cloudinary.uploadImage(file);
    // console.log(productPic);
    // const addProfilePicUrl = await this.productModel.findByIdAndUpdate(
    //   { _id: id, $set: { profilepic: productPic.url } },
    //   { new: true }
    // );
    console.log(typeof(productPic.url));
    return productPic.url;
  }

  // joining table
  // async checkProductReference(id: string): Promise<any> {
  //   console.log("checkproductReference function in productservice");
  //   const product = await this.productModel
  //     .findById(id)
  //     .populate("Product", "name actualprice");
  //   if (!product) {
  //     return new NotFoundException();
  //   }

  //   return product;
  // }
}
