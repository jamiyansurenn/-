import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompanyInfoModule } from './company-info/company-info.module';
import { ServicesModule } from './services/services.module';
import { ProjectsModule } from './projects/projects.module';
import { NewsModule } from './news/news.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { PartnersModule } from './partners/partners.module';
import { ContactModule } from './contact/contact.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompanyInfoModule,
    ServicesModule,
    ProjectsModule,
    NewsModule,
    TeamMembersModule,
    PartnersModule,
    ContactModule,
    UploadModule,
  ],
})
export class AppModule {}
