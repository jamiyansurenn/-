import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@moncon.mn' },
    update: {},
    create: {
      email: 'admin@moncon.mn',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN', // String instead of enum
    },
  });

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 10);
  const editor = await prisma.user.upsert({
    where: { email: 'editor@moncon.mn' },
    update: {},
    create: {
      email: 'editor@moncon.mn',
      password: editorPassword,
      name: 'Editor User',
      role: 'EDITOR', // String instead of enum
    },
  });

  // Create company info
  await prisma.companyInfo.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      aboutUs: 'Бидний тухай мэдээлэл...',
      vision: 'Манай алсын хараа...',
      mission: 'Манай зорилго...',
      values: 'Манай үнэт зүйлс...',
      status: 'PUBLISHED', // String instead of enum
    },
  });

  // Create sample services
  const services = [
    {
      title: 'Үйлчилгээ 1',
      description: 'Үйлчилгээний тайлбар',
      slug: 'service-1',
      status: 'PUBLISHED',
      order: 1,
    },
    {
      title: 'Үйлчилгээ 2',
      description: 'Үйлчилгээний тайлбар',
      slug: 'service-2',
      status: 'PUBLISHED',
      order: 2,
    },
  ];
  
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }

  // Create sample projects
  const projects = [
    {
      title: 'Төсөл 1',
      description: 'Төслийн тайлбар',
      slug: 'project-1',
      status: 'PUBLISHED',
      featured: true,
      order: 1,
    },
  ];
  
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }

  // Create sample news
  const newsItems = [
    {
      title: 'Мэдээ 1',
      excerpt: 'Мэдээний товч тайлбар',
      content: 'Мэдээний бүрэн агуулга...',
      slug: 'news-1',
      status: 'PUBLISHED',
      featured: true,
      publishedAt: new Date(),
    },
  ];
  
  for (const news of newsItems) {
    await prisma.news.upsert({
      where: { slug: news.slug },
      update: {},
      create: news,
    });
  }

  console.log('Seed data created successfully');
  console.log('Admin: admin@moncon.mn / admin123');
  console.log('Editor: editor@moncon.mn / editor123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
