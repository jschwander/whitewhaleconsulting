'use client';

import { useState, FormEvent } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const company = (form.elements.namedItem('company') as HTMLInputElement)
      .value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement)
      .value;
    const subject = encodeURIComponent('White Whale Consulting – Contact');
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:hello@whitewhaleconsulting.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <div className="pt-16 md:pt-20 bg-page min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl text-navy-heading leading-tight mb-4">Contact</h1>
          <p className="text-slate-600 text-base leading-relaxed mb-10">
            Tell us a bit about yourself and what you&apos;re looking for. We&apos;ll
            get back to you shortly.
          </p>
          <p className="text-slate-500 text-sm mb-10">
            Confidential consultations available.
          </p>

          {submitted ? (
            <p className="text-slate-600 text-base leading-relaxed">
              Your email client should open with your message. Send the email to
              reach us. We&apos;ll respond as soon as we can.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-slate-600 text-sm font-medium mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-slate-600 text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
                />
              </div>
              <div>
                <label
                  htmlFor="company"
                  className="block text-slate-600 text-sm font-medium mb-2"
                >
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="w-full px-4 py-3 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-slate-600 text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal resize-y"
                  placeholder="Your message"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-md bg-teal text-white font-semibold hover:bg-teal-light transition-colors"
              >
                Send message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
