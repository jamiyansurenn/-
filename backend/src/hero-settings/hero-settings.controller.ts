import { Controller, Get, Body, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HeroSettingsService } from './hero-settings.service';
import { UpdateHeroSettingsDto } from './dto/update-hero-settings.dto';

@ApiTags('Hero Settings')
@Controller('hero-settings')
export class HeroSettingsController {
  constructor(private readonly heroSettingsService: HeroSettingsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get hero settings (public)' })
  findPublic() {
    return this.heroSettingsService.findPublic();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get hero settings (admin)' })
  findAdmin() {
    return this.heroSettingsService.findAdmin();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update hero settings (admin)' })
  upsert(@Body() updateDto: UpdateHeroSettingsDto) {
    return this.heroSettingsService.upsert(updateDto);
  }
}

