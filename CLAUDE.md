# PropertyDealing.in website

Lead-generation website for PropertyDealing.in, a RERA-certified real estate advisory in Noida/NCR. It showcases residential and commercial projects (and possibly PG/rentals later). Every page exists to turn a visitor into an enquiry, site-visit booking, callback request or WhatsApp chat.

@AGENTS.md

## Stack
- Astro, Tailwind CSS (v4, via `@tailwindcss/vite`) and TypeScript (strict).
- Don't add any other library, framework or integration without asking me first.
- Node 22.22+ is required (see `.nvmrc`).

## Commands
- `npm run dev`: start the dev server (prefer `astro dev --background`, see AGENTS.md)
- `npm run build`: production build. Run it before every commit.
- `npm run preview`: serve the production build locally

## Mobile-first
- Design for a 375px-wide screen first, then scale up with Tailwind's `sm:`/`md:`/`lg:` prefixes. Unprefixed classes are the mobile styles.
- Tap targets are at least 44px, and primary CTAs (WhatsApp, Call, Enquire) stay within thumb reach on mobile.

## Performance
Most visitors are in India, on mobile phones with average connections.
- Render every image with Astro's `<Image />` or `<Picture />` from `astro:assets`, never a plain `<img>`. Always set `width`, `height` and `alt`.
- Lazy-load everything below the fold (`loading="lazy"`, which is the `<Image />` default). Only the hero/LCP image gets `loading="eager"` and `fetchpriority="high"`.
- Ship zero JavaScript by default. Use a small `<script>` only where interaction needs it.

## Content formats
- **Prices** use Indian units: `₹45 Lakh`, `₹1.2 Cr`. Never `₹4,500,000` or `₹45,00,000` in display copy. Format them through one shared helper, never by hand.
- **Areas** are in sq. ft., for example `1,650 sq. ft.`, with Indian digit grouping.
- **RERA:** every project page must display the project's RERA registration number. Make it a required field in the project data schema, so a project without one fails the build.

## Design
- Use the `frontend-design` skill for all UI work.
- Follow the brand system in `brand/brand-book.html`. Logo files are in `brand/logo/` (outlined SVGs).
- Brand tokens are defined in `src/styles/global.css` (`@theme`). Use the token utilities (`bg-ink`, `text-sun`, `bg-deep`, `font-display`…) rather than raw hex values.
- Fonts: Manrope for headings, Mukta for body text and Hindi. Never use Inter-only typography.
- Avoid generic AI-looking design: no purple or blue gradients, no stock "dream home" visuals, and no `rounded-xl shadow-lg` on every card.
- White text on Sunrise orange (`sun`) fails contrast. Use `ink` text on `sun`, and white text on `deep` for buttons.

## Git
- Commit after each completed feature, with a clear message that says what was added or changed (e.g. `Add project listing card with RERA badge`).
- Make sure `npm run build` passes before committing.
