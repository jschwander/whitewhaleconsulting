import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services | White Whale Consulting',
  description:
    'Personal coaching, strategic planning & team alignment, and conflict resolution. We help leaders get beneath the surface.',
};

const services = [
  {
    title: 'Personal Coaching',
    description:
      'Biblical perspective applied to leadership, decision-making, and personal lift.',
    outcomes: [
      'Clearer decision-making under pressure',
      'Stronger alignment between values and actions',
      'Sustainable rhythms for leadership and life',
      'Accountability that fits your context',
    ],
    scenarios: [
      'A leader facing a major transition and needing a sounding board.',
      'Someone who wants to lead with integrity but feels pulled in competing directions.',
      'An executive who needs space to think clearly before big calls.',
    ],
  },
  {
    title: 'Strategic Planning & Team Alignment',
    description:
      'Clarify direction, define roles, and build rhythms that hold.',
    outcomes: [
      'A shared picture of the win and how to get there',
      'Roles and expectations that everyone understands',
      'Meetings and rhythms that actually move work forward',
      'Less confusion, fewer duplicated efforts',
    ],
    scenarios: [
      'A team that has grown quickly and lost a clear sense of direction.',
      'Leaders who need to align on priorities before bringing the rest of the org along.',
      'An organization that wants to turn strategy into habits, not just documents.',
    ],
  },
  {
    title: 'Conflict Resolution',
    description:
      'Surface tension early and build cultures where honest conversation is valued.',
    outcomes: [
      "Safe spaces to name what's really going on",
      'Conversations that repair trust instead of deepening divides',
      'Practices that prevent small issues from becoming crises',
      'A culture where feedback and clarity are normal, not rare',
    ],
    scenarios: [
      "Two key leaders who can't seem to get on the same page.",
      'A team where people are frustrated but nothing gets said in the open.',
      'After a crisis or misstep, when trust needs to be rebuilt deliberately.',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-16 md:pt-20 bg-page min-h-screen">
      <section className="py-16 px-6 border-b border-slate-200">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-navy-heading leading-tight mb-6">Services</h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            We believe most organizations are not broken. They are one good
            conversation away from clarity.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-20">
          {services.map((service) => (
            <article
              key={service.title}
              className="border-b border-slate-200 pb-16 last:border-0 last:pb-0"
            >
              <h2 className="font-serif text-xl text-navy-heading leading-tight mb-3">
                {service.title}
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-8">{service.description}</p>
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-navy-heading font-semibold text-xs uppercase tracking-widest text-slate-500 mb-4">
                    Outcomes
                  </h3>
                  <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
                    {service.outcomes.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-teal flex-shrink-0">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-navy-heading font-semibold text-xs uppercase tracking-widest text-slate-500 mb-4">
                    Example scenarios
                  </h3>
                  <ul className="space-y-3 text-slate-600 text-sm leading-relaxed">
                    {service.scenarios.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-teal flex-shrink-0">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-white border-t border-slate-200">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            Not sure where to start? We can help you name what you need.
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
