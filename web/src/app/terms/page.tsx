import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Clock, CreditCard, Car, Utensils, AlertTriangle, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Casa Paradiso Panaji, Goa',
  description: 'Read the terms and conditions, booking policies, check-in rules, vehicle rental guidelines, and cancellation terms for Casa Paradiso in Panaji, Goa.',
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__hero">
        <div className="container">
          <Link href="/" className="legal-page__back">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <span className="section-label">Legal & Policies</span>
          <h1 className="legal-page__title">Terms & Conditions</h1>
          <p className="legal-page__subtitle">
            Effective Date: January 1, 2026 • Last Updated: August 27, 2026
          </p>
        </div>
      </div>

      <div className="container legal-page__content">
        <div className="legal-page__card">
          <div className="legal-page__section">
            <h2>1. Welcome & General Introduction</h2>
            <p>
              Welcome to <strong>Casa Paradiso</strong>, an intimate boutique heritage hotel located at Ghanekar Building, Rua José Falcão, Altinho, Panaji, Goa 403001. By making a room reservation, dining reservation, vehicle rental inquiry, or utilizing any of our on-site facilities, you agree to comply with and be bound by the following Terms and Conditions.
            </p>
            <p>
              Please read these terms carefully before confirming your reservation. If you do not agree with any part of these terms, please contact our front desk at <a href="mailto:Paradisepanjim@gmail.com">Paradisepanjim@gmail.com</a> before booking.
            </p>
          </div>

          <div className="legal-page__section">
            <h2><Clock size={20} className="legal-page__icon" /> 2. Check-In & Check-Out Policy</h2>
            <ul>
              <li><strong>Check-in Time:</strong> 1:00 PM (13:00 hrs IST).</li>
              <li><strong>Check-out Time:</strong> 11:00 AM (11:00 hrs IST).</li>
              <li>
                <strong>Early Check-in / Late Check-out:</strong> Guaranteed early check-in or late check-out is subject to room availability and may incur nominal additional charges. Please notify front desk at least 24 hours in advance.
              </li>
              <li>
                <strong>Identification Requirement:</strong> In compliance with Government of India and Goa Police regulations, every adult guest must present a valid government-issued photo ID (Passport, Aadhaar Card, Driving License, or Voter ID) at check-in. Foreign nationals must present an original Passport with a valid Indian Visa or OCI card. <em>Note: PAN cards are not accepted as valid identity proof.</em>
              </li>
            </ul>
          </div>

          <div className="legal-page__section">
            <h2><CreditCard size={20} className="legal-page__icon" /> 3. Rates, Taxes & Payment Policy</h2>
            <ul>
              <li>
                <strong>Currency & Taxes:</strong> All room and rental rates are quoted in Indian National Rupees (INR / ₹) and are subject to applicable Goods and Services Tax (GST) as mandated by the Government of India.
              </li>
              <li>
                <strong>Direct Reservation Confirmation:</strong> Reservations made through our official website or direct WhatsApp concierge are confirmed upon receipt of the booking acknowledgment or initial deposit.
              </li>
              <li>
                <strong>Accepted Payment Methods:</strong> We accept major credit/debit cards (Visa, MasterCard, RuPay), UPI payments, Net Banking, and cash at front desk.
              </li>
            </ul>
          </div>

          <div className="legal-page__section">
            <h2><ShieldCheck size={20} className="legal-page__icon" /> 4. Cancellation & Refund Policy</h2>
            <ul>
              <li>
                <strong>Standard Cancellation:</strong> Cancellations received more than <strong>48 hours prior</strong> to the scheduled check-in time (1:00 PM on arrival date) are eligible for a full refund or date adjustment without penalty.
              </li>
              <li>
                <strong>Late Cancellation & No-Show:</strong> Cancellations made within 48 hours of arrival, or failure to arrive on the scheduled date (&quot;No-Show&quot;), will incur a cancellation fee equivalent to 100% of the first night&apos;s tariff.
              </li>
              <li>
                <strong>Peak Season / Long Weekends:</strong> During peak tourist periods (Christmas, New Year, Sunburn Festival, Carnival, and National Holidays), special non-refundable booking conditions may apply as indicated at the time of reservation.
              </li>
              <li>
                <strong>Refund Processing:</strong> Approved refunds will be processed via the original payment method within 5 to 7 business days.
              </li>
            </ul>
          </div>

          <div className="legal-page__section">
            <h2><Car size={20} className="legal-page__icon" /> 5. Vehicle Rentals (Scooters & Self-Drive Cars)</h2>
            <ul>
              <li>
                <strong>Eligibility:</strong> Renters must be at least 18 years old and hold an active, valid Original Driving License for the class of vehicle rented (Gearless 2-Wheeler or Light Motor Vehicle).
              </li>
              <li>
                <strong>Helmets & Safety:</strong> Helmets are provided with all 2-wheelers. Wearing a helmet is strictly mandatory under Goa state traffic laws for both rider and pillion.
              </li>
              <li>
                <strong>Traffic Laws & Fines:</strong> The guest/driver is solely responsible for all traffic fines, challans, toll charges, or legal penalties incurred during the rental period.
              </li>
              <li>
                <strong>Vehicle Condition & Fuel:</strong> Vehicles are handed over in clean running condition and must be returned with an equivalent fuel level. Any accidental damage will be evaluated and charged to the guest&apos;s folio.
              </li>
            </ul>
          </div>

          <div className="legal-page__section">
            <h2><Utensils size={20} className="legal-page__icon" /> 6. In-House Dining & Restaurant Reservations</h2>
            <ul>
              <li>
                <strong>Table Hold Time:</strong> Reserved dining tables will be held for a maximum of <strong>20 minutes</strong> past the booked reservation time before being released to waiting patrons.
              </li>
              <li>
                <strong>Dietary Preferences:</strong> Guests with severe food allergies or special dietary restrictions are requested to notify the service staff when placing dining orders.
              </li>
              <li>
                <strong>Outside Food:</strong> Outside commercial food and beverages are not permitted in the public dining area.
              </li>
            </ul>
          </div>

          <div className="legal-page__section">
            <h2><AlertTriangle size={20} className="legal-page__icon" /> 7. Guest Conduct, Peace & Property Care</h2>
            <ul>
              <li>
                <strong>Tranquility & Quiet Hours:</strong> Altinho is an esteemed residential and heritage hilltop zone. In consideration of all guests and residents, quiet hours are observed from <strong>10:30 PM to 7:00 AM</strong>.
              </li>
              <li>
                <strong>Non-Smoking Policy:</strong> All indoor guest rooms, suites, and closed dining areas are strictly non-smoking. Designated outdoor smoking zones are available.
              </li>
              <li>
                <strong>Property Damage:</strong> Guests will be held financially liable for any intentional damage, breakage, or loss caused to hotel property, antique furnishings, linens, or electronic appliances.
              </li>
            </ul>
          </div>

          <div className="legal-page__section">
            <h2><FileText size={20} className="legal-page__icon" /> 8. Governing Law & Jurisdiction</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or related to your stay or reservations at Casa Paradiso shall be subject to the exclusive jurisdiction of the competent courts in <strong>Panaji, Goa, India</strong>.
            </p>
          </div>

          <div className="legal-page__footer">
            <h3>Need Clarification?</h3>
            <p>
              For questions regarding reservations, special arrangements, or policy details, please connect with our team:
            </p>
            <p className="legal-page__contact-details">
              <strong>Email:</strong> <a href="mailto:Paradisepanjim@gmail.com">Paradisepanjim@gmail.com</a><br />
              <strong>Phone:</strong> <a href="tel:+919881247847">+91 98812 47847</a><br />
              <strong>Address:</strong> Ghanekar Building, Rua José Falcão, Altinho, Panaji, Goa 403001
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
