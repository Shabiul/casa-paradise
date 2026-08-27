import Link from 'next/link';
import { SITE_URL } from '@/lib/seo';

export interface BreadcrumbItem {
  label: string;
  href?: string; // omit on the final (current) item
}

/**
 * Visible breadcrumb trail + matching BreadcrumbList JSON-LD.
 * The structured data always mirrors exactly what is rendered on screen.
 */
export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const trail: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href === '/' ? '' : item.href}` } : {}),
    })),
  };

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        {trail.map((item, idx) => (
          <li key={idx} className="breadcrumbs__item">
            {item.href && idx !== trail.length - 1 ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {idx !== trail.length - 1 && <span className="breadcrumbs__sep" aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
