export class CreateProductDTO {
    name: string;
    description: string;
    price: number;
    category: string;
  }

export class FilterProductDTO {
    search: string;
    category: string;
  }