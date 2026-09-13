import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

function surgeSpaFallback(): Plugin {
  let outputDirectory = '';

  return {
    name: 'surge-spa-fallback',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      await copyFile(
        resolve(outputDirectory, 'index.html'),
        resolve(outputDirectory, '200.html'),
      );
    },
  };
}

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tailwindcss(),
    surgeSpaFallback(),
  ],
});
