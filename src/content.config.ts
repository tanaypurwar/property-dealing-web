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
          latitude: z.number().min(-90).max(90),
          longitude: z.number().min(-180).max(180),
        }),

        type: z.enum(['residential', 'commercial', 'plot', 'pg-rental']),
        status: z.enum(['upcoming', 'under-construction', 'ready-to-move']),

        configurations: z
          .array(
            z.object({
              type: z.string().trim().min(1), // "2BHK", "3BHK", "Shop", "Office"
              carpetArea: range('carpetArea'), // sq. ft.
              price: range('price'), // rupees
            }),
          )
          .min(1),

        /** Overall range for listing filters. Must cover every configuration's price range. */
        priceRange: z.object({ min: rupees, max: rupees }),

        landAreaAcres: z.number().positive(),
        towers: z.number().int().positive().optional(), // n/a for plots
        totalUnits: z.number().int().positive(),
        floors: z.number().int().positive().optional(), // tallest tower; n/a for plots

        /** Month precision is enough: `2027-12` or `2027-12-31`. Required unless upcoming. */
        possessionDate: z.coerce.date().optional(),

        reraNumber: z.string().trim().min(5, 'RERA registration number is required'),

        amenities: z.array(z.string().trim().min(1)).min(1),
        highlights: z.array(z.string().trim().min(1)).min(3).max(6),

        nearby: z.array(
          z.object({
            name: z.string().trim().min(1),
            category: z.enum(['school', 'hospital', 'metro', 'mall', 'highway']),
            distanceKm: z.number().nonnegative(),
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
        const minPrice = Math.min(...p.configurations.map((c) => c.price.min));
        const maxPrice = Math.max(...p.configurations.map((c) => c.price.max));
        if (p.priceRange.min > minPrice || p.priceRange.max < maxPrice) {
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

        if (p.status !== 'upcoming' && !p.possessionDate) {
          ctx.addIssue({
            code: 'custom',
            path: ['possessionDate'],
            message: 'possessionDate is required unless status is upcoming',
          });
        }
      }),
});

export const collections = { projects };
