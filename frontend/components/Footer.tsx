import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="footer-logo-bg" style={{ padding: '8px', background: 'rgba(255,255,255,0.95)', display: 'flex', justifyContent: 'center' }}>
              <Logo width={120} height={120} />
            </div>
          </div>
          <p style={{ color: '#94A3B8', lineHeight: '1.8', fontSize: '1.05rem' }}>Бидний тухай мэдээлэл</p>
          <p style={{ color: '#64748B', marginTop: '1.5rem', fontSize: '0.95rem', fontStyle: 'italic' }}>
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
          <div className="footer-contact">
            <p><span>📧</span> info@daatsiintsamkhag.mn</p>
            <p><span>📞</span> +976 7766-0933</p>
            <p style={{ alignItems: 'flex-start' }}>
              <span style={{ marginTop: '4px' }}>📍</span>
              <span style={{ lineHeight: '1.6' }}>Улаанбаатар хот, Баянзүрх дүүрэг, 38-р хороо, Шинэ Амгалан Б2, 307-р байр, 16 давхар 1601 тоот</span>
            </p>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} ДААЦЫН ЦАМХАГ Групп. Бүх эрх хуулиар хамгаалагдсан.</p>
      </div>
    </footer>
  );
}
