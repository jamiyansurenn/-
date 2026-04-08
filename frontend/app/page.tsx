import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import HomeBelowFold from '@/components/home/HomeBelowFold';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HomeBelowFold />
      </main>
      <Footer />
    </>
  );
}
