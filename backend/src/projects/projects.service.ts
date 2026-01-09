import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
// Status is now String in SQLite: "DRAFT" or "PUBLISHED"

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(createProjectDto: CreateProjectDto) {
    const data: any = { ...createProjectDto };
    // Convert images array to JSON string for SQLite
    if (data.images && Array.isArray(data.images)) {
      data.images = JSON.stringify(data.images);
    }
    return this.prisma.project.create({
      data,
    });
  }

  async findAll(published?: boolean, featured?: boolean) {
    const where: any = {};
    if (published) {
      where.status = 'PUBLISHED';
    }
    if (featured) {
      where.featured = true;
    }
    const projects = await this.prisma.project.findMany({
      where,
      orderBy: { order: 'asc' },
    });
    // Parse images JSON string to array
    return projects.map(project => ({
      ...project,
      images: project.images ? JSON.parse(project.images) : [],
    }));
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) return null;
    return {
      ...project,
      images: project.images ? JSON.parse(project.images) : [],
    };
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug, status: 'PUBLISHED' },
    });
    if (!project) return null;
    return {
      ...project,
      images: project.images ? JSON.parse(project.images) : [],
    };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const existing = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Project not found');
    }
    const data: any = { ...updateProjectDto };
    // Convert images array to JSON string for SQLite
    if (data.images && Array.isArray(data.images)) {
      data.images = JSON.stringify(data.images);
    }
    const updated = await this.prisma.project.update({
      where: { id },
      data,
    });
    return {
      ...updated,
      images: updated.images ? JSON.parse(updated.images) : [],
    };
  }

  remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
