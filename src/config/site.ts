/**
 * Business details used across the site. Everything in [brackets] is a placeholder
 * waiting for the client to confirm (see "Assumptions" in brand/brand-book.html).
 */
export const site = {
  name: 'Propertydealing.in',
  tagline: 'Trust, in writing.',
  url: 'https://propertydealing.in',

  // TODO: replace with the real number. `phone` is for tel: links, `whatsapp` is digits only for wa.me.
  phone: '+919999999999',
  phoneDisplay: '+91 99999 99999',
  whatsapp: '919999999999',
  whatsappGreeting:
    "Namaste! I'm looking for verified projects in Noida or Greater Noida. Please send me options with the full price breakup.",

  email: '[hello@propertydealing.in]',
  address: '[Office address], Noida, Uttar Pradesh',
  hours: 'Site visits daily, 10 am to 7 pm',
  agentRera: '[UPRERAAGTxxxxx]',

  social: [
    { label: 'Instagram', href: 'https://instagram.com/[handle]' },
    { label: 'Facebook', href: 'https://facebook.com/[handle]' },
    { label: 'YouTube', href: 'https://youtube.com/@[handle]' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/[handle]' },
  ],

  nav: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],

  projectTypes: [
    { label: 'Residential', href: '/projects?type=residential' },
    { label: 'Commercial', href: '/projects?type=commercial' },
    { label: 'Plots', href: '/projects?type=plot' },
    { label: 'PG and rentals', href: '/projects?type=pg-rental' },
  ],

  /** Where "Get price sheet" goes until the enquiry form exists. */
  enquireHref: '/contact#enquire',
} as const;
