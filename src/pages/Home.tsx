import { Hero } from '@/components/sections/Hero';
import { WhoWeAre } from '@/components/sections/WhoWeAre';
import { FeaturedProperties } from '@/components/sections/FeaturedProperties';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { WhyHorizon } from '@/components/sections/WhyHorizon';
import { TeamSection } from '@/components/sections/TeamSection';
import { CtaSection } from '@/components/sections/CtaSection';

export function Home() {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <FeaturedProperties />
      <ServicesSection />
      <WhyHorizon />
      <TeamSection />
      <CtaSection />
    </>
  );
}
