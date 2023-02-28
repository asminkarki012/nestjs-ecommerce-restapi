import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// export type ProductDocument = Product & Document;

@Schema()
export class Item {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  category: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
// export const ItemSchema = new mongoose.Schema({
//     name:String,
//     description:String,
//     qty:Number
// });
