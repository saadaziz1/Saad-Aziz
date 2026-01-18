import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class ProductsService {
  constructor(private config: ConfigService) { }

  async getProducts() {
    const query = `
    {
      products {
        id
        name
        price
        image { url }
        sizes
      }
    }`;

    const res = await axios.post(
      this.config.get<string>('hygraph.endpoint') || '',
      { query },
      {
        headers: {
          Authorization: `Bearer ${this.config.get<string>('hygraph.token') || ''}`,
        },
      },
    );

    return res.data.data.products;
  }

  async findById(id: string) {
    const query = `
    {
      product(where: {id: "${id}"}) {
        id
        name
        price
        image { url }
        sizes
      }
    }`;

    const res = await axios.post(
      this.config.get<string>('hygraph.endpoint') || '',
      { query },
      {
        headers: {
          Authorization: `Bearer ${this.config.get<string>('hygraph.token') || ''}`,
        },
      },
    );

    return res.data.data.product;
  }
}
