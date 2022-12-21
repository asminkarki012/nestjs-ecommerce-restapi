export class CreateProductDTO {
    name: string;
    description: string;
    actualprice: number;
    discountpercent?:number;
    discountprice:number;
    category: string;
  }

export class FilterProductDTO {
    search: string;
    category: string;
  }