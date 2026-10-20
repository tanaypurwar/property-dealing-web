// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Served from CloudFront on www; GoDaddy forwards the bare domain here (see deploy/README.md).
  site: 'https://www.propertydealing.in',
  vite: {
    plugins: [tailwindcss()]
  }
});