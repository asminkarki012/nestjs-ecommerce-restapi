import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  actualprice: number;

  @Prop({ type: Number, max: 100, min: 0, default: 0 })
  discountpercent: number;

  // @Prop()
  // discountprice: number;
  @Prop({ type: String })
  productimageurl: string;

  @Prop({ type: Array })
  category: [string];
}

const ProductSchema = SchemaFactory.createForClass(Product);

//to calculate discountprice
// ProductSchema.virtual('dicountprice').get(function (this: ProductDocument) {
//     if(this.discountpercent!==0){
//     return this.actualprice-((this.discountpercent)/100)*this.actualprice;
//     }else{
//         return this.actualprice;
//     }
//   });

export { ProductSchema };
