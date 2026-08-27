import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Lock, Database, Eye, Bell, UserCheck, ShieldCheck, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Casa Paradiso protects guest data, reservation details, identification documents, and website privacy in accordance with hospitality privacy standards.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__hero">
        <div className="container">
          <Link href="/" className="legal-page__back">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <span className="section-label">Privacy & Trust</span>
          <h1 className="legal-page__title">Privacy Policy</h1>
          <p className="legal-page__subtitle">
            Effective Date: January 1, 2026 • Last Updated: August 27, 2026
          </p>
        </div>
      </div>

      <div className="container legal-page__content">
        <div className="legal-page__card">
          <div className="legal-page__section">
            <h2>1. Commitment to Guest Privacy</h2>
            <p>
              At <strong>Casa Paradiso</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;the Hotel&quot;), we are committed to safeguarding the privacy and personal data of our esteemed guests and website visitors. This Privacy Policy details how we collect, use, store, and protect your information when you interact with our website (<a href="https://www.panjimhotelcasaparadiso.in">panjimhotelcasaparadiso.in</a>), make a room or dining reservation, book a vehicle rental, or communicate with our concierge team.
            </p>
            <p>
              We operate in full compliance with applicable Indian privacy laws, including the Information Technology Act, 2000 and the Digital Personal Data Protection (DPDP) framework.
            </p>
          </div>

          <div className="legal-page__section">
            <h2><Database size={20} className="legal-page__icon" /> 2. Information We Collect</h2>
            <p>We may collect the following categories of information:</p>
            <ul>
              <li>
                <strong>Contact & Booking Information:</strong> Full name, phone/WhatsApp number, email address, residential address, requested room category, occupancy details, and special preferences.
              </li>
              <li>
                <strong>Statutory Check-In Documentation:</strong> Government-issued identification details (Passport number, Visa details for foreign travelers, Aadhaar number, or Driver&apos;s license) collected at the front desk in compliance with statutory police regulations.
              </li>
              <li>
                <strong>Transaction & Billing Data:</strong> Payment transaction references, folio items, GSTIN (for corporate bookings), and meal/service charges. <em>(Note: We do not store sensitive credit card CVV or net banking passwords).</em>
              </li>
              <li>
                <strong>Service Preferences:</strong> Scooter/car rental preferences, in-house dining reservations, and dietary restrictions communicated to our staff.
              </li>
            </ul>
          </div>

          <div className="legal-page__section">
            <h2><Eye size={20} className="legal-page__icon" /> 3. How We Use Your Information</h2>
            <p>Your information is used strictly for legitimate hospitality operations:</p>
            <ul>
              <li>
                <strong>Reservation Processing:</strong> Generating instant booking confirmations, room allocation, and managing guest folios.
              </li>
              <li>
                <strong>Concierge & Guest Support:</strong> Communicating arrival coordinates, handling vehicle delivery to the hotel doorstep, and providing dining assistance via phone or WhatsApp.
              </li>
              <li>
                <strong>Legal & Statutory Compliance:</strong> Fulfilling mandatory reporting obligations under the Registration of Foreigners Rules, Form-C filing, and Goa Police guest registers.
              </li>
              <li>
                <strong>Quality Improvement:</strong> Enhancing our culinary offerings, housekeeping standards, and digital platform responsiveness.
              </li>
            </ul>
          </div>

          <div className="legal-page__section">
            <h2><Lock size={20} className="legal-page__icon" /> 4. Data Protection & Security</h2>
            <p>
              We employ strict technical and organizational safeguards to prevent unauthorized access, disclosure, alteration, or destruction of guest data. All web interactions are secured via Transport Layer Security (TLS 1.3 / SSL encryption). Digital records and administrative systems are access-controlled and restricted solely to authorized hotel management staff.
            </p>
          </div>

          <div className="legal-page__section">
            <h2><ShieldCheck size={20} className="legal-page__icon" /> 5. Zero Third-Party Selling</h2>
            <p>
              <strong>We do not sell, rent, trade, or monetize your personal data.</strong> Your information is never provided to third-party telemarketers or external advertising networks. Information is shared only with verified service providers (e.g., secure payment gateways, SMS/WhatsApp delivery channels) strictly to fulfill your requested hospitality services.
            </p>
          </div>

          <div className="legal-page__section">
            <h2><Bell size={20} className="legal-page__icon" /> 6. Cookies & Web Analytics</h2>
            <p>
              Our website uses minimal, non-intrusive cookies to remember your browsing preferences and ensure optimal page loading speed. You may choose to disable cookies in your web browser settings at any time without losing access to primary booking features.
            </p>
          </div>

          <div className="legal-page__section">
            <h2><UserCheck size={20} className="legal-page__icon" /> 7. Your Data Rights</h2>
            <p>
              As a valued guest, you have the right to request access to the personal data we hold about you, request corrections to inaccurate information, or request deletion of non-statutory records following your stay. To exercise these rights, please email our privacy desk.
            </p>
          </div>

          <div className="legal-page__footer">
            <h3><Mail size={20} className="legal-page__icon" /> Privacy Inquiries & Contact</h3>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or how your personal information is handled, please contact:
            </p>
            <p className="legal-page__contact-details">
              <strong>Casa Paradiso Hospitality Desk</strong><br />
              <strong>Email:</strong> <a href="mailto:Paradisepanjim@gmail.com">Paradisepanjim@gmail.com</a><br />
              <strong>Phone:</strong> <a href="tel:+919881247847">+91 98812 47847</a><br />
              <strong>Address:</strong> Ghanekar Building, Rua José Falcão, Altinho, Panaji, Goa 403001, India
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
