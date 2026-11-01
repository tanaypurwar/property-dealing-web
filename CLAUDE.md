# PropertyDealing.in website

Lead-generation website for PropertyDealing.in, a RERA-certified real estate advisory in Noida/NCR. It showcases residential and commercial projects (and possibly PG/rentals later). Every page exists to turn a visitor into an enquiry, site-visit booking, callback request or WhatsApp chat.

@AGENTS.md

## Stack
- Astro, Tailwind CSS (v4, via `@tailwindcss/vite`) and TypeScript (strict).
- GSAP (`gsap`, including its free plugins such as ScrollTrigger) is approved for motion. Follow the installed `gsap-*` skills in `.agents/skills/`.
- Ask me before adding any other library, framework or integration (including React, which `@gsap/react` would need).
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
- Ship zero JavaScript by default. Use a small `<script>` only where interaction needs it. Prefer CSS for motion (transitions, keyframes, scroll timelines) and reach for GSAP only when CSS can't do it, loading it only on the pages that use it.

## Content formats
- **Prices** use Indian units: `₹45 Lakh`, `₹1.2 Cr`. These formats override any example elsewhere in this file. Never `₹4,500,000` or `₹45,00,000` in display copy. Format them through one shared helper, never by hand.
- **Areas** are in sq. ft., for example `1,650 sq. ft.`, with Indian digit grouping.
- **RERA:** every project page must display the project's RERA registration number. Make it a required field in the project data schema, so a project without one fails the build.

## Design
- Use the `frontend-design` skill for all UI work, along with the **Premium Frontend UI** preset (`.agents/skills/premium-frontend-ui`) and **UI/UX Pro Max** (`ui-ux-pro-max`) standards below. Don't use generic AI templates or SaaS aesthetics, and don't install external MCP servers.
- Follow the brand system in `brand/brand-book.html`. For the website, its "Revision, November 2026" section replaces the older colour and type rules. Logo files are in `brand/logo/` (outlined SVGs); the site uses the mono white logo.
- Brand tokens are defined in `src/styles/global.css` (`@theme`). Use the token utilities in the tables below rather than raw hex values or Tailwind's default `stone-*`/`amber-*` palette, so a palette change stays a one-file edit.
- Buttons: canvas text on `champagne` for primary, white text on `neem` for WhatsApp only.

### 1. Aesthetic direction and anti-patterns ("break the default")
- **Zero tolerance for AI slop:**
  - BANNED: saturated purple/indigo gradients, blue glow orbs, multi-colour gradient text, and heavy drop shadows (`shadow-2xl` on stark white).
  - BANNED: centered generic landing-page heroes ("centered H1 + subline + two rounded pill buttons").
  - BANNED: neon or primary-colour status badges.
  - BANNED: stock "dream home" visuals, and `rounded-xl shadow-lg` on every card.
- **Layout architecture:**
  - Use asymmetrical, editorial grid arrangements (e.g. 8-column narrative / 4-column data console).
  - Leave generous negative space (`py-20` to `py-32` on marketing sections, `gap-8` to `gap-12` on grids).
  - Use 1px hairline borders with subtle alpha (`border-line`, which is stone-800/60). The site is dark only.

### 2. Colour tokens and surface hierarchy
Ground the site in deep architectural minerals, raw stone and understated champagne:

| Role | Value | Project token |
| :--- | :--- | :--- |
| **Ground / deep background** | Warm charcoal `#0F0E0E` | `bg-canvas` |
| **Elevated surface (cards, modals)** | Dark warm stone `#1C1917`, translucent | `bg-surface/80 backdrop-blur-md` |
| **Hover / pressed surface** | `#292524` | `bg-raised` |
| **Borders and dividers** | Hairline muted stone, stone-800/60 | `border-line` |
| **Form control borders** | `#78716C` (3:1 on surface) | `border-edge` |
| **Primary typography** | Alabaster `#ECE6DC` | `text-alabaster` |
| **Muted copy and labels** | Warm ash `#A8A29E` | `text-mist` |
| **Accent / currency / verification** | Champagne `#D4AF37` | `text-champagne` |
| **WhatsApp / form errors** | `#2F6B4F` / `#E8907A` | `bg-neem` / `text-alert` |

### 3. Typography
- **Headings (property titles, hero lines, section headlines):** high-contrast editorial serif, Cormorant Garamond (`font-display`, weight 500). Tracking `tracking-tight` to `tracking-normal`; compact architectural leading (`leading-[1.08]`). Cormorant has no ₹ glyph, so never set a price in it.
- **Data, navigation and body (specs, currency, filters, body copy):** Plus Jakarta Sans (`font-sans`). Mukta stays in the sans stack to render Hindi.
- **Prices and specs:** always tabular lining figures (the `figures` class) with clear unit labels, formatted per "Content formats" above.
- **Micro-copy and field labels:** uppercase, tracked-out sans (`text-xs uppercase tracking-wider font-medium text-mist`).

### 4. Component standards
- **Aspect ratios and image loading:** property image containers must use explicit aspect ratios (`aspect-video`, `aspect-[4/3]` or `aspect-[21/9]`) to eliminate layout shift.
- **Card vignettes:** property cards get a subtle dark vignette over the photo (`bg-linear-to-t from-canvas via-transparent`) so overlaid text stays readable.
- **Badges and verification tags:** RERA tags, possession milestones and "Ready to move" pills are muted glass capsules (`rounded-full border border-line bg-surface/60 px-3 py-1 text-xs text-alabaster/80 backdrop-blur-sm`), never bright solid fills.
- **Interactive states:** understated transitions only: subtle border-colour shifts (`hover:border-edge`), a slight scale on image cards (`group-hover:scale-105 transition-transform duration-700 ease-settle`), and champagne focus rings (`focus-visible:ring-champagne/40`).

### 5. Animation (hardware-accelerated only)
- Restrict every entrance, reveal and hover transition to `transform` (x, y, scale, rotation) and `opacity`.
- Never animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`).
- Use the easing tokens in `global.css` (`ease-settle`, `ease-hover`, `ease-press`) and the `reveal-load` / `reveal-scroll` / `reveal-swap` utilities before writing new motion.
- Respect reduced motion: put all motion behind `@media (prefers-reduced-motion: no-preference)` in CSS, or `gsap.matchMedia()` in scripts, so reduced-motion users see the final static state.
- Never fade in the LCP image; it delays LCP.
- With GSAP, always clean up: wrap each component's timelines and ScrollTriggers in `gsap.context()` and call `ctx.revert()` when the page unloads. If Astro view transitions (`<ClientRouter />`) are added, revert on `astro:before-swap` and re-init on `astro:page-load`. (`useGSAP()` from `@gsap/react` only applies if React is approved.)

## Git
- Commit after each completed feature, with a clear message that says what was added or changed (e.g. `Add project listing card with RERA badge`).
- Make sure `npm run build` passes before committing.
