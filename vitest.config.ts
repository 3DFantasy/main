import react from '@vitejs/plugin-react'
import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'vitest/config'

loadEnv({ path: '.env.test' })

export default defineConfig({
    plugins: [react()],
    resolve: { tsconfigPaths: true },
    test: {
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        env: { NODE_ENV: 'test' },
        pool: 'forks',
        fileParallelism: false,
        projects: [
            {
                extends: true,
                test: {
                    name: 'unit',
                    environment: 'jsdom',
                    include: [
                        'app/**/*.{test,spec}.{ts,tsx}',
                        'tests/unit/**/*.{test,spec}.{ts,tsx}',
                    ],
                    exclude: [
                        '**/*.integration.{test,spec}.{ts,tsx}',
                        'node_modules',
                        'build',
                        'dist',
                        'tests/e2e/**',
                    ],
                },
            },
            {
                extends: true,
                test: {
                    name: 'integration',
                    environment: 'node',
                    include: [
                        'app/**/*.integration.{test,spec}.{ts,tsx}',
                        'tests/integration/**/*.{test,spec}.{ts,tsx}',
                    ],
                    exclude: ['node_modules', 'build', 'dist', 'tests/e2e/**'],
                },
            },
        ],
    },
})
