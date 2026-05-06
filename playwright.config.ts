import { defineConfig, devices } from '@playwright/test'
import { config as loadEnv } from 'dotenv'

const testEnv = loadEnv({ path: '.env.test' }).parsed ?? {}

// Force test isolation: don't let the spawned server read the project's .env.
// Every var the server needs must come from .env.test.
const PORT = Number(testEnv.PORT ?? 3000)
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: process.env.CI ? [['html'], ['github']] : 'html',
    timeout: 30_000,
    expect: { timeout: 5_000 },
    use: {
        baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'npm run build && npm start',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stdout: 'pipe',
        stderr: 'pipe',
        env: {
            ...testEnv,
            PORT: String(PORT),
            NODE_ENV: 'production',
            DISABLE_RESQUE: 'true',
        },
    },
})
