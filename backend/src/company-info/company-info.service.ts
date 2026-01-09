import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyInfoDto } from './dto/create-company-info.dto';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';
// Status is now String in SQLite: "DRAFT" or "PUBLISHED"

@Injectable()
export class CompanyInfoService {
  constructor(private prisma: PrismaService) {}

  create(createCompanyInfoDto: CreateCompanyInfoDto) {
    return this.prisma.companyInfo.create({
      data: createCompanyInfoDto,
    });
  }

  findAll() {
    return this.prisma.companyInfo.findMany();
  }

  findOne(id: string) {
    return this.prisma.companyInfo.findUnique({
      where: { id },
    });
  }

  findPublished() {
    return this.prisma.companyInfo.findFirst({
      where: { status: 'PUBLISHED' },
    });
  }

  async update(id: string, updateCompanyInfoDto: UpdateCompanyInfoDto) {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Company info not found');
    }
    return this.prisma.companyInfo.update({
      where: { id },
      data: updateCompanyInfoDto,
    });
  }

  remove(id: string) {
    return this.prisma.companyInfo.delete({
      where: { id },
    });
  }
}
