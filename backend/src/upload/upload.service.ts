import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private uploadPath: string;
  private storageDriver: 'local' | 's3';
  private s3Client: S3Client | null = null;
  private s3Bucket: string | null = null;
  private s3Region: string | null = null;
  private s3PublicBaseUrl: string | null = null;

  constructor(private configService: ConfigService) {
    const configuredDriver = (this.configService.get<string>('STORAGE_DRIVER') || 'local').toLowerCase();
    this.storageDriver = configuredDriver === 's3' ? 's3' : 'local';
    this.uploadPath =
      this.configService.get<string>('UPLOAD_DEST') ||
      // Keep uploads under backend root regardless of current working directory.
      path.resolve(__dirname, '..', '..', '..', 'uploads');
    if (this.storageDriver === 's3') {
      this.initS3Client();
    } else {
      this.ensureUploadDirectoryExists();
    }
  }

  private ensureUploadDirectoryExists() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  private initS3Client() {
    const region = this.configService.get<string>('S3_REGION');
    const bucket = this.configService.get<string>('S3_BUCKET');
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('S3_SECRET_ACCESS_KEY');

    if (!region || !bucket || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing required S3 configuration: S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY');
    }

    this.s3Bucket = bucket;
    this.s3Region = region;
    this.s3PublicBaseUrl = this.configService.get<string>('S3_PUBLIC_BASE_URL') || null;
    this.s3Client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      throw new Error('Invalid file provided');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${uniqueSuffix}-${sanitizedFilename}`;

    if (this.storageDriver === 's3') {
      if (!this.s3Client || !this.s3Bucket) {
        throw new Error('S3 client is not initialized');
      }
      try {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.s3Bucket,
            Key: filename,
            Body: file.buffer,
            ContentType: file.mimetype || 'application/octet-stream',
          }),
        );
        if (this.s3PublicBaseUrl) {
          return `${this.s3PublicBaseUrl.replace(/\/$/, '')}/${filename}`;
        }
        return `https://${this.s3Bucket}.s3.${this.s3Region}.amazonaws.com/${filename}`;
      } catch (error: any) {
        throw new Error(`Failed to upload file to S3: ${error?.message || 'Unknown error'}`);
      }
    }

    const filepath = path.join(this.uploadPath, filename);

    try {
      fs.writeFileSync(filepath, file.buffer);
      return `/uploads/${filename}`;
    } catch (error) {
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }

  async deleteFile(filename: string): Promise<void> {
    if (!filename) {
      throw new Error('Filename is required');
    }

    const resolvedName = filename
      .replace('/uploads/', '')
      .split('/')
      .pop()
      ?.replace(/[^a-zA-Z0-9._-]/g, '');

    if (!resolvedName) {
      throw new Error('Invalid filename');
    }

    if (this.storageDriver === 's3') {
      if (!this.s3Client || !this.s3Bucket) {
        throw new Error('S3 client is not initialized');
      }
      try {
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.s3Bucket,
            Key: resolvedName,
          }),
        );
        return;
      } catch (error: any) {
        throw new Error(`Failed to delete file from S3: ${error?.message || 'Unknown error'}`);
      }
    }

    const filepath = path.join(this.uploadPath, resolvedName);

    if (!fs.existsSync(filepath)) {
      throw new Error('File not found');
    }

    try {
      fs.unlinkSync(filepath);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}
