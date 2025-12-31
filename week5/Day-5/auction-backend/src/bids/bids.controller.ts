import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Bids')
@UseGuards(JwtAuthGuard)
@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Place a new bid' })
  @ApiResponse({ status: 201, description: 'Bid placed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid bid amount or auction ended' })
  create(@Body() createBidDto: CreateBidDto) {
    return this.bidsService.create(createBidDto);
  }

  @ApiExcludeEndpoint()
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all bids' })
  @ApiResponse({ status: 200, description: 'Return list of all bids' })
  findAll() {
    return this.bidsService.findAll();
  }
}
