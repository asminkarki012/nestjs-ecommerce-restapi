import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({
    toJSON: {
      virtuals: true,
    },
  })
export class Product {

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  actualprice: number;

  @Prop({max:100,min:0,default:0})
  discountpercent:number;

  discountprice:number;
    
  @Prop()
  category: [string];
}

const ProductSchema = SchemaFactory.createForClass(Product);

//to calculate discountprice
ProductSchema.virtual('dicountprice').get(function (this: ProductDocument) {
    if(this.discountpercent!==0){
    return this.actualprice-((this.discountpercent)/100)*this.actualprice;
    }else{
        return this.actualprice;
    }
  });

export {ProductSchema}


