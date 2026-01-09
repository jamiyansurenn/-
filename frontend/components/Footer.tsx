import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Logo width={50} height={50} />
            <h3>ДААЦЫН ЦАМХАГ Групп</h3>
          </div>
          <p style={{ color: '#ccc', lineHeight: '1.8' }}>Бидний тухай мэдээлэл</p>
          <p style={{ color: '#ccc', marginTop: '1rem', fontSize: '0.9rem' }}>
            Даацтай бизнес ба даацтай амьдрал
          </p>
        </div>
        <div>
          <h3>Холбоосууд</h3>
          <ul style={{ listStyle: 'none' }}>
            <li>
              <Link href="/about">Бидний тухай</Link>
            </li>
            <li>
              <Link href="/history">Түүхэн замнал</Link>
            </li>
            <li>
              <Link href="/services">Үйлчилгээ</Link>
            </li>
            <li>
              <Link href="/projects">Төслүүд</Link>
            </li>
            <li>
              <Link href="/news">Мэдээ</Link>
            </li>
            <li>
              <Link href="/careers">Ажлын байр</Link>
            </li>
            <li>
              <Link href="/contact">Холбоо барих</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>Холбоо барих</h3>
          <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>📧 info@daatsiintsamkhag.mn</p>
          <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>📞 +976 7766-0933</p>
          <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.6' }}>
            📍 Улаанбаатар хот, Баянзүрх дүүрэг, 38-р хороо, Шинэ Амгалан Б2, 307-р байр, 16 давхар 1601 тоот
          </p>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #333' }}>
        <p style={{ color: '#999' }}>&copy; {new Date().getFullYear()} ДААЦЫН ЦАМХАГ Групп. Бүх эрх хуулиар хамгаалагдсан.</p>
      </div>
    </footer>
  );
}
