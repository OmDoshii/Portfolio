# Portfolio — Freelance Developer Portfolio

A production-ready freelance portfolio built with **Next.js 14**, **Firebase**, **Tailwind CSS**, and **Framer Motion**. Features automatic client site screenshots, no-code admin panel, and ISR for fast SEO.

---

## Stack

| Layer | Tool | Cost |
|---|---|---|
| Framework | Next.js 14 (App Router) | Free |
| Styling | Tailwind CSS | Free |
| Animation | Framer Motion | Free |
| Database | Firebase Firestore | Free tier |
| File storage | Firebase Storage | Free tier |
| Hosting | Vercel | Free tier |
| Screenshots | Screenshotone | Free (100/mo) |
| Contact form | Formspree | Free (50/mo) |
| Domain | Your own | ~₹800/yr |

**Total monthly cost: ₹0** (only domain renewal annually)

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd portfolio
npm install
```

### 2. Firebase setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Firestore Database** (start in test mode)
4. Enable **Storage**
5. Go to Project Settings → Your Apps → Add Web App
6. Copy the config values

### 3. Firestore security rules

In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for portfolio data
    match /projects/{doc} {
      allow read: if true;
      allow write: if false; // writes happen server-side only
    }
    match /reviews/{doc} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### 4. Storage rules

In Firebase Console → Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /screenshots/{file} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### 5. Screenshotone

1. Sign up at [screenshotone.com](https://screenshotone.com) (free — 100 screenshots/month)
2. Copy your Access Key

### 6. Formspree (contact form)

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy your form ID
4. Replace `YOUR_FORM_ID` in `components/sections/Contact.tsx`

### 7. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local`.

### 8. Personalise

Find and replace these placeholders across the codebase:

| Placeholder | Replace with |
|---|---|
| `YourName` | Your name |
| `you@yourdomain.com` | Your email |
| `91XXXXXXXXXX` | Your WhatsApp number |
| `yourusername` | Your GitHub/LinkedIn/Twitter handle |
| `YOUR_FORM_ID` | Formspree form ID |

Also update:
- `app/layout.tsx` — metadata title and description
- `components/sections/Stats.tsx` — your actual stats
- `components/sections/Services.tsx` — your pricing
- `components/sections/TechStack.tsx` — your actual tech stack

### 9. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Admin panel

Navigate to `/admin` to manage your content.

**Password**: set `ADMIN_PASSWORD` in your `.env.local`

### Adding a project

1. Go to `/admin`
2. Click **+ Add project**
3. Fill in all fields
4. Click **Add project** to save
5. Once saved, click **Capture screenshot** to auto-generate the preview image
6. Done — appears live on the site within 1 hour (ISR)

### Adding a review

1. Go to `/admin` → Reviews tab
2. Click **+ Add review**
3. Fill in the form
4. Click **Add review**

---

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... repeat for all env vars
vercel env add ADMIN_PASSWORD
vercel env add SCREENSHOTONE_ACCESS_KEY
```

Or set them in the Vercel dashboard under Project → Settings → Environment Variables.

---

## Project structure

```
portfolio/
├── app/
│   ├── admin/page.tsx        # Admin panel (password protected)
│   ├── api/screenshot/       # Screenshot capture API route
│   ├── layout.tsx            # Root layout + metadata
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── components/
│   ├── sections/             # Page sections (Hero, Projects, Reviews...)
│   └── ui/                   # Reusable components (Navbar, ProjectCard...)
├── lib/
│   ├── firebase.ts           # Firebase client init
│   ├── db.ts                 # Firestore CRUD helpers
│   └── screenshot.ts         # Screenshot capture + upload
├── types/
│   └── index.ts              # TypeScript interfaces
└── .env.local.example        # Env variable template
```

---

## Firestore data structure

### `projects` collection

```
{
  title: string
  clientName: string
  clientUrl: string
  screenshotUrl: string        // auto-set by admin
  description: string
  problem: string
  solution: string
  outcome: string              // e.g. "Launched in 3 weeks"
  techStack: string[]
  category: "website"|"app"|"saas"|"other"
  industry: string
  featured: boolean
  caseStudyUrl?: string
  completedAt: string          // ISO date
  createdAt: Timestamp
}
```

### `reviews` collection

```
{
  clientName: string
  clientRole: string           // "Founder, StartupXYZ"
  clientCompany: string
  clientPhoto?: string
  projectId: string            // ref to projects doc
  rating: number               // 1-5
  text: string                 // full review
  highlight: string            // pull quote for hero
  platform: "direct"|"linkedin"|"fiverr"|"upwork"|"other"
  verified: boolean
  createdAt: Timestamp
}
```

---

## Unique features

- **Problem → Solution → Outcome** format on project cards (not just pretty screenshots)
- **Outcome pill** on each card with a real metric
- **Automated screenshot** — paste URL, click button, done
- **Hover-to-reveal** "Visit site" overlay on project screenshots
- **Pull quote** section at top of reviews from your best testimonial
- **Availability badge** on hero that you can toggle from admin
- **ISR** — site rebuilds automatically every hour, no manual deploys needed

---

## License

MIT — use freely for your own portfolio.
