import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ohmd.us',
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404') && !page.endsWith('/404/'),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          zh: 'zh-CN',
        },
      },
      lastmod: new Date('2026-09-04T16:59:36Z'),
      changefreq: 'weekly',
    }),
  ],
  devToolbar: { enabled: false },
});
