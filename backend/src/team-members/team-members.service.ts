import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Injectable()
export class TeamMembersService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  private async deleteStoredImageIfAny(image?: string | null) {
    if (!image || typeof image !== 'string') return;
    const trimmed = image.trim();
    if (!trimmed) return;
    // Only delete files we own on this API (/uploads/* or bare filename). Skip external URLs.
    const isOwned =
      trimmed.startsWith('/uploads/') ||
      trimmed.startsWith('uploads/') ||
      (!trimmed.includes('://') && !trimmed.startsWith('/images/'));
    if (!isOwned) return;
    try {
      await this.uploadService.deleteFile(trimmed);
    } catch {
      /* file may already be gone (e.g. Render redeploy) */
    }
  }

  create(createTeamMemberDto: CreateTeamMemberDto) {
    return this.prisma.teamMember.create({
      data: createTeamMemberDto,
    });
  }

  findAll(published?: boolean) {
    const where = published ? { status: 'PUBLISHED' } : {};
    return this.prisma.teamMember.findMany({
      where,
      orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  findOne(id: string) {
    return this.prisma.teamMember.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTeamMemberDto: UpdateTeamMemberDto) {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Team member not found');
    }
    const updated = await this.prisma.teamMember.update({
      where: { id },
      data: updateTeamMemberDto,
    });
    if (
      updateTeamMemberDto.image !== undefined &&
      existing.image &&
      updateTeamMemberDto.image !== existing.image
    ) {
      await this.deleteStoredImageIfAny(existing.image);
    }
    return updated;
  }

  async remove(id: string) {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Team member not found');
    }
    const removed = await this.prisma.teamMember.delete({
      where: { id },
    });
    await this.deleteStoredImageIfAny(existing.image);
    return removed;
  }
}
