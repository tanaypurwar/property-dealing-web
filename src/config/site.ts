/**
 * Business details used across the site. Everything in [brackets] is a placeholder
 * waiting for the client to confirm (see "Assumptions" in brand/brand-book.html).
 */
export const site = {
  name: 'Propertydealing.in',
  tagline: 'Trust, in writing.',
  url: 'https://www.propertydealing.in',

  // From the founder's business card. `phone` is for tel: links, `whatsapp` is digits only for wa.me.
  // Assumes the same number takes WhatsApp chats.
  phone: '+919717510425',
  phoneDisplay: '+91 97175 10425',
  whatsapp: '919717510425',
  whatsappGreeting:
    "Namaste! I'm looking for verified projects in Noida or Greater Noida. Please send me options with the full price breakup.",

  email: 'propertydealingteam@gmail.com',
  address: 'Noida 201307, Uttar Pradesh',
  hours: 'Site visits daily, 10 am to 7 pm',
  agentRera: '[UPRERAAGTxxxxx]', // TODO: the card says "RERA Certified" but not the number

  founder: { name: 'Amit Kumar Verma', role: 'Founder' },

  social: [
    // From the QR codes in media/QR codes social media.docx.
    { label: 'Instagram', href: 'https://www.instagram.com/propertydealingteam' },
    { label: 'YouTube', href: 'https://www.youtube.com/@propertydealingteam' },
    { label: 'Facebook', href: 'https://www.facebook.com/propertydealingteam/' },
    { label: 'WhatsApp channel', href: 'https://whatsapp.com/channel/0029VbCGwZhHLHQaPwPGx50c' },
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

  /** Where "Get price sheet" and "Request a callback" go: the enquiry form on the contact page. */
  enquireHref: '/contact#enquire',

  /**
   * TODO: URL that receives enquiry form submissions as a JSON POST (e.g. a form service
   * or CRM webhook). While empty, the enquiry form opens WhatsApp with the details typed
   * in, and brochure requests download without being recorded.
   */
  enquiryEndpoint: '' as string,
} as const;
