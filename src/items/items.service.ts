import { Injectable } from "@nestjs/common";
import { Item } from "./interfaces/item.interface";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
// import {CreateImte} from './dto/create-item.dto.ts';

@Injectable()
export class ItemsService {
  constructor(@InjectModel("Item") private readonly itemModel: Model<Item>) {}

  // private readonly items: Item[] = [
  // {
  //     id:"298302",
  //     name:"item one",
  //     description:"this is item one",
  //     qty:100
  // },

  // {
  //     id:"291892",
  //     name:"item two",
  //     description:"this is item two",
  //     qty:100
  // }
  // ];

  async findAll(): Promise<Item[]> {
    return await this.itemModel.find();
  }

  async findOne(id: string): Promise<Item> {
    return await this.itemModel.findOne({ _id: id });
  }

  async createItem(item: Item): Promise<Item> {
    const newItem = new this.itemModel(item);
    return await newItem.save();
  }

  async deleteItem(id:string):Promise<Item>{
    return await this.itemModel.findByIdAndDelete({_id:id});
  }

  async updateItem(id:string,item:Item):Promise<Item>{
    return await this.itemModel.findByIdAndUpdate({_id:id},{
        $set:item
    },{new:true});
  }
}
