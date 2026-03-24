import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

@Injectable()
export class CareersService {
  constructor(private prisma: PrismaService) {}

  create(createCareerDto: CreateCareerDto) {
    return this.prisma.career.create({
      data: createCareerDto,
    });
  }

  findAll(published?: boolean) {
    const where = published ? { status: 'PUBLISHED' } : {};
    return this.prisma.career.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  findOne(id: string) {
    return this.prisma.career.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateCareerDto: UpdateCareerDto) {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Career not found');
    }

    return this.prisma.career.update({
      where: { id },
      data: updateCareerDto,
    });
  }

  remove(id: string) {
    return this.prisma.career.delete({
      where: { id },
    });
  }
}
