import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { CreatePageSectionDto } from './dto/create-page-section.dto';
import { UpdatePageSectionDto } from './dto/update-page-section.dto';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get(':slug/public')
  @ApiOperation({ summary: 'Get public page by slug' })
  getPublicPage(@Param('slug') slug: string, @Query('lang') lang?: string) {
    return this.pagesService.getPublicPage(slug, lang);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createPage(@Body() dto: CreatePageDto) {
    return this.pagesService.createPage(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findPages() {
    return this.pagesService.findAllPages();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findPage(@Param('id') id: string) {
    return this.pagesService.findPage(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updatePage(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.pagesService.updatePage(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  removePage(@Param('id') id: string) {
    return this.pagesService.removePage(id);
  }

  @Post('sections')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createSection(@Body() dto: CreatePageSectionDto) {
    return this.pagesService.createSection(dto);
  }

  @Patch('sections/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateSection(@Param('id') id: string, @Body() dto: UpdatePageSectionDto) {
    return this.pagesService.updateSection(id, dto);
  }

  @Delete('sections/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  removeSection(@Param('id') id: string) {
    return this.pagesService.removeSection(id);
  }

  @Put(':pageId/sections/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  reorderSections(@Param('pageId') pageId: string, @Body() body: { sectionIds: string[] }) {
    return this.pagesService.reorderSections(pageId, body.sectionIds);
  }

  @Put('sections/:id/visibility')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  toggleVisibility(@Param('id') id: string, @Body() body: { isVisible: boolean }) {
    return this.pagesService.toggleSectionVisibility(id, body.isVisible);
  }
}
