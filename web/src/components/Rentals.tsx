'use client';

import { useState, useEffect } from 'react';
import VehicleBookingModal from './VehicleBookingModal';
import { getCRMStore, subscribeToCRM } from '@/lib/crmStore';

interface Vehicle {
  id: string;
  name: string;
  category: '2-wheeler' | '4-wheeler';
  categoryLabel: string;
  price: number;
  image: string;
  badge?: string;
  desc: string;
  features: string[];
}

const baseVehicles: Vehicle[] = [
  {
    id: 'activa',
    name: 'Honda Activa',
    category: '2-wheeler',
    categoryLabel: '2-Wheeler Scooter',
    price: 400,
    badge: 'Popular',
    image: '/activa.png',
    desc: 'The gold standard Goan ride. Perfect for quick beach runs and exploring Panaji heritage lanes.',
    features: ['2 Helmets Included', 'Hotel Doorstep Pick-up & Drop', 'Unlimited Kilometers', 'Automatic Transmission']
  },
  {
    id: 'dio',
    name: 'Honda Dio',
    category: '2-wheeler',
    categoryLabel: '2-Wheeler Scooter',
    price: 400,
    image: '/WhatsApp_Image_2026-08-11_at_6.56.54_PM__2_-removebg-preview.png',
    desc: 'Sporty and agile 110cc scooter designed for swift rides across North & South Goa.',
    features: ['2 Helmets Included', 'Hotel Doorstep Pick-up & Drop', 'Unlimited Kilometers', 'Sporty & Lightweight']
  },
  {
    id: 'fascino',
    name: 'Yamaha Fascino',
    category: '2-wheeler',
    categoryLabel: '2-Wheeler Scooter',
    price: 400,
    image: '/fasc.png',
    desc: 'Elegant retro-styled scooter with refined engine performance and excellent fuel efficiency.',
    features: ['2 Helmets Included', 'Hotel Doorstep Pick-up & Drop', 'Unlimited Kilometers', 'Smooth Retro Styling']
  },
  {
    id: 'swift',
    name: 'Maruti Suzuki Swift',
    category: '4-wheeler',
    categoryLabel: 'Self-Drive Car',
    price: 1500,
    badge: 'Most Popular Car',
    image: '/WhatsApp Image 2026-08-11 at 6.56.54 PM.jpeg',
    desc: 'Comfortable air-conditioned hatchback ideal for family outings, beach hopping, and highway drives.',
    features: ['5-Seater Hatchback', 'Chilling Air Conditioning', 'Power Steering & ABS', 'Hotel & Airport Delivery']
  },
  {
    id: 'ertiga',
    name: 'Maruti Suzuki Ertiga',
    category: '4-wheeler',
    categoryLabel: 'Self-Drive Car',
    price: 2500,
    badge: 'Family & Group Special',
    image: '/WhatsApp Image 2026-08-11 at 6.56.53 PM (1).jpeg',
    desc: 'Spacious 7-seater MPV built for large families or groups traveling together with heavy luggage.',
    features: ['7-Seater Premium MPV', 'Dual Rear AC Vents', 'Ample Luggage Capacity', 'Hotel & Airport Delivery']
  }
];

export default function Rentals() {
  const [filter, setFilter] = useState<'all' | '2-wheeler' | '4-wheeler'>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehiclePrices, setVehiclePrices] = useState<Record<string, number>>({
    activa: 400,
    dio: 400,
    fascino: 400,
    swift: 1500,
    ertiga: 2500
  });

  useEffect(() => {
    const updatePrices = () => {
      const store = getCRMStore();
      if (store.settings?.vehiclePrices) {
        setVehiclePrices(store.settings.vehiclePrices as unknown as Record<string, number>);
      }
    };
    updatePrices();
    const unsubscribe = subscribeToCRM(updatePrices);
    return () => unsubscribe();
  }, []);

  const vehicles = baseVehicles.map(v => ({
    ...v,
    price: vehiclePrices[v.id] || v.price
  }));

  const twoWheelers = vehicles.filter(v => v.category === '2-wheeler');
  const fourWheelers = vehicles.filter(v => v.category === '4-wheeler');

  const handleOpenBooking = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const renderVehicleCard = (v: Vehicle) => (
    <div key={v.id} className={`rental-card ${v.badge ? 'rental-card--featured' : ''}`}>
      {v.badge && <span className="rental-card__badge">{v.badge}</span>}

      <div className="rental-card__image-wrapper">
        <img 
          src={v.image} 
          alt={`${v.name} Rental in Goa`} 
          className="rental-card__img"
          loading="lazy"
        />
      </div>

      <div className="rental-card__models">{v.categoryLabel}</div>
      <div className="rental-card__title">{v.name}</div>

      <div className="rental-card__price-row">
        <span className="rental-card__price">₹{v.price.toLocaleString('en-IN')}</span>
        <span className="rental-card__unit">/ day</span>
      </div>

      <ul className="rental-card__features">
        {v.features.map((feat, idx) => (
          <li key={idx}>{feat}</li>
        ))}
      </ul>

      <button 
        onClick={() => handleOpenBooking(v)}
        className="rental-card__cta"
        style={{ border: 'none', cursor: 'pointer', width: 'calc(100% - 32px)' }}
      >
        Reserve {v.name}
      </button>
    </div>
  );

  return (
    <section id="rentals" className="rentals">
      <div className="container">
        <span className="section-label">Seamless Mobility</span>
        <h2 className="section-title">Scooter & Self-Drive Car Rentals</h2>
        <p className="section-subtitle">
          Explore Goa at your own pace with doorstep hotel pick-up & drop-off. Fully maintained vehicles with helmets and 24/7 road assistance.
        </p>

        {/* Filter Tabs */}
        <div className="rentals__filters">
          <button 
            className={`rentals__filter-btn ${filter === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Vehicles ({vehicles.length})
          </button>
          <button 
            className={`rentals__filter-btn ${filter === '2-wheeler' ? 'is-active' : ''}`}
            onClick={() => setFilter('2-wheeler')}
          >
            2-Wheelers (₹{vehiclePrices.activa || 400}/day)
          </button>
          <button 
            className={`rentals__filter-btn ${filter === '4-wheeler' ? 'is-active' : ''}`}
            onClick={() => setFilter('4-wheeler')}
          >
            Self-Drive Cars
          </button>
        </div>

        {/* 2-Wheelers Line */}
        {(filter === 'all' || filter === '2-wheeler') && (
          <div className="rentals__section-group">
            <div className="rentals__grid rentals__grid--2wheelers">
              {twoWheelers.map(renderVehicleCard)}
            </div>
          </div>
        )}

        {/* 4-Wheelers Line */}
        {(filter === 'all' || filter === '4-wheeler') && (
          <div className="rentals__section-group">
            <div className="rentals__grid rentals__grid--4wheelers">
              {fourWheelers.map(renderVehicleCard)}
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Booking Modal */}
      <VehicleBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={selectedVehicle}
      />
    </section>
  );
}
