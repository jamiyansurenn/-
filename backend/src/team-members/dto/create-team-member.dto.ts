import { IsString, IsOptional, IsIn, IsInt, Min, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

/** Admin forms often send ""; @IsOptional skips only undefined/null, so coerce empty to undefined. */
const EmptyToUndef = () =>
  Transform(({ value }: { value: unknown }) => (value === '' || value === null ? undefined : value));

export class CreateTeamMemberDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  position: string;

  @ApiProperty({ required: false })
  @EmptyToUndef()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @EmptyToUndef()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ required: false })
  @EmptyToUndef()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @EmptyToUndef()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @EmptyToUndef()
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;

  @ApiProperty({ enum: ['DRAFT', 'PUBLISHED'], required: false })
  @IsOptional()
  @IsIn(['DRAFT', 'PUBLISHED'])
  status?: string;
}
