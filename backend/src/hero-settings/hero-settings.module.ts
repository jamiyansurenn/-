import { Module } from '@nestjs/common';
import { HeroSettingsController } from './hero-settings.controller';
import { HeroSettingsService } from './hero-settings.service';

@Module({
  controllers: [HeroSettingsController],
  providers: [HeroSettingsService],
})
export class HeroSettingsModule {}

