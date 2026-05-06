import react from '@vitejs/plugin-react'
import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

loadEnv({ path: '.env.test' })

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        globals: true,
        environment: 'node',
        environmentMatchGlobs: [
            ['app/**/*.{test,spec}.{ts,tsx}', 'jsdom'],
            ['app/**/*.integration.{test,spec}.{ts,tsx}', 'node'],
        ],
        setupFiles: ['./vitest.setup.ts'],
        env: { NODE_ENV: 'test' },
        include: [
            'app/**/*.{test,spec}.{ts,tsx}',
            'tests/unit/**/*.{test,spec}.{ts,tsx}',
            'tests/integration/**/*.{test,spec}.{ts,tsx}',
        ],
        exclude: ['node_modules', 'build', 'dist', 'tests/e2e/**'],
        pool: 'forks',
        poolOptions: { forks: { singleFork: true } },
    },
})
