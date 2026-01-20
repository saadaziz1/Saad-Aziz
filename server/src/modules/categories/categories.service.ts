import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const existing = await this.categoryModel.findOne({ name: createCategoryDto.name });
        if (existing) {
            throw new BadRequestException(`Category with name "${createCategoryDto.name}" already exists`);
        }

        const category = new this.categoryModel(createCategoryDto);
        return category.save();
    }

    async findAll(): Promise<Category[]> {
        return this.categoryModel.find().sort({ name: 1 }).exec();
    }

    async findActive(): Promise<Category[]> {
        return this.categoryModel.find({ isActive: true }).sort({ name: 1 }).exec();
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        if (updateCategoryDto.name) {
            const existing = await this.categoryModel.findOne({
                name: updateCategoryDto.name,
                _id: { $ne: id }
            });
            if (existing) {
                throw new BadRequestException(`Category with name "${updateCategoryDto.name}" already exists`);
            }
        }

        const updatedCategory = await this.categoryModel
            .findByIdAndUpdate(id, updateCategoryDto, { new: true })
            .exec();

        if (!updatedCategory) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return updatedCategory;
    }

    async remove(id: string): Promise<void> {
        const result = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
    }

    async categoryExists(name: string): Promise<boolean> {
        const category = await this.categoryModel.findOne({ name, isActive: true });
        return !!category;
    }
}
