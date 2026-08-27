import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="legal-page">
      <div className="legal-page__hero" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--color-champagne-light)' }}>404</span>
          <h1 className="legal-page__title">Page Not Found</h1>
          <p className="legal-page__subtitle">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <div className="content-links" style={{ marginTop: 24 }}>
            <Link href="/">Return Home</Link>
            <Link href="/rooms">Rooms & Suites</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
