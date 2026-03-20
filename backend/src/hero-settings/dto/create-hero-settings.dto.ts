import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { HeroSlideDto } from './hero-slide.dto';

export class CreateHeroSettingsDto {
  @ApiProperty({ required: false, type: [String], description: 'Array of background image urls (length 2)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  backgrounds?: string[];

  @ApiProperty({ required: false, type: [HeroSlideDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeroSlideDto)
  slides?: HeroSlideDto[];
}

