import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Only initialize transporter if SMTP config is provided
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    
    if (smtpHost && smtpUser && smtpPass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: this.configService.get<number>('SMTP_PORT') || 587,
          secure: false,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
      } catch (error) {
        console.warn('Failed to initialize email transporter:', error);
      }
    }
  }

  async create(createContactMessageDto: CreateContactMessageDto) {
    const message = await this.prisma.contactMessage.create({
      data: createContactMessageDto,
    });

    // Send email notification (only if transporter is configured)
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM'),
        to: this.configService.get<string>('SMTP_USER'),
        subject: `New Contact Message: ${createContactMessageDto.subject || 'No Subject'}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${createContactMessageDto.name}</p>
          <p><strong>Email:</strong> ${createContactMessageDto.email}</p>
          ${createContactMessageDto.phone ? `<p><strong>Phone:</strong> ${createContactMessageDto.phone}</p>` : ''}
          ${createContactMessageDto.subject ? `<p><strong>Subject:</strong> ${createContactMessageDto.subject}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${createContactMessageDto.message}</p>
        `,
        });
      } catch (error) {
        console.error('Failed to send email:', error);
        // Don't fail the request if email fails
      }
    }

    return message;
  }

  findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.contactMessage.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });
  }

  remove(id: string) {
    return this.prisma.contactMessage.delete({
      where: { id },
    });
  }
}
