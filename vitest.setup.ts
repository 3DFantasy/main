import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('ioredis', () => {
    class FakeRedis {
        async smembers() {
            return []
        }
        async get() {
            return null
        }
        async del() {
            return 0
        }
        async srem() {
            return 0
        }
        async quit() {
            return 'OK'
        }
        on() {
            return this
        }
    }
    return { default: FakeRedis, Redis: FakeRedis }
})

vi.mock('node-resque', () => {
    class FakeQueue {
        async connect() {}
        async end() {}
        async enqueue() {}
        on() {
            return this
        }
    }
    class FakeWorker {
        options = { queues: [] }
        async connect() {}
        async start() {}
        async end() {}
        on() {
            return this
        }
    }
    class FakeScheduler {
        async connect() {}
        async start() {}
        async end() {}
        on() {
            return this
        }
    }
    return { Queue: FakeQueue, Worker: FakeWorker, Scheduler: FakeScheduler }
})

vi.mock('puppeteer', () => ({
    default: {
        launch: vi.fn(async () => ({
            newPage: vi.fn(async () => ({
                goto: vi.fn(),
                content: vi.fn(async () => ''),
                close: vi.fn(),
            })),
            close: vi.fn(),
        })),
    },
}))

vi.mock('@microsoft/microsoft-graph-client', () => ({
    Client: {
        init: vi.fn(() => ({
            api: vi.fn(() => ({ post: vi.fn(async () => ({})) })),
        })),
    },
}))

vi.mock('@azure/identity', () => ({
    ClientSecretCredential: class {
        async getToken() {
            return { token: 'fake-token', expiresOnTimestamp: Date.now() + 3600_000 }
        }
    },
}))
