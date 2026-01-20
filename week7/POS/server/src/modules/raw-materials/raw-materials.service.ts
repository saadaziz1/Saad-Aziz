import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawMaterial, RawMaterialDocument } from './schema/raw-material.schema';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';

@Injectable()
export class RawMaterialService {
  constructor(
    @InjectModel(RawMaterial.name)
    private readonly rawMaterialModel: Model<RawMaterialDocument>,
  ) { }

  async create(dto: CreateRawMaterialDto) {
    const exists = await this.rawMaterialModel.findOne({ name: dto.name });
    if (exists) {
      throw new BadRequestException('Raw material already exists');
    }

    const materialData = {
      name: dto.name,
      unit: dto.unit,
      stockQty: dto.stockQty,
      minAlertQty: dto.minAlertQty || 0,
    };

    return this.rawMaterialModel.create(materialData);
  }

  async findAll() {
    return this.rawMaterialModel.find().sort({ name: 1 });
  }

  async findById(id: string) {
    const material = await this.rawMaterialModel.findById(id);
    if (!material) throw new NotFoundException('Raw material not found');
    return material;
  }

  async updateStock(id: string, adjustment: number) {
    const material = await this.findById(id);

    const newStock = material.stockQty + adjustment;
    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    material.stockQty = newStock;
    return material.save();
  }

  async lowStock() {
    return this.rawMaterialModel.find({
      $expr: { $lte: ['$stockQty', '$minAlertQty'] },
    });
  }

  async update(id: string, dto: UpdateRawMaterialDto) {
    const updateData: Partial<RawMaterial> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.unit !== undefined) updateData.unit = dto.unit;
    if (dto.stockQty !== undefined) updateData.stockQty = dto.stockQty;
    if (dto.minAlertQty !== undefined) updateData.minAlertQty = dto.minAlertQty;

    const updated = await this.rawMaterialModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Raw material not found');
    return updated;
  }

  async remove(id: string) {
    const result = await this.rawMaterialModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Raw material not found');
    return result;
  }
}
