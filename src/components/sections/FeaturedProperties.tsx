import { ArrowRight } from 'lucide-react';
import { properties } from '@/data/properties';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PropertyCarousel } from '@/components/property/PropertyCarousel';

export function FeaturedProperties() {
  const featured = [...properties].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <section className="overflow-hidden bg-ivory py-20 lg:py-28">
      <div className="shell">
        <SectionHeading
          align="center"
          label="Featured"
          title="Featured Properties"
          intro="A selection from our current portfolio — private residences, estates and penthouses in prime markets."
        />
      </div>

      <Reveal className="shell mt-14" delay={80}>
        <PropertyCarousel properties={featured} />
      </Reveal>

      <div className="shell mt-12 flex justify-center">
        <Button to="/properties" variant="outline" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
          View all properties
        </Button>
      </div>
    </section>
  );
}
