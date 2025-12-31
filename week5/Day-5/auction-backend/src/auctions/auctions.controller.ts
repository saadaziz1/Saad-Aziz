import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Auctions')
@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new auction' })
  @ApiResponse({ status: 201, description: 'Auction created successfully' })
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all auctions' })
  @ApiResponse({ status: 200, description: 'Return all auctions' })
  findAll() {
    return this.auctionsService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get auction by ID' })
  @ApiResponse({ status: 200, description: 'Return auction details' })
  @ApiResponse({ status: 404, description: 'Auction not found' })
  findOne(@Param('id') id: string) {
    return this.auctionsService.findOne(id);
  }
}
