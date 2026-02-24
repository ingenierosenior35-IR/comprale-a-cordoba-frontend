'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import ClientProviders from '../providers/ClientProviders';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import SellerSection from '../components/SellerSection/SellerSection';
import Stats from '../components/Stats/Stats';
import Footer from '../components/Footer/Footer';
import { stats, sponsors } from '../data/mockData';
import './home.css';

export default function HomePage() {
  const howItWorksSectionRef = useRef(null);
  const router = useRouter();

  const handleSellerClick = (seller) => {
    router.push(`/seller/${seller.id}`);
  };

  return (
    <ClientProviders>
      <div className="home-page">
        <Navbar />
        <main>
          <Hero nextSectionRef={howItWorksSectionRef} />
          <HowItWorks sectionRef={howItWorksSectionRef} />
          <SellerSection onSellerClick={handleSellerClick} />
          <Stats stats={stats} />
          <Footer sponsors={sponsors} />
        </main>
      </div>
    </ClientProviders>
  );
}
