import {babel} from '@rollup/plugin-babel'
import {defineConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import pkg from './package.json'
import preserveDirectives from 'rollup-preserve-directives'
import react from '@vitejs/plugin-react'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        dts({outDir: 'dist/types', rollupTypes: true}),
        preserveDirectives(),
        react(),
        babel({
            babelHelpers: 'runtime',
            plugins: [
                ['@babel/plugin-transform-runtime'],
                [
                    'babel-plugin-polyfill-corejs3',
                    {
                        method: 'usage-pure',
                        version: pkg.dependencies['core-js-pure'],
                        proposals: true,
                    },
                ],
            ],
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            exclude: 'node_modules/**',
        }),
    ],
    build: {
        target: browserslistToEsbuild(),
        outDir: 'dist',
        lib: {
            entry: {
                index: './src/index.ts',
                react: './src/react.tsx',
                next: './src/next.tsx',
                utils: './src/utils/index.ts',
            },
        },
        rollupOptions: {
            external: [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)].flatMap((dep) => [
                dep,
                new RegExp(`^${dep}/.*`),
            ]),
            output: [
                {
                    format: 'es',
                    dir: 'dist/esm',
                },
                {
                    format: 'cjs',
                    dir: 'dist/cjs',
                },
            ],
        },
    },
})
