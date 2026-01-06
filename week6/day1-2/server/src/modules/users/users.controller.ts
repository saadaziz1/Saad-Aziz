import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { UpdateProfileDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  /** Get own profile */
  @Get('me')
  getMe(@Req() req) {
    return this.usersService.findById(req.user.userId);
  }

  /** Update own profile */
  @Patch('me')
  updateMe(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(
      req.user.userId,
      dto,
    );
  }
}
