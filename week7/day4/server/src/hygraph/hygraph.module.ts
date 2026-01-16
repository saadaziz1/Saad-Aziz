import { Module } from '@nestjs/common';
import { HygraphService } from './hygraph.service';
import { HygraphController } from './hygraph.controller';

@Module({
  controllers: [HygraphController],
  providers: [HygraphService],
  exports: [HygraphService],
})
export class HygraphModule { }
