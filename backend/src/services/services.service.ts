import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
// Status is now String in SQLite: "DRAFT" or "PUBLISHED"

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  create(createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: createServiceDto,
    });
  }

  findAll(published?: boolean) {
    const where = published ? { status: 'PUBLISHED' } : {};
    return this.prisma.service.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.service.findUnique({
      where: { slug, status: 'PUBLISHED' },
    });
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Service not found');
    }
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  remove(id: string) {
    return this.prisma.service.delete({
      where: { id },
    });
  }
}
