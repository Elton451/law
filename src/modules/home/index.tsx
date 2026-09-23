import { Layout } from 'antd';
import Navbar from '@shared/components/navbar/Navbar';
import AchievementsSection from './fragments/AchievementsSection/AchievementsSection';
import ConceptSection from './fragments/ConceptSection/ConceptSection';
import FinalCtaSection from './fragments/FinalCtaSection/FinalCtaSection';
import FinalHighlightSection from './fragments/FinalHighlightSection/FinalHighlightSection';
import Footer from './fragments/Footer/Footer';
import HeroSection from './fragments/HeroSection/HeroSection';
import MascotSection from './fragments/MascotSection/MascotSection';
import PlatformSection from './fragments/PlatformSection/PlatformSection';

const Home = () => {
  return (
    <main>
      <Layout>
        <Navbar />
        <Layout.Content>
          <HeroSection />
          <PlatformSection />
          <MascotSection />
          <ConceptSection />
          <AchievementsSection />
          <FinalHighlightSection />
          <FinalCtaSection />
        </Layout.Content>
        <Footer />
      </Layout>
    </main>
  );
};

export default Home;
