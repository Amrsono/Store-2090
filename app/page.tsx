import Navbar from '@/components/Navbar';
import Hero3D from '@/components/Hero3D';
import FeaturesSection from '@/components/FeaturesSection';
import ProductsSection from '@/components/ProductsSection';
import DashboardSection from '@/components/DashboardSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[var(--obsidian)]">
      <Navbar />
      <Hero3D />
      <FeaturesSection />
      <ProductsSection />
      <DashboardSection />
      <Footer />
    </main>
  );
}
