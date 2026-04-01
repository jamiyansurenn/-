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

  const companyAboutUs = `ДААЦЫН ЦАМХАГ ГРУПП ХХК нь 2009 оноос барилга, дэд бүтэц, өргөх механизмын цогц үйлчилгээг мэргэжлийн түвшинд үзүүлж байна. Цамхагт болон гүүрэн кран, подъём, люлька, барилга угсралт — бүгдийг нэг дор, тогтвортой.

ДААЦЫН ЦАМХАГ ГРУПП ХХК нь анх 2009 онд үүсгэн байгуулагдсан бөгөөд барилга, дэд бүтцийн салбарын хөгжлийн гол хэрэглэгдэхүүн болох өргөн тээвэрлэх машин механизм, цамхагт кран, гүүрэн кран, ачаа болон хүн зөөврийн подъём, дүүжинт өлгүүр (люлька)-ийн угсралт, буулгалт, засвар үйлчилгээ, нийлүүлэлт, түрээсийн үйлчилгээ болон барилга угсралтын ажлыг мэргэжлийн өндөр түвшинд чадварлаг баг хамт олноор тогтвортой хэрэгжүүлж байна.`;

  const companyVision = `Бид Монголын бүтээн байгуулалтад бодитой хувь нэмэр оруулж, харилцагч таны итгэлийг ажил хэргээр баталгаажуулна.

Бид юу хийдэг вэ?

Барилга угсралт
• Улаанбаатар хот — Шинэ Амгалан цогцолбор хорооллын 4-р болон 6-р ээлжийн төслүүд
• Эрдэнэт — «Хос Цамхаг» апартмент: 128 айлын 2 блок орон сууц

Газо хөнгөн блок
• Улаанбаатар — Бэлх дахь үйлдвэр (утас: 9992-1096)
• Эрдэнэт — үйлдвэр (9955-0933)
• Завхан аймаг — үйлдвэр

Тавилгын үйлдвэр — утас: 7766-0933, 8058-0933, 8011-4447

Цамхагт краны нэгдсэн эксперт үйлчилгээ — 7766-0933

Авто болон суурин помпын үйлчилгээ — 7766-0933

Цахилгаан шат, урсдаг шат нийлүүлэлт — 7766-0933

ЭБА төв — 7766-0933
• Фитнесс, спиннинг төв
• Авто угаалга
• Автомат хувцас угаалга

Амралтын газар — Завхан аймаг, Тосонцэнгэл сумд байрладаг.`;

  const companyMission = `Манай компанийн зорилго нь барилгын салбарт чанар, аюулгүй байдал, орчин үеийн шийдлийг нэвтрүүлсэн бүтээн байгуулалтыг хэрэгжүүлж, иргэдийг тав тухтай, аюулгүй орон сууц, барилга байгууламжаар хангах явдал юм.

Бид Улаанбаатар хот болон орон нутагт орон сууц, үйлдвэрлэл, барилгын угсралт, барилгын материалын нийлүүлэлт, цамхагт краны үйлчилгээ зэрэг чиглэлээр тогтвортой үйл ажиллагаа явуулж, салбартаа найдвартай, хариуцлагатай компани байхыг зорин ажиллаж байна.

Богино хувилбар:
Чанартай бүтээн байгуулалтаар дамжуулан иргэдийн амьдрах орчныг сайжруулж, барилгын салбарт найдвартай, тогтвортой хөгжих нь бидний зорилго юм.`;

  const companyValues = `• Чанар
• Аюулгүй байдал
• Хариуцлага
• Итгэлцэл
• Харилцагчийн сэтгэл ханамж
• Шударга, ил тод үйл ажиллагаа
• Багийн ажиллагаа
• Тогтвортой хөгжил
• Шинэ санаа, инноваци
• Хамтдаа хөгжих зарчим

Манай компанийн үнэт зүйлс нь чанар, аюулгүй байдал, хариуцлага, харилцагчийн сэтгэл ханамж, багийн ажиллагаа, шударга ил тод үйл ажиллагаа, тогтвортой хөгжилд суурилсан зарчим юм. Бид хамтдаа хөгжиж, хамтдаа бүтээх зорилготойгоор үйл ажиллагаагаа явуулдаг.`;

  await prisma.companyInfo.upsert({
    where: { id: '1' },
    update: {
      aboutUs: companyAboutUs,
      vision: companyVision,
      mission: companyMission,
      values: companyValues,
    },
    create: {
      id: '1',
      aboutUs: companyAboutUs,
      vision: companyVision,
      mission: companyMission,
      values: companyValues,
      status: 'PUBLISHED',
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

  const leadershipTeam = [
    {
      id: '11111111-1111-4111-8111-111111110001',
      name: 'Б. Бат-Эрдэнэ',
      position: 'Ерөнхий захирал',
      bio: 'Төслийн гүйцэтгэл, аюулгүй байдал, чанарын стандартыг талбай дээр бодитой хэрэгжүүлэхэд манлайлдаг.',
      image: '/images/team/ceo-construction.png',
      order: 1,
      status: 'PUBLISHED' as const,
    },
    {
      id: '11111111-1111-4111-8111-111111110002',
      name: 'О. Номин-Эрдэнэ',
      position: 'Маркетингийн захирал',
      bio: 'Брэнд, харилцагчийн туршлагыг сайжруулах стратеги болон олон сувагт харилцааг хариуцдаг.',
      image: '/images/team/marketing-director.png',
      order: 2,
      status: 'PUBLISHED' as const,
    },
    {
      id: '11111111-1111-4111-8111-111111110003',
      name: 'Г. Энхбаатар',
      position: 'Захирал',
      bio: 'Компанийн урт хугацааны чиг хандлага, үнэт зүйлийг тодорхойлж, түншлэлээ бэхжүүлнэ.',
      image: '/images/team/director.png',
      order: 3,
      status: 'PUBLISHED' as const,
    },
  ];

  for (const m of leadershipTeam) {
    await prisma.teamMember.upsert({
      where: { id: m.id },
      update: {
        name: m.name,
        position: m.position,
        bio: m.bio,
        image: m.image,
        order: m.order,
        status: m.status,
      },
      create: m,
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
