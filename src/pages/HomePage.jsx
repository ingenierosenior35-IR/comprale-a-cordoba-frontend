import { useRef, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import SellerSection from '../components/SellerSection/SellerSection';
import Stats from '../components/Stats/Stats';
import Footer from '../components/Footer/Footer';
import SellerDetail from '../components/SellerDetail/SellerDetail';
import { sellers, stats, sponsors } from '../data/mockData';
import './HomePage.css';

function HomePage() {
  const howItWorksSectionRef = useRef(null);
  const [selectedSeller, setSelectedSeller] = useState(null);

  return (
    <div className="home-page">
      <Navbar />
      <main>
        <Hero nextSectionRef={howItWorksSectionRef} />
        <HowItWorks sectionRef={howItWorksSectionRef} />
        <SellerSection sellers={sellers} onSellerClick={setSelectedSeller} />
        <Stats stats={stats} />
        <Footer sponsors={sponsors} />
      </main>
      {selectedSeller && (
        <SellerDetail
          seller={selectedSeller}
          onClose={() => setSelectedSeller(null)}
        />
      )}
    </div>
  );
}

export default HomePage;
