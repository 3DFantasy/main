// Declare global environment variables
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			APP_SECRET: string
			PORT: string
			NODE_ENV: 'development' | 'production' | 'test'
			REDIS_HOST: string
			REDIS_PASSWORD: string
			REDIS_PORT: string
			REDIS_USERNAME: string
			REDIS_QUEUE: string
			DATABASE_URL: string
			TEAM_1_URL: string
			TEAM_2_URL: string
			TEAM_3_URL: string
			TEAM_4_URL: string
			TEAM_5_URL: string
			TEAM_6_URL: string
			TEAM_7_URL: string
			TEAM_8_URL: string
			TEAM_9_URL: string
			PXP_API_URL: string
		}
	}
}

export {}
