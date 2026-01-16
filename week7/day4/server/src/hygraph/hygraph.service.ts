import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class HygraphService {
    private readonly endpoint: string;
    private readonly token: string;

    constructor(private config: ConfigService) {
        this.endpoint = this.config.get<string>('hygraph.endpoint') || '';
        this.token = this.config.get<string>('hygraph.token') || '';
    }

    /**
     * Execute a GraphQL query against Hygraph
     */
    async executeQuery<T = any>(
        query: string,
        variables?: Record<string, any>,
    ): Promise<T> {
        const res = await axios.post(
            this.endpoint,
            { query, variables },
            {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        return res.data.data;
    }

    /**
     * Get all products from Hygraph
     */
    async getProducts() {
        const query = `
      {
        products {
          id
          name
          price
          image { url }
        }
      }
    `;

        const data = await this.executeQuery<{ products: any[] }>(query);
        return data.products;
    }

    /**
     * Get a single product by ID
     */
    async getProductById(id: string) {
        const query = `
      query GetProduct($id: ID!) {
        product(where: { id: $id }) {
          id
          name
          price
          image { url }
        }
      }
    `;

        const data = await this.executeQuery<{ product: any }>(query, { id });
        return data.product;
    }
}
