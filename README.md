# White Whale Consulting

A premium marketing website for White Whale Consulting—calm, executive, minimal. Built with Next.js (App Router), TypeScript, and Tailwind CSS. Static site, optimized for Vercel.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **next/font** (Playfair Display, Inter)
- **next/image** for all images
- Static site, no database

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add image assets

Place these files in `public/assets/`:

- **logo.png** – White Whale Consulting logo (e.g. 80×80 or similar)
- **hero.webp** – Ocean + whale hero image (high quality, landscape)

If assets are missing, the dev server will still run but the logo and hero image will 404 until you add them.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm start
```

## Deployment (Vercel)

1. Push this repo to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com](https://vercel.com) and sign in.
3. Click **Add New** → **Project** and import your repository.
4. Vercel will detect Next.js. Keep the default settings (Build Command: `npm run build`, Output: Next.js).
5. Click **Deploy**.

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

Follow the prompts and link the project. Subsequent deploys: `vercel --prod`.

## Project structure

```
/app
  layout.tsx       # Root layout, fonts, Header, Footer
  page.tsx         # Home
  services/        # /services
  about/           # /about
  contact/         # /contact
  globals.css
/components
  Header.tsx
  Footer.tsx
/public
  assets/
    logo.png
    hero.webp
```

## Pages

- **Home** (`/`) – Hero, What We Do, One Good Conversation, How We Work, Why White Whale, CTA
- **Services** (`/services`) – Three services with outcomes and example scenarios
- **About** (`/about`) – Founder placeholder, values
- **Contact** (`/contact`) – Form with mailto: submission; add your email in the form handler when ready

## Contact form

The contact form currently uses `mailto:` to open the user’s email client. To use a specific address, edit `app/contact/page.tsx` and change `hello@whitewhaleconsulting.com` in the `mailto:` URL to your email.

For a production setup you can later replace this with an API route that sends email via a provider (e.g. Resend, SendGrid) or a form service (e.g. Formspree).
