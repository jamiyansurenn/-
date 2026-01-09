import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyInfoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  aboutUs?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mission?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  values?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  history?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ enum: ['DRAFT', 'PUBLISHED'], required: false })
  @IsOptional()
  @IsIn(['DRAFT', 'PUBLISHED'])
  status?: string;
}
