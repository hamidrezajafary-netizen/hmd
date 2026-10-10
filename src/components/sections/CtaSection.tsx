import { ArrowRight, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export function CtaSection() {
  return (
    <section className="bg-white pb-20 lg:pb-28">
      <div className="shell">
        <Reveal className="rounded-2xl border border-[#DEE6EE] bg-[#EDF2F7] p-7 sm:p-9 lg:p-10">
          <div className="flex flex-col items-start gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="flex items-start gap-5 lg:items-center">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-navy shadow-soft">
                <KeyRound className="h-6 w-6 text-champagne" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[21px] font-bold leading-tight sm:text-[24px]">
                  Ready to Find Your Perfect Property?
                </h2>
                <p className="mt-2 max-w-xl text-[13.5px] leading-[1.8] text-muted">
                  Let our experts guide you to the right home or investment.
                </p>
              </div>
            </div>

            <Button
              to="/contact"
              size="lg"
              className="w-full shrink-0 lg:w-auto"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Get in Touch
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
