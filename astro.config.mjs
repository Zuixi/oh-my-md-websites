import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ohmd.us',
  output: 'static',
  integrations: [sitemap()],
});
