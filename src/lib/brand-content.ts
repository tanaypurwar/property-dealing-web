/** Brand copy shared by the home and About pages, from brand/brand-book.html (Part A). */
import type { IconName } from '../components/Icon.astro';

// The four brand pillars (brand book, Part A), each answering a fear buyers have about brokers.
export const promises: { title: string; body: string }[] = [
  {
    title: 'Verified before it’s listed',
    body: 'Our team visits the site, checks the RERA registration and confirms the developer’s approvals before a project reaches this website. If we haven’t checked it, we don’t show it.',
  },
  {
    title: 'The full price, first',
    body: 'You get an all-inclusive price breakup (BSP, PLC, IFMS, parking, club, GST, stamp duty and registry) before the site visit. The number you see is the number you pay.',
  },
  {
    title: 'One advisor, till registry',
    body: 'The person who shows you the project is the person who helps with the loan, the paperwork and the registry. No hand-offs to strangers.',
  },
  {
    title: 'Your time, your terms',
    body: 'No cold-call storms. You pick the call time, or talk to us on WhatsApp. We never pass your number to other brokers.',
  },
];

// A real sequence, so it's numbered.
export const steps: { icon: IconName; title: string; body: string }[] = [
  { icon: 'chat', title: 'Tell us what you need', body: 'Budget, area and timeline, on a call at the time you pick or on WhatsApp.' },
  { icon: 'sheet', title: 'Get verified options', body: 'A shortlist that fits, each with its RERA number and an all-inclusive price sheet.' },
  { icon: 'pin', title: 'Visit the sites', body: 'Free site visits with your advisor, on the days that suit you.' },
  { icon: 'home', title: 'Book and finance', body: 'Help with the booking, payment plan and home loan, with every charge in writing.' },
  { icon: 'shield', title: 'Registry', body: 'Your advisor stays with you until the registry is done.' },
];
