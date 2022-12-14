import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Body,
  Param,
} from "@nestjs/common";
import { CreateItemDto } from "./dto/create-item.dto";
import { ItemsService } from "./items.service";
import { Item } from "./interfaces/item.interface";
@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
   findAll(): Promise<Item[]> {
    return  this.itemsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Post()
  createItem(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.itemsService.createItem(createItemDto);
  }

  @Put(":id")
  updateItem(
    @Param("id") id,
    @Body() updateItem: CreateItemDto
  ): Promise<Item> {
    return this.itemsService.updateItem(id, updateItem);
  }

  @Delete(":id")
  deleteItem(@Param("id") id): Promise<Item> {
    return this.itemsService.deleteItem(id);
  }
}
