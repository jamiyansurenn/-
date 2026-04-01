import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/** Deploy бүрт default admin/editor нууц үгийг мэдүүлсэн hash руу тааруулна (DB-д буруу үг үлдсэн 401-ийг засна). Production дээр өөрийн үг хадгалах бол Render дээр false болгоно. */
const resetDefaultUserPasswords = process.env.SEED_RESET_DEFAULT_PASSWORDS !== 'false';

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@moncon.mn' },
    update: resetDefaultUserPasswords
      ? {
          password: hashedPassword,
          name: 'Admin User',
          role: 'ADMIN',
        }
      : {
          name: 'Admin User',
          role: 'ADMIN',
        },
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
    update: resetDefaultUserPasswords
      ? {
          password: editorPassword,
          name: 'Editor User',
          role: 'EDITOR',
        }
      : {
          name: 'Editor User',
          role: 'EDITOR',
        },
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
      title: 'Хос Цамхаг Апартмент',
      description: 'Эрдэнэт хотод баригдаж буй 12 давхар бүхий орчин үеийн цогцолбор',
      content: 'Орчин үеийн хэв маягийг илтгэсэн Хос Цамхаг апартмент нь оршин суугчдын тав тухыг бүрэн хангасан, европ стандартын материал бүхий тансаг зэрэглэлийн хуучин болон шинэ хотын төвд байршилтай төсөл юм.',
      image: '/images/projects/hos_tsamhag.png',
      slug: 'hos-tsamhag',
      status: 'PUBLISHED',
      featured: true,
      order: 1,
    },
    {
      title: 'B7 Апартмент',
      description: 'Тав тух, стандарт нийцсэн тансаг зэрэглэлийн B7 төсөл',
      content: 'Дээд зэрэглэлийн материал, орчин үеийн архитектурын шилдэг шийдэл бүхий апартмент.',
      image: '/images/projects/b7.png',
      slug: 'b7-apartment',
      status: 'PUBLISHED',
      featured: true,
      order: 2,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        description: project.description,
        content: project.content,
        image: project.image,
      },
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
