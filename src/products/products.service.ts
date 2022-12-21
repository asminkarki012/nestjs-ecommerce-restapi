import { Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDTO } from './dto/product.dto';
import { FilterProductDTO } from './dto/product.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
    constructor(@InjectModel("Product") private readonly productModel:Model<ProductDocument>){}

    async addProduct(createProductDTO: CreateProductDTO): Promise<Product> {
        const newProduct = await this.productModel.create(createProductDTO);
        return newProduct.save();
      }

      async getAllProducts(): Promise<Product[]> {
        const products = await this.productModel.find();
        return products;
      } 

      async getProduct(id: string): Promise<Product> {
        const product = await this.productModel.findById(id);
        return product;
      }

      async getFilteredProducts(filterProductDTO: FilterProductDTO): Promise<Product[]> {
        const { category, search } = filterProductDTO;
        let products = await this.getAllProducts();
    
        if (search) {
          products = products.filter(product => 
            product.name.includes(search) ||
            product.description.includes(search)
          );
        }
    
        if (category) {
          products = products.filter(product =>product.category.includes(category) );
        }
    
        return products;
      }

      async updateProduct(id: string, createProductDTO: CreateProductDTO): Promise<Product> {
        const updatedProduct = await this.productModel
          .findByIdAndUpdate(id, createProductDTO, { new: true });
        return updatedProduct;
      }

      async deleteProduct(id: string): Promise<any> {
        const deletedProduct = await this.productModel.findByIdAndRemove(id);
        return deletedProduct;
      }


}
