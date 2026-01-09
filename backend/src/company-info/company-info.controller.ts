import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompanyInfoService } from './company-info.service';
import { CreateCompanyInfoDto } from './dto/create-company-info.dto';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Company Info')
@Controller('company-info')
export class CompanyInfoController {
  constructor(private readonly companyInfoService: CompanyInfoService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get published company info (public)' })
  findPublished() {
    return this.companyInfoService.findPublished();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create company info' })
  create(@Body() createCompanyInfoDto: CreateCompanyInfoDto) {
    return this.companyInfoService.create(createCompanyInfoDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all company info' })
  findAll() {
    return this.companyInfoService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get company info by id' })
  findOne(@Param('id') id: string) {
    return this.companyInfoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update company info' })
  update(@Param('id') id: string, @Body() updateCompanyInfoDto: UpdateCompanyInfoDto) {
    return this.companyInfoService.update(id, updateCompanyInfoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete company info' })
  remove(@Param('id') id: string) {
    return this.companyInfoService.remove(id);
  }
}
