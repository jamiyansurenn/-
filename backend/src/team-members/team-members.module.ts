import { Module } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { TeamMembersController } from './team-members.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [TeamMembersController],
  providers: [TeamMembersService],
})
export class TeamMembersModule {}
