import { Layout } from 'antd';
import { useCatalog } from '@shared/catalog/hooks/useCatalog';
import Navbar from '@shared/components/navbar/Navbar';
import AchievementsSection from './fragments/AchievementsSection/AchievementsSection';
import ConceptSection from './fragments/ConceptSection/ConceptSection';
import ExamCalendarSection from './fragments/ExamCalendarSection/ExamCalendarSection';
import FinalCtaSection from './fragments/FinalCtaSection/FinalCtaSection';
import FinalHighlightSection from './fragments/FinalHighlightSection/FinalHighlightSection';
import Footer from './fragments/Footer/Footer';
import HeroSection from './fragments/HeroSection/HeroSection';
import HowItWorksSection from './fragments/HowItWorksSection/HowItWorksSection';
import MascotSection from './fragments/MascotSection/MascotSection';
import NovelosSection from './fragments/NovelosSection/NovelosSection';
import PlatformSection from './fragments/PlatformSection/PlatformSection';
import { useScrollToHash } from './hooks/useScrollToHash';

/** P01 — public landing page (SB01), followed by the platform's other sections. */
const Home = () => {
  const catalog = useCatalog();
  useScrollToHash();

  return (
    <Layout>
      <Navbar />
      <Layout.Content>
        <main>
          <HeroSection />
          <HowItWorksSection />
          <ExamCalendarSection catalog={catalog} onRetry={catalog.reload} />
          <NovelosSection catalog={catalog} onRetry={catalog.reload} />
          <PlatformSection />
          <MascotSection />
          <ConceptSection />
          <AchievementsSection />
          <FinalHighlightSection />
          <FinalCtaSection />
        </main>
      </Layout.Content>
      <Footer />
    </Layout>
  );
};

export default Home;
