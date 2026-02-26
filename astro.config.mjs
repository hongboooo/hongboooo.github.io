import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  site: 'https://hongboooo.github.io',
  output: 'static',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  vite: {
    plugins: [yaml()],
  },
});
