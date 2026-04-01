import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { CreatePageSectionDto } from './dto/create-page-section.dto';
import { UpdatePageSectionDto } from './dto/update-page-section.dto';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  createPage(dto: CreatePageDto) {
    return this.prisma.page.create({ data: dto });
  }

  findAllPages() {
    return this.prisma.page.findMany({ orderBy: { updatedAt: 'desc' } });
  }

  findPage(id: string) {
    return this.prisma.page.findUnique({ where: { id }, include: { sections: { orderBy: { order: 'asc' } } } });
  }

  async updatePage(id: string, dto: UpdatePageDto) {
    const existing = await this.prisma.page.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Page not found');
    return this.prisma.page.update({ where: { id }, data: dto });
  }

  removePage(id: string) {
    return this.prisma.page.delete({ where: { id } });
  }

  createSection(dto: CreatePageSectionDto) {
    return this.prisma.pageSection.create({ data: dto });
  }

  async updateSection(id: string, dto: UpdatePageSectionDto) {
    const existing = await this.prisma.pageSection.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Section not found');
    return this.prisma.pageSection.update({ where: { id }, data: dto });
  }

  removeSection(id: string) {
    return this.prisma.pageSection.delete({ where: { id } });
  }

  reorderSections(pageId: string, sectionIds: string[]) {
    return this.prisma.$transaction(
      sectionIds.map((sectionId, index) =>
        this.prisma.pageSection.update({
          where: { id: sectionId },
          data: { pageId, order: index },
        }),
      ),
    );
  }

  async toggleSectionVisibility(id: string, isVisible: boolean) {
    const existing = await this.prisma.pageSection.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Section not found');
    return this.prisma.pageSection.update({ where: { id }, data: { isVisible } });
  }

  async getPublicPage(slug: string, locale?: string) {
    const page = await this.prisma.page.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: {
        sections: {
          where: {
            isVisible: true,
            ...(locale ? { locale } : {}),
          },
          orderBy: { order: 'asc' },
        },
      },
    });
    return page;
  }
}
