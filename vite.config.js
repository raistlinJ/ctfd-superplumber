import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import FullReload from 'vite-plugin-full-reload';
import legacy from '@vitejs/plugin-legacy';

const inputEntries = {
  main: path.resolve(__dirname, 'assets/js/main.js'),
  notifications: path.resolve(__dirname, 'assets/js/notifications.js'),
  settings: path.resolve(__dirname, 'assets/js/settings.js'),
  setup: path.resolve(__dirname, 'assets/js/setup.js'),
  teamsList: path.resolve(__dirname, 'assets/js/teams/list.js'),
  teamsPrivate: path.resolve(__dirname, 'assets/js/teams/private.js'),
  teamsPublic: path.resolve(__dirname, 'assets/js/teams/public.js'),
  usersList: path.resolve(__dirname, 'assets/js/users/list.js'),
  usersPrivate: path.resolve(__dirname, 'assets/js/users/private.js'),
  usersPublic: path.resolve(__dirname, 'assets/js/users/public.js')
};

// Custom plugin to emit a CTFd-compatible manifest
function ctfdManifestPlugin() {
  const projectRoot = process.cwd();

  return {
    name: 'ctfd-manifest',
    apply: 'build',
    writeBundle(options, bundle) {
      const manifest = {};

      const resolveImports = (references = []) =>
        references
          .map(reference => bundle[reference]?.fileName || reference)
          .filter(Boolean);

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'asset') {
          if (!fileName.endsWith('.css')) {
            continue;
          }

          const cssKey = `${path.parse(fileName).name.split('.')[0]}.css`;
          manifest[cssKey] = { file: fileName };
          continue;
        }

        if (chunk.type === 'chunk') {
          let assetKey;

          if (chunk.facadeModuleId) {
            const relativePath = path
              .relative(projectRoot, chunk.facadeModuleId)
              .replace(/\\/g, '/');

            if (relativePath.startsWith('assets/')) {
              assetKey = relativePath;
            }
          }

          if (!assetKey) {
            assetKey = `${chunk.name}.js`;
          }

          const entry = {
            file: fileName,
            isEntry: !!chunk.isEntry,
          };

          if (chunk.imports?.length) {
            entry.imports = resolveImports(chunk.imports);
          }

          if (chunk.dynamicImports?.length) {
            entry.dynamicImports = resolveImports(chunk.dynamicImports);
          }

          if (chunk.viteMetadata?.importedCss?.size) {
            entry.css = Array.from(chunk.viteMetadata.importedCss);
          }

          manifest[assetKey] = entry;

          if (assetKey === 'assets/js/main.js') {
            manifest['main.js'] = entry;
          }
        }
      }

      const outDir = options.dir ?? 'dist';
      const manifestPath = path.join(outDir, 'manifest.json');

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    }
  };
}

export default defineConfig({
  plugins: [
    FullReload(['templates/**/*.html']),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    ctfdManifestPlugin()
  ],
  build: {
    manifest: false,
    outDir: 'static',
    assetsDir: 'assets',
    emptyOutDir: false,
    rollupOptions: {
      input: inputEntries,
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      '~bootstrap-icons': path.resolve(__dirname, 'node_modules/bootstrap-icons'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [path.resolve(__dirname, 'node_modules')]
      }
    }
  }
});