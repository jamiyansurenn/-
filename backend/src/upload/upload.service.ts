import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private uploadPath: string;

  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get<string>('UPLOAD_DEST') || './uploads';
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      throw new Error('Invalid file provided');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${uniqueSuffix}-${sanitizedFilename}`;
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

    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '');
    const filepath = path.join(this.uploadPath, sanitizedFilename.replace('/uploads/', ''));

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
