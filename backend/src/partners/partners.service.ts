import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
// Status is now String in SQLite: "DRAFT" or "PUBLISHED"

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  create(createPartnerDto: CreatePartnerDto) {
    return this.prisma.partner.create({
      data: createPartnerDto,
    });
  }

  findAll(published?: boolean) {
    const where = published ? { status: 'PUBLISHED' } : {};
    return this.prisma.partner.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.partner.findUnique({
      where: { id },
    });
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Partner not found');
    }
    return this.prisma.partner.update({
      where: { id },
      data: updatePartnerDto,
    });
  }

  remove(id: string) {
    return this.prisma.partner.delete({
      where: { id },
    });
  }
}
