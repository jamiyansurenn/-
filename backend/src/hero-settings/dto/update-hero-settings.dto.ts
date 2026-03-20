import { PartialType } from '@nestjs/swagger';
import { CreateHeroSettingsDto } from './create-hero-settings.dto';

export class UpdateHeroSettingsDto extends PartialType(CreateHeroSettingsDto) {}

