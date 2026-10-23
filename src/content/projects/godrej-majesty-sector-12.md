---
# Sources:
#   - media/godrej_majesty/Unit Layout_Majesty.pdf: Godrej Properties' unit plans, with the RERA
#     number, plot number, carpet and exclusive areas per type, and which towers have each type.
#   - media/godrej_majesty/Final MLP 3.pdf: master layout plan (tower heights, sold-out towers,
#     43-item landscape legend).
#   - media/godrej_majesty/WhatsApp Image 2026-10-23 at 12.18.03.jpeg: our own "Sunlit Collection"
#     ad (prices, ₹33 Lakh launch benefits, 30:70 plan until 30 Nov 2026).
#   - https://godrejs-newprojects.info/godrej-majesty/ (fetched 23 Oct 2026): a lead-generation
#     site run by Prime Property Consultancy, not by Godrej. Used only for the nearby distances.
# Inferred, so confirm with Godrej's sales team:
#   - Which ad price goes with which unit plan. The ad gives super area and the plans give carpet
#     area; they're paired here in size order (super ÷ carpet is 1.70–1.77 for all four). The ad's
#     "servant" room is the plans' "study" with its own W.C.
#   - The ad says the 2,503 sq. ft. unit is in "Duke Tower"; probably T7, the only tower with
#     Type 4 plans, but nothing says so.
# Conflicts: the partner site prices 3 BHK + S (2,503 sq. ft.) from ₹3.56 Cr and 3 BHK + Study
#   (2,576 sq. ft.) from ₹3.90 Cr. Our ad is used.
# Not in any source, so not shown: possession date, land area, total towers and units (the MLP
#   shows T1–T5 and T7 plus a "future launch" block), coordinates, what the prices include.
# Left out on purpose:
#   - The MLP, because the copy we have has hand-drawn pen marks on it. Ask for a clean copy.
#   - The ad's render as a gallery image: it's low resolution and not an official Godrej render.
#   - The partner site's specifications list (marble, ACs, etc.): unverified.
# Our ad shows no RERA number. UP RERA requires it on every ad; add it before the ad runs again.
name: Godrej Majesty
slug: godrej-majesty-sector-12
tagline: 3 and 4 BHK homes by Godrej Properties in Sector 12, Greater Noida West, from 1,348 sq. ft. carpet
developer: Godrej Properties

location:
  sector: Sector 12
  city: Greater Noida West
  address: Plot No. GH-01/B, C, D, E, J and K, Sector 12, Greater Noida West, Uttar Pradesh

type: residential
# Registered 30 Apr 2025; towers 1 to 5 are marked sold out on the master plan.
status: under-construction

# Carpet area: RERA carpet area from the unit plans (sq m × 10.764). Saleable area and price: our
# Oct 2026 ad. Pairing is by size order; see the note at the top.
configurations:
  - type: 3 BHK + Servant (Type 3)
    carpetArea: { min: 1347.6, max: 1347.6 }
    saleableArea: { min: 2368, max: 2368 }
    price: { min: 35700000, max: 39000000 }
  - type: 3 BHK + Servant (Type 4)
    carpetArea: { min: 1416.5, max: 1416.5 }
    saleableArea: { min: 2503, max: 2503 }
    price: { min: 37600000, max: 38800000 }
  - type: 4 BHK (Type 1)
    carpetArea: { min: 1456.4, max: 1456.4 }
    saleableArea: { min: 2576, max: 2576 }
    price: { min: 38800000, max: 42100000 }
  - type: 4 BHK + Servant (Type 2)
    carpetArea: { min: 1644.7, max: 1644.7 }
    saleableArea: { min: 2799, max: 2799 }
    price: { min: 43500000, max: 46900000 }

priceRange: { min: 35700000, max: 46900000 }
priceBasis: indicative
priceNote: Price ranges for the Sunlit Collection launch (Oct 2026), before launch benefits of up to ₹33 Lakh. Ask us what each price includes; GST, PLC and other charges aren't confirmed yet.

floors: 34

reraNumber: UPRERAPRJ250823/04/2025

# From the master plan's landscape legend.
amenities:
  - Clubhouse with main pool, kids' pool and pool deck
  - Pickleball court
  - Multi-purpose court
  - Cricket practice nets
  - Skating rink
  - Kids' play area and garden
  - Yoga lawn and meditation deck
  - Reflexology path and exercise stations
  - Butterfly garden, fruit orchard and aroma garden
  - Lotus pond and water features
  - Pet park
  - Commercial plaza

