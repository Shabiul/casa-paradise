'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getCRMStore, subscribeToCRM } from '@/lib/crmStore';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [whatsapp, setWhatsapp] = useState('919881247847');
  const [hotelName, setHotelName] = useState('Casa Paradiso');

  useEffect(() => {
    const updateSettings = () => {
      const store = getCRMStore();
      if (store.settings?.whatsapp) {
        setWhatsapp(store.settings.whatsapp);
      }
      if (store.settings?.hotelName) {
        setHotelName(store.settings.hotelName);
      }
    };
    updateSettings();
    const unsubscribe = subscribeToCRM(updateSettings);
    return () => unsubscribe();
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const cleanNum = whatsapp.replace(/\D/g, '');
  const encodedText = encodeURIComponent(`Hello, I have an enquiry regarding staying at ${hotelName}, Goa.`);

  return (
    <a 
      href={`https://wa.me/${cleanNum}?text=${encodedText}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-cta"
      aria-label="Chat on WhatsApp"
    >
      💬
    </a>
  );
}
