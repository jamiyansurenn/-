import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async check() {
    let dbOk = false;
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    } catch {
      dbOk = false;
    }

    const storageDriver = (this.configService.get<string>('STORAGE_DRIVER') || 'local').toLowerCase();
    const usingS3 = storageDriver === 's3';
    const s3Ready = usingS3
      ? Boolean(
          this.configService.get('S3_REGION') &&
            this.configService.get('S3_BUCKET') &&
            this.configService.get('S3_ACCESS_KEY_ID') &&
            this.configService.get('S3_SECRET_ACCESS_KEY'),
        )
      : true;

    const ok = dbOk && s3Ready;
    return {
      status: ok ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbOk ? 'ok' : 'error',
        storage: s3Ready ? 'ok' : 'error',
      },
      runtime: {
        nodeEnv: this.configService.get('NODE_ENV') || 'development',
        storageDriver,
      },
    };
  }
}
