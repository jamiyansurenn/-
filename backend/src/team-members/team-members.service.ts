import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
// Status is now String in SQLite: "DRAFT" or "PUBLISHED"

@Injectable()
export class TeamMembersService {
  constructor(private prisma: PrismaService) {}

  create(createTeamMemberDto: CreateTeamMemberDto) {
    return this.prisma.teamMember.create({
      data: createTeamMemberDto,
    });
  }

  findAll(published?: boolean) {
    const where = published ? { status: 'PUBLISHED' } : {};
    return this.prisma.teamMember.findMany({
      where,
      orderBy: { order: 'asc' },
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
    return this.prisma.teamMember.update({
      where: { id },
      data: updateTeamMemberDto,
    });
  }

  remove(id: string) {
    return this.prisma.teamMember.delete({
      where: { id },
    });
  }
}
