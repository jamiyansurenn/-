import { Injectable } from '@nestjs/common';
import { UpdateHeroSettingsDto } from './dto/update-hero-settings.dto';
import { readHeroSettings, writeHeroSettings, HeroSettingsResponse } from './hero-settings.store';

type HeroSlide = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

@Injectable()
export class HeroSettingsService {
  private getDefault(): HeroSettingsResponse {
    return {
      backgrounds: ['/hero/hero-1.jpg', '/hero/hero-2.jpg'],
      slides: [
        {
          title: 'Buy & Back – Ашигтай, Баталгаатай Хөрөнгө оруулалт',
          subtitle: 'Buy & Back гэрээт хөтөлбөр эхэллээ',
          ctaLabel: 'Холбоо барих',
          ctaHref: '/contact',
        },
        {
          title: 'ТАВ ТУХ ЧАНАР СТАНДАРТЫГ ТАНАЙ ГЭРТ',
          subtitle:
            'БИД ЗАСЛЫН ШИНЭЛЭГ ШИЙДЛИЙГ ТӨСЛҮҮДДЭЭ ШИНГЭЭЖ ОРЧИН ҮЕИЙН ТЕХНОЛОГИЙГ НЭВТРҮҮЛЭЭД БАЙНА',
          ctaLabel: 'Холбоо барих',
          ctaHref: '/contact',
        },
        {
          title: 'БҮХ ТӨРЛИЙН ТАВИЛГА УГСРАЛТ',
          subtitle:
            'БИД ТАНЫ ХҮССЭН ӨНГӨ ЗАГВАРЫН ДАГУУ МЭРГЭЖЛИЙН ДИЗАЙНЕРИЙН ГАРГАСАН ЗУРГИЙН ДАГУУ ТАНЫ ГЭР БОЛОН АЖИЛД ОРЧИН ҮЕИЙН ТАВИЛГЫГ САНАЛ БОЛГОН.' ,
          ctaLabel: 'Холбоо барих',
          ctaHref: '/contact',
        },
        {
          title: 'УТААГҮЙ УЛААНБААТАР ЗОРИЛТОТ ТӨСӨЛ',
          subtitle: 'даацтай бизнесийг бид танд санал болгоно',
          ctaLabel: 'Холбоо барих',
          ctaHref: '/contact',
        },
        {
          title: 'ЦАМХАГТ КРАНЫ НЭГДСЭН ҮЙЛЧИЛГЭЭ',
          subtitle: 'Бид цамхагт краны салбарт монголдоо тэргүүлэгч хамт олон билээ.',
          ctaLabel: 'Холбоо барих',
          ctaHref: '/contact',
        },
      ],
    };
  }

  findPublic(): Promise<HeroSettingsResponse> {
    const record = readHeroSettings();
    return Promise.resolve(record ?? this.getDefault());
  }

  findAdmin(): Promise<HeroSettingsResponse> {
    const record = readHeroSettings();
    return Promise.resolve(record ?? this.getDefault());
  }

  async upsert(updateDto: UpdateHeroSettingsDto): Promise<HeroSettingsResponse> {
    const defaults = this.getDefault();

    const backgrounds = Array.isArray(updateDto.backgrounds) && updateDto.backgrounds.length > 0 ? updateDto.backgrounds : defaults.backgrounds;
    const slides = Array.isArray(updateDto.slides) && updateDto.slides.length > 0 ? updateDto.slides : defaults.slides;

    const data: HeroSettingsResponse = {
      backgrounds,
      slides: slides as HeroSlide[],
    };

    writeHeroSettings(data);
    return data;
  }
}

