import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RawMaterial, RawMaterialSchema } from './schema/raw-material.schema';
import { RawMaterialService } from './raw-materials.service';
import { RawMaterialController } from './raw-materials.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RawMaterial.name, schema: RawMaterialSchema },
    ]),
  ],
  providers: [RawMaterialService],
  controllers: [RawMaterialController],
  exports: [RawMaterialService],
})
export class RawMaterialModule { }
