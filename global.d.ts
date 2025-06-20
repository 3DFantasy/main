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
			LEAGUE_YEAR: string
			TEAM_1_TITLE: string
			TEAM_2_TITLE: string
			TEAM_3_TITLE: string
			TEAM_4_TITLE: string
			TEAM_5_TITLE: string
			TEAM_6_TITLE: string
			TEAM_7_TITLE: string
			TEAM_8_TITLE: string
			TEAM_9_TITLE: string
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
			MICROSOFT_GRAPH_ENDPOINT: string
			MICROSOFT_APP_CLIENT_ID: string
			MICROSOFT_APP_OBJ_ID: string
			MICROSOFT_APP_TENANT_ID: string
			MICROSOFT_CLIENT_SECRET: string
			MICROSOFT_CLIENT_SECRET_ID: string
			MICROSOFT_3DFANTASY_FROM_EMAIL: string
		}
	}
}

export {}
