import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** A min–max pair, e.g. a price or carpet-area range. */
const range = (what: string) =>
  z
    .object({
      min: z.number().positive(),
      max: z.number().positive(),
    })
    .refine((r) => r.min <= r.max, { message: `${what}: min must be ≤ max` });

/** Prices are whole rupees (₹45 Lakh = 4500000). Format for display with the shared price helper. */
const rupees = z.number().int().positive();

const projects = defineCollection({
  // The glob loader uses a `slug` frontmatter field as the entry id when present.
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string().trim().min(1),
        slug: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase-kebab-case'),
        tagline: z.string().trim().min(1).max(120),
        developer: z.string().trim().min(1),

        location: z.object({
          sector: z.string().trim().min(1), // "Sector 150", "Greater Noida West"
          city: z.string().trim().min(1),
          address: z.string().trim().min(1),
          /** Leave both out until the exact site is confirmed; the map then searches the address. */
          latitude: z.number().min(-90).max(90).optional(),
          longitude: z.number().min(-180).max(180).optional(),
        }),

        type: z.enum(['residential', 'commercial', 'plot', 'pg-rental']),
        status: z.enum(['upcoming', 'under-construction', 'ready-to-move']),

        configurations: z
          .array(
            z
              .object({
                type: z.string().trim().min(1), // "2BHK", "3BHK 2T", "Shop", "Office"
                // sq. ft. Carpet area is the RERA measure; use saleable (super) area only when
                // the developer hasn't shared carpet area yet. Never put one in the other's field.
                // Leave both out if neither is known; the site then shows "Area on request".
                carpetArea: range('carpetArea').optional(),
                saleableArea: range('saleableArea').optional(),
                // Rupees. Leave out when the developer hasn't priced this unit type; the site
                // shows "On request" and filters use the project's starting price.
                price: range('price').optional(),
              }),
          )
          .min(1),

        /**
         * Overall range for listing filters. Must cover every priced configuration. Leave `max`
         * out when only a starting price is known; it then shows as "From ₹X".
         */
        priceRange: z.object({ min: rupees, max: rupees.optional() }),
        /**
         * What the prices include. `all-inclusive` is the brand default; `base` means BSP only;
         * `indicative` means starting prices whose basis isn't confirmed yet. For anything but
         * all-inclusive, `priceNote` must say what's extra or unconfirmed.
         */
        priceBasis: z.enum(['all-inclusive', 'base', 'indicative']).default('all-inclusive'),
        priceNote: z.string().trim().min(1).optional(),

        landAreaAcres: z.number().positive().optional(),
        towers: z.number().int().positive().optional(), // n/a for plots
        totalUnits: z.number().int().positive().optional(),
        floors: z.number().int().positive().optional(), // tallest tower; n/a for plots

        /** Month precision is enough: `2027-12` or `2027-12-31`. Required unless upcoming. */
        possessionDate: z.coerce.date().optional(),

        reraNumber: z.string().trim().min(5, 'RERA registration number is required'),

        amenities: z.array(z.string().trim().min(1)).min(1),
        highlights: z.array(z.string().trim().min(1)).min(3).max(6),

        nearby: z.array(
          z
            .object({
              name: z.string().trim().min(1),
              category: z.enum([
                'metro',
                'railway',
                'highway',
                'airport',
                'school',
                'hospital',
                'mall',
                'office',
              ]),
              // Use whichever the source gives; don't convert drive times into kilometres.
              distanceKm: z.number().nonnegative().optional(),
              travelMinutes: z.number().int().positive().optional(),
            })
            .refine((n) => n.distanceKm !== undefined || n.travelMinutes !== undefined, {
              message: 'each nearby place needs distanceKm or travelMinutes',
            }),
        ),

        images: z.object({
          hero: z.object({ src: image(), alt: z.string().trim().min(1) }),
          gallery: z.array(z.object({ src: image(), caption: z.string().trim().min(1) })),
          floorPlans: z.array(
            z.object({ src: image(), configuration: z.string().trim().min(1) }),
          ),
        }),

        /** Path under public/, e.g. `/brochures/skyline-150.pdf`. */
        brochure: z
          .string()
          .regex(/^\/brochures\/[\w.-]+\.pdf$/, 'brochure must be /brochures/<file>.pdf')
          .optional(),
        /** Ask for name and phone before the brochure downloads. Set false to make it a direct download. */
        brochureGated: z.boolean().default(true),
        video: z
          .url()
          .regex(
            /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/,
            'video must be a YouTube URL',
          )
          .optional(),

        featured: z.boolean().default(false),
        published: z.boolean().default(false),
        /** When the project was added to the site. Drives the "Newest" sort. */
        listedAt: z.coerce.date(),
      })
      .superRefine((p, ctx) => {
        const priced = p.configurations.flatMap((c) => (c.price ? [c.price] : []));
        const minPrice = Math.min(...priced.map((r) => r.min));
        const maxPrice = Math.max(...priced.map((r) => r.max));
        if (
          priced.length > 0 &&
          (p.priceRange.min > minPrice || (p.priceRange.max !== undefined && p.priceRange.max < maxPrice))
        ) {
          ctx.addIssue({
            code: 'custom',
            path: ['priceRange'],
            message: `priceRange must cover configuration prices (${minPrice}–${maxPrice})`,
          });
        }

        const configTypes = new Set(p.configurations.map((c) => c.type));
        p.images.floorPlans.forEach((plan, i) => {
          if (!configTypes.has(plan.configuration)) {
            ctx.addIssue({
              code: 'custom',
              path: ['images', 'floorPlans', i, 'configuration'],
              message: `"${plan.configuration}" is not one of: ${[...configTypes].join(', ')}`,
            });
          }
        });

        if (p.priceBasis !== 'all-inclusive' && !p.priceNote) {
          ctx.addIssue({
            code: 'custom',
            path: ['priceNote'],
            message: 'priceNote is required unless prices are all-inclusive: say what is extra or unconfirmed',
          });
        }

        if ((p.location.latitude === undefined) !== (p.location.longitude === undefined)) {
          ctx.addIssue({
            code: 'custom',
            path: ['location'],
            message: 'set both latitude and longitude, or neither',
          });
        }

        // Drafts may carry a placeholder RERA number; a published page may not.
        if (p.published && /[[\]]|pending|tbc|tba/i.test(p.reraNumber)) {
          ctx.addIssue({
            code: 'custom',
            path: ['reraNumber'],
            message: 'a published project needs its real UP RERA registration number',
          });
        }

        // possessionDate is optional: some projects (e.g. "OC applied") have no published date.
        // Show it whenever the RERA filing or developer gives one.
      }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().trim().min(1).max(110),
    /** Meta description and the summary on /blog. Keep it under ~160 characters. */
    description: z.string().trim().min(1).max(170),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().trim().min(1),
    tags: z.array(z.string().trim().min(1)).default([]),
    /** Every factual claim in a post should trace to one of these. Shown at the end of the post. */
    sources: z.array(z.object({ title: z.string().trim().min(1), url: z.url() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
