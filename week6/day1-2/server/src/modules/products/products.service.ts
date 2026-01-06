import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { ProductCategory, ProductSize, DressStyle } from '../../common/enums/product-attributes.enum';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ProductService {

  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private cloudinaryService: CloudinaryService,
    private notificationsGateway: NotificationsGateway,
  ) { }

  /**
   * Update sale status for a product (Toggle-able)
   */
  async updateSaleStatus(
    productId: string,
    isOnSale: boolean,
    discountPercentage: number = 0,
  ): Promise<ProductDocument> {
    const product = await this.findById(productId);

    if (isOnSale && (discountPercentage < 0 || discountPercentage > 100)) {
      throw new BadRequestException('Discount percentage must be between 0 and 100');
    }
    product.isOnSale = isOnSale;
    product.discountPercentage = isOnSale ? discountPercentage : 0;
    const updatedProduct = await product.save();

    if (isOnSale) {
      // Notify all users in real-time
      this.notificationsGateway.notifyAll('sale_started', {
        message: `Big Sale! ${product.name} is now ${discountPercentage}% off!`,
        productId: product._id,
        discountPercentage,
      });
    }

    return updatedProduct;
  }

  /**
   * Create a new product with image uploads
   */
  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<ProductDocument> {
    const imageUrls: string[] = [];

    // Upload up to 4 images to Cloudinary
    if (files && files.length > 0) {
      const uploadPromises = files.slice(0, 4).map(file =>
        this.cloudinaryService.uploadImage(file)
      );
      const uploadResults = await Promise.all(uploadPromises);
      uploadResults.forEach(res => imageUrls.push(res.secure_url));
    }

    // Auto-generate SKU if not provided
    const sku = createProductDto.sku || `AS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newProduct = new this.productModel({
      ...createProductDto,
      sku,
      images: imageUrls,
    });

    try {
      return await newProduct.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(`Product with SKU "${sku}" already exists`);
      }
      throw error;
    }
  }

  /**
   * Find all products with advanced filtering
   */
  async findAll(query: any): Promise<ProductDocument[]> {

    const {
      category,
      type,
      size,
      color,
      dressStyle,
      minPrice,
      maxPrice,
      isOnSale,
      isPointsOnly,
      search,
      page = 1,
      limit = 10,
      sort,
    } = query;

    const filter: any = {};

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (size) filter.sizes = size;
    if (color) filter.colors = color;
    if (dressStyle) filter.dressStyle = dressStyle;

    if (isOnSale !== undefined) {
      filter.isOnSale = isOnSale === 'true' || isOnSale === true;
    }

    if (isPointsOnly !== undefined) {
      filter.isPointsOnly = isPointsOnly === 'true' || isPointsOnly === true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const total = await this.productModel.countDocuments(filter);
    const skip = (Number(page) - 1) * Number(limit);

    let queryBuilder = this.productModel.find(filter);

    if (sort && sort.includes(':')) {
      const [field, order] = sort.split(':');
      queryBuilder = queryBuilder.sort({ [field]: order === 'desc' ? -1 : 1 });
    } else if (sort) {
      queryBuilder = queryBuilder.sort({ [sort]: -1 });
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    }

    const products = await queryBuilder.skip(skip).limit(Number(limit)).exec();

    return {
      products,
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    } as any;
  }

  /**
   * Find product by ID
   */
  async findById(productId: string): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid Product ID');
    }
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  /**
   * Update product details and optionally images
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files?: Express.Multer.File[],
  ): Promise<ProductDocument> {
    const product = await this.findById(id);
    const wasOnSale = product.isOnSale;

    // If new images provided, upload them
    if (files && files.length > 0) {
      const uploadPromises = files.map(file => this.cloudinaryService.uploadImage(file));
      const uploadResults = await Promise.all(uploadPromises);
      const newUrls = uploadResults.map(res => res.secure_url);
      product.images = [...product.images, ...newUrls].slice(-4);
    }

    Object.assign(product, updateProductDto);

    try {
      const updatedProduct = await product.save();

      // Trigger notification if sale started via update form
      if (!wasOnSale && updatedProduct.isOnSale) {
        this.notificationsGateway.notifyAll('sale_started', {
          message: `Big Sale! ${updatedProduct.name} is now ${updatedProduct.discountPercentage}% off!`,
          productId: updatedProduct._id,
          discountPercentage: updatedProduct.discountPercentage,
        });
      }

      return updatedProduct;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(`Product with SKU "${updateProductDto.sku}" already exists`);
      }
      throw error;
    }
  }

  /**
   * Delete product
   */
  async delete(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Product not found');
    }
  }
}
