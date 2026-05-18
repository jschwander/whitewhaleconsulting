import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | White Whale Consulting',
  description:
    'White Whale Consulting helps leaders get beneath the surface. Grounded in a biblical understanding of leadership and the human heart.',
};

const values = [
  'Grounded in a biblical understanding of leadership and the human heart.',
  'Truth spoken with clarity and respect.',
  'Conversation restores trust.',
  'Clarity honors people.',
];

export default function AboutPage() {
  return (
    <div className="pt-16 md:pt-20 bg-page min-h-screen">
      <section className="py-16 px-6 border-b border-slate-200">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl text-navy-heading leading-tight mb-10">About</h1>
          <div className="max-w-none text-base text-slate-600 leading-relaxed">
            <p className="mb-8">
              White Whale Consulting was founded out of a conviction that most
              organizational struggles run deeper than the obvious symptoms.
              What looks like a strategy problem is often a clarity problem.
              What looks like a people problem is often a conversation problem.
              We work with leaders and teams who are ready to look beneath the
              surface and who want a partner who will tell the truth with
              respect.
            </p>
            <p>
              [Founder story placeholder: a short paragraph about background,
              experience, and what led to starting White Whale can go here.]
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-navy-heading leading-tight mb-8">What We Value</h2>
          <ul className="space-y-5">
            {values.map((value) => (
              <li
                key={value}
                className="flex gap-3 text-slate-600 text-base leading-relaxed"
              >
                <span className="text-teal flex-shrink-0 font-serif">—</span>
                {value}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-slate-200">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            Ready to start a conversation?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-teal text-white font-semibold hover:bg-teal-light transition-colors"
          >
            Book a Call
          </Link>
        </div>
      </section>
    </div>
  );
}
