import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class HeroSlideDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ required: false, description: 'Optional paragraph under the title' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    description: 'Short supporting line under the headline (replaces i18n default when set)',
  })
  @IsOptional()
  @IsString()
  supportLine?: string;

  @ApiProperty({ required: false, description: 'Background image URL for this slide (upload path or absolute URL)' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ required: false, description: 'Optional transparent/decorative overlay image (PNG) on top of the hero' })
  @IsOptional()
  @IsString()
  overlayImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ctaLabel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ctaHref?: string;
}

