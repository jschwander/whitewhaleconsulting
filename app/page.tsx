import AppLink from '@/components/AppLink';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero: overlays confined here only; id for header IntersectionObserver */}
      <section id="hero" className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero.webp"
            alt="Ocean and whale"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1080px) 100vw, 1080px"
            quality={65}
          />
          {/* Semi-transparent overlay so ocean/whale image shows through; dark at top for header, fade to white at bottom only. */}
          <div
            className="absolute inset-0 z-10 bg-gradient-to-b from-navy/75 from-0% via-navy/60 via-[50%] to-[#F8FAFC] to-100%"
            aria-hidden
          />
        </div>
        <div className="relative z-20 max-w-3xl mx-auto px-2 sm:px-0">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] text-ivory font-medium leading-[1.1] tracking-tight">
            It&apos;s Never Just the Whale.
          </h1>
          <p className="mt-8 text-center text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
            <span className="block text-ivory/95 font-medium">
              Most problems in an organization are not the real problem.
            </span>
            <span className="block mt-3 text-ivory/85">
              We help leaders address what is actually happening beneath the surface.
            </span>
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <AppLink
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-teal text-white font-semibold text-base sm:text-lg hover:bg-teal-light transition-colors"
            >
              Book a Call
            </AppLink>
            <AppLink
              href="/services"
              className="inline-flex items-center justify-center px-8 py-4 rounded-md border border-ivory/40 text-ivory font-medium text-base sm:text-lg hover:bg-white/5 transition-colors"
            >
              See Services
            </AppLink>
          </div>
          <p className="mt-10 text-ivory/75 text-base sm:text-lg tracking-wide">
            Coaching • Strategic Planning • Conflict Resolution
          </p>
        </div>
      </section>

      {/* What We Do: two-column editorial, light */}
      <section className="bg-page border-t border-slate-200 pt-16 pb-16 md:pt-24 md:pb-24 max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="md:grid md:grid-cols-5 md:gap-16">
          <div className="md:col-span-2">
            <p className="text-xs tracking-widest uppercase text-slate-500 mb-4">
              What we do
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-navy-heading leading-tight mb-6">
              Leadership and team health, beneath the surface.
            </h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-md">
              We work with leaders navigating tension, transition, and misalignment. Our work is practical, direct, and grounded in a biblical understanding of leadership and the human heart.
            </p>
          </div>
          <div className="md:col-span-3 mt-16 md:mt-0 space-y-8">
            <div className="pl-5 border-l-2 border-teal-500">
              <h3 className="font-serif text-xl text-navy-heading mb-2">
                Personal Coaching
              </h3>
              <p className="text-slate-600 text-base mb-4">
                Personal coaching that connects leadership decisions with a biblical lens and practical action.
              </p>
              <ul className="text-slate-600 text-sm leading-relaxed list-disc ml-4 space-y-1">
                <li>Strengthen decision-making and personal lift</li>
                <li>Lead with conviction, humility, and steadiness</li>
              </ul>
            </div>
            <div className="pl-5 border-l-2 border-teal-500">
              <h3 className="font-serif text-xl text-navy-heading mb-2">
                Strategic Planning and Team Alignment
              </h3>
              <p className="text-slate-600 text-base mb-4">
                Clarify direction, define priorities, and create team rhythms that hold under pressure.
              </p>
              <ul className="text-slate-600 text-sm leading-relaxed list-disc ml-4 space-y-1">
                <li>Align leaders on goals, roles, and expectations</li>
                <li>Build accountability without friction</li>
              </ul>
            </div>
            <div className="pl-5 border-l-2 border-teal-500">
              <h3 className="font-serif text-xl text-navy-heading mb-2">
                Conflict Resolution
              </h3>
              <p className="text-slate-600 text-base mb-4">
                Address tension early and normalize the conversations most teams avoid.
              </p>
              <ul className="text-slate-600 text-sm leading-relaxed list-disc ml-4 space-y-1">
                <li>Repair trust and reduce recurring friction</li>
                <li>Create a culture where honesty is valued</li>
              </ul>
            </div>
            <p className="pt-2">
              <AppLink
                href="/services"
                className="text-teal-500 text-sm font-medium hover:underline"
              >
                Learn more
              </AppLink>
            </p>
          </div>
        </div>
      </section>

      {/* One good conversation away: whale background (low/right, cropped), text centered */}
      <section className="section-conversation relative overflow-hidden bg-[#f3f4f6] py-[120px] px-6 border-t border-slate-200">
        <div
          className="absolute left-1/2 top-[-60px] z-[3] w-[850px] opacity-[0.05] pointer-events-none -translate-x-1/2"
          aria-hidden
        >
          <Image
            src="/assets/whale.png"
            alt=""
            width={850}
            height={567}
            className="w-full h-auto object-contain object-top"
            sizes="(max-width: 768px) 100vw, 850px"
            loading="lazy"
          />
        </div>
        <div className="relative z-[2] max-w-[1100px] mx-auto pt-40 flex flex-col items-center">
          <div className="w-full max-w-[520px] text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-navy-heading leading-tight mb-6" style={{ letterSpacing: '-0.5px' }}>
              One good conversation away.
            </h2>
            <div className="text-slate-600 text-base space-y-5 mb-6" style={{ lineHeight: 1.75 }}>
              <p>
                Most teams are not stuck because of strategy.<br />
                They are stuck because of conversations that never happened.
              </p>
              <p>
                Unspoken expectations. Quiet resentment. Avoided conflict.
              </p>
              <p>
                We help leaders address what is actually happening and move forward.
              </p>
            </div>
            <ul className="text-slate-600 text-base leading-relaxed list-disc list-outside pl-5 space-y-1.5 [&>li]:pl-1 text-left inline-block">
              <li>Surface what is unspoken</li>
              <li>Realign expectations</li>
              <li>Repair trust through direct conversation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why White Whale: matches What We Do layout, two-column, teal rule */}
      <section className="bg-white border-t border-slate-200 pt-16 pb-16 md:pt-24 md:pb-24 max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="md:grid md:grid-cols-5 md:gap-16">
          <div className="md:col-span-2 relative">
            <p className="text-xs tracking-widest uppercase text-slate-500 mb-4">
              The name
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-navy-heading leading-tight mb-6">
              Why White Whale.
            </h2>
            <div className="text-base md:text-lg text-slate-600 leading-relaxed max-w-md space-y-4">
              <p>
                In Moby-Dick, the whale appears to be the problem.
                The deeper story is about pride, fear, fixation, and leadership.
              </p>
              <p>
                Organizations are similar.
                The visible issue is rarely the whole story.
              </p>
            </div>
            <div className="mt-10 max-w-[360px] md:max-w-[520px] opacity-20 grayscale" style={{ filter: 'grayscale(1)' }}>
              <Image
                src="/assets/whale-ship.png"
                alt="Whaling ship pursuing a whale, symbolic of the deeper story beneath visible conflict."
                width={520}
                height={347}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 90vw, 520px"
                loading="lazy"
              />
            </div>
          </div>
          <div className="md:col-span-3 mt-16 md:mt-0 pl-5 border-l-2 border-teal-500">
            <div className="rounded-2xl border border-black/[0.06] bg-[#f6f7f8] p-8 md:p-10">
              <p className="text-xs tracking-widest uppercase text-slate-500 mb-3">
                The process
              </p>
              <p className="font-serif text-2xl md:text-3xl text-navy-heading leading-tight mb-8">
                It&apos;s never just the whale.
              </p>
              <div className="space-y-6">
                {[
                  { num: '01', title: 'Listen', desc: 'Understand what\'s underneath.' },
                  { num: '02', title: 'Clarify', desc: 'Define what "better" looks like.' },
                  { num: '03', title: 'Facilitate', desc: 'Lead the conversation that needs to happen.' },
                  { num: '04', title: 'Install', desc: 'Put simple rhythms in place.' },
                  { num: '05', title: 'Support', desc: 'Stay engaged as leaders practice.' },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-teal-500 text-teal font-sans text-xs font-semibold flex items-center justify-center">
                      {step.num}
                    </span>
                    <div>
                      <p className="font-serif text-xl text-navy-heading leading-tight">
                        {step.title}
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA: dark band, tight and cohesive */}
      <section className="py-16 px-6 bg-navy-dark border-t border-slate-200 bg-gradient-to-b from-navy-dark to-navy">
        <div className="max-w-[1200px] mx-auto md:px-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-ivory leading-tight">
              Ready to get above water?
            </h2>
            <p className="mt-2 text-ivory/80 text-base max-w-md leading-relaxed">
              Book a short call. We will listen and help you choose the next right step.
            </p>
          </div>
          <AppLink
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-teal text-white font-semibold hover:bg-teal-light transition-colors shrink-0"
          >
            Book a Call
          </AppLink>
        </div>
      </section>
    </div>
  );
}
