import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { BidsService } from './bids.service';
import { CreateBidDto, BidResponseDto } from './dto/create-bid.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ErrorResponseDto } from '../auth/dto/auth.dto';

@ApiTags('Bids')
@UseGuards(JwtAuthGuard)
@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Place a new bid' })
  @ApiResponse({
    status: 201,
    description: 'Bid placed successfully',
    type: BidResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid bid amount or auction ended',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 400,
        message: 'Bid amount must be greater than current price',
        error: 'Bad Request'
      }
    }
  })
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
