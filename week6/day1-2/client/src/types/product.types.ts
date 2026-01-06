export enum ProductCategory {
  MENS_CLOTHING = 'mens-clothing',
  WOMENS_CLOTHING = 'womens-clothing',
  KIDS = 'kids',
  BAGS_AND_SHOES = 'bags-and-shoes',
}

export enum ProductSize {
  XXS = 'xx-small',
  XS = 'x-small',
  S = 'small',
  M = 'medium',
  L = 'large',
  XL = 'x-large',
  XXL = 'xx-large',
  XXXL = '3x-large',
  XXXXL = '4x-large',
}

export enum DressStyle {
  CASUAL = 'casual',
  PARTY = 'party',
  GYM = 'gym',
  FORMAL = 'formal',
}

export enum ProductColor {
  BLACK = 'Black',
  WHITE = 'White',
  RED = 'Red',
  BLUE = 'Blue',
  GREEN = 'Green',
  YELLOW = 'Yellow',
  GREY = 'Grey',
  PINK = 'Pink',
  PURPLE = 'Purple',
  ORANGE = 'Orange',
  BROWN = 'Brown',
}

export enum ProductType {
  TSHIRTS = 't-shirts',
  SHORTS = 'shorts',
  SHIRTS = 'shirts',
  HOODIE = 'hoodie',
  JEANS = 'jeans',
}

export enum PurchaseType {
  MONEY_ONLY = 'MONEY_ONLY',
  POINTS_ONLY = 'POINTS_ONLY',
  HYBRID = 'HYBRID',
}

export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  id: string | number;
  title: string;
  name?: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  pointsPrice?: number;
  discount: Discount;
  discountPercentage?: number;
  isOnSale?: boolean;
  rating: number;
  description?: string;
  sizes?: string[];
  colors?: string[];
  purchaseType: PurchaseType;
  category: ProductCategory;
  type?: ProductType;
  dressStyle?: string;
  brand?: string;
  sku?: string;
  tags?: string[];
  stock: number;
  totalStock?: number;
  sales?: number;
};