highlights:
  - Built by Godrej Properties, registered with UP RERA since April 2025
  - Every type has a study or servant room with its own W.C., except the 4 BHK Type 1
  - Towers of up to 34 floors around a central landscaped podium with 43 features
  - 30:70 payment plan, open until 30 Nov 2026
  - Launch benefits worth up to ₹33 Lakh on the Sunlit Collection

# Approximate distances from a marketing partner's site (godrejs-newprojects.info); not checked by us.
nearby:
  - { name: NH-24, Ghaziabad, category: highway, distanceKm: 9 }
  - { name: Sector 52 metro station, category: metro, distanceKm: 12 }
  - { name: Noida–Greater Noida Expressway, category: highway, distanceKm: 15 }
  - { name: Sector 18, Noida, category: mall, distanceKm: 18 }
  - { name: Noida International Airport, Jewar, category: airport, distanceKm: 50 }

images:
  hero:
    src: ../../assets/projects/godrej-majesty-sector-12/hero.jpg
    alt: Godrej Majesty logo with "Sector 12, Greater Noida (W)", from the developer's unit plan booklet
  promo:
    src: ../../assets/projects/godrej-majesty-sector-12/promo-ad.jpg
    alt: "Godrej Majesty Sunlit Collection ad: 3 and 4 BHK from ₹3.57 Cr to ₹4.69 Cr, launch benefits up to ₹33 Lakh, 30:70 payment plan until 30 November 2026"
  gallery: []
  floorPlans:
    - src: ../../assets/projects/godrej-majesty-sector-12/plan-3bhk-type-3.jpg
      configuration: 3 BHK + Servant (Type 3)
    - src: ../../assets/projects/godrej-majesty-sector-12/plan-3bhk-type-4.jpg
      configuration: 3 BHK + Servant (Type 4)
    - src: ../../assets/projects/godrej-majesty-sector-12/plan-4bhk-type-1.jpg
      configuration: 4 BHK (Type 1)
    - src: ../../assets/projects/godrej-majesty-sector-12/plan-4bhk-type-2.jpg
      configuration: 4 BHK + Servant (Type 2)

featured: false
published: true
listedAt: 2026-10-23T23:00:00+05:30
---

Godrej Majesty is a Godrej Properties housing project in Sector 12, Greater Noida West, on plots GH-01/B, C, D, E, J and K. It is registered with UP RERA (UPRERAPRJ250823/04/2025, dated 30 April 2025) and is being built under a Greater Noida Authority permit issued in February 2025.

The towers stand on two sides of a landscaped podium with lawns, pavilions, a pickleball court, cricket nets, a skating rink, a lotus pond and a pet park,, with the clubhouse and pools at one end. Towers 1, 2 and 3 have 34 floors; towers 4, 5 and 7 have 23 to 24. On the developer's master plan, towers 1 to 5 are already marked sold out.

### The Sunlit Collection

The current release, the Sunlit Collection, comes with launch benefits worth up to ₹33 Lakh and a 30:70 payment plan: 30% within 120 days of booking and 70% near possession. The payment plan is open until 30 November 2026.

| Home | Carpet area (sq. ft.) | Super area (sq. ft.) | Price |
| --- | --- | --- | --- |
| 3 BHK + Servant, Type 3 | 1,347.6 | 2,368 | ₹3.57 Cr to ₹3.90 Cr |
| 3 BHK + Servant, Type 4 | 1,416.5 | 2,503 | ₹3.76 Cr to ₹3.88 Cr |
| 4 BHK, Type 1 | 1,456.4 | 2,576 | ₹3.88 Cr to ₹4.21 Cr |
| 4 BHK + Servant, Type 2 | 1,644.7 | 2,799 | ₹4.35 Cr to ₹4.69 Cr |

Carpet area is the space inside your walls, as registered with RERA; each home also has 27.5 to 31.6 sq. m of exclusive balcony area on top. Super area adds your share of common areas, and it's what the price is quoted on. The 2,503 sq. ft. home is offered in Duke Tower.

Prices change with floor and facing. Ask us for an all-inclusive price sheet for the unit you're considering, and for the launch benefits in writing before you book.
