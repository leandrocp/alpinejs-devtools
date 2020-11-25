import filesize from 'rollup-plugin-filesize'
import replace from '@rollup/plugin-replace'
import copy from 'rollup-plugin-copy'
import resolve from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import pkg from './package.json'
import { dependencies } from './package-lock.json';

import fs from 'fs';
import path from 'path';

if (process.env.ROLLUP_WATCH === 'true') {
    fs.watch('./packages/shell-chrome/assets', { recursive: true }, (_event, filename) => {
        try {
            console.info(`Copying asset "${filename}" to dist/chrome`);
            fs.copyFileSync(path.join('./packages/shell-chrome/assets/', filename), path.join('./dist/chrome', filename));
        } catch(e) {
            console.error(e);
        }
    });
}

export default {
    input: [
        'packages/shell-chrome/src/background.js',
        'packages/shell-chrome/src/devtools-background.js',
        'packages/shell-chrome/src/backend.js',
        'packages/shell-chrome/src/panel.js',
        'packages/shell-chrome/src/proxy.js',
        'packages/shell-chrome/src/detector.js',
    ],
    output: {
        dir: 'dist/chrome'
    },
    plugins: [
        replace({
            __alpine_version__: dependencies.alpinejs.version
        }),
        resolve(),
        postcss({
            extract: 'styles.css',
        }),
        copy({
            targets: [
                {
                    src: 'packages/shell-chrome/assets/**/*',
                    dest: 'dist/chrome',
                },
                {
                    src: 'packages/shell-chrome/assets/manifest.json',
                    dest: 'dist/chrome',
                    // inject version into manifest
                    transform(contents) {
                        return contents.toString().replace('__version__', pkg.version)
                    }
                }
            ]
        }),
        filesize(),
    ],
}
