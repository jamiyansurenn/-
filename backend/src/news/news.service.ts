import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
// Status is now String in SQLite: "DRAFT" or "PUBLISHED"

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  create(createNewsDto: CreateNewsDto) {
    return this.prisma.news.create({
      data: createNewsDto,
    });
  }

  findAll(published?: boolean, featured?: boolean, limit?: string | number) {
    const where: any = {};
    if (published) {
      where.status = 'PUBLISHED';
    }
    if (featured) {
      where.featured = true;
    }
    const take = this.parsePositiveIntLimit(limit);
    return this.prisma.news.findMany({
      where,
      ...(take !== undefined ? { take } : {}),
      orderBy: { publishedAt: 'desc' },
    });
  }

  /** Query params arrive as strings; invalid values must not become NaN for Prisma `take`. */
  private parsePositiveIntLimit(raw: string | number | undefined): number | undefined {
    if (raw === undefined || raw === null || raw === '') {
      return undefined;
    }
    const n = typeof raw === 'number' ? raw : parseInt(String(raw).trim(), 10);
    if (!Number.isFinite(n) || n < 1) {
      return undefined;
    }
    return Math.min(n, 500);
  }

  findOne(id: string) {
    return this.prisma.news.findUnique({
      where: { id },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.news.findFirst({
      where: { 
        slug,
        status: 'PUBLISHED' 
      },
    });
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    try {
      const existing = await this.findOne(id);
      if (!existing) {
        throw new NotFoundException('News not found');
      }
      
      // Clean up the update data - remove undefined/null values and handle dates
      const cleanData: any = {};
      Object.keys(updateNewsDto).forEach(key => {
        const value = (updateNewsDto as any)[key];
        if (value !== undefined && value !== null) {
          // Convert publishedAt string to Date if provided
          if (key === 'publishedAt' && typeof value === 'string') {
            cleanData[key] = new Date(value);
          } else {
            cleanData[key] = value;
          }
        }
      });
      
      return await this.prisma.news.update({
        where: { id },
        data: cleanData,
      });
    } catch (error: any) {
      console.error('Error updating news:', error);
      if (error.code === 'P2025') {
        throw new NotFoundException('News not found');
      }
      if (error.code === 'P2002') {
        throw new Error('A news item with this slug already exists');
      }
      throw error;
    }
  }

  remove(id: string) {
    return this.prisma.news.delete({
      where: { id },
    });
  }
}
