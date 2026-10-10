import { Button } from '@/components/ui/Button';

export function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-navy py-24 text-white">
      <div className="shell text-center">
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-5 text-[2.2rem] font-extrabold leading-tight sm:text-[3rem]">
          This address is no longer available
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[14.5px] leading-[1.85] text-white/65">
          The page you were looking for may have been moved, or the property has been withdrawn from
          the market. Our current portfolio is below.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button to="/properties" size="lg" variant="champagne">
            Browse properties
          </Button>
          <Button to="/contact" size="lg" variant="outlineLight">
            Talk to an advisor
          </Button>
        </div>
      </div>
    </section>
  );
}
