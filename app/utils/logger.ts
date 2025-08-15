import winston from 'winston'

const getCaller = (): string => {
	try {
		const stack = new Error().stack
		if (!stack) return 'unknown'

		const lines = stack.split('\n')
		// Skip: Error line, getCaller, and the logger method
		for (let i = 3; i < lines.length; i++) {
			const line = lines[i]
			// Look for file patterns, skip node_modules
			if (line && !line.includes('node_modules') && !line.includes('logger.ts')) {
				// Extract filename from various patterns
				const match =
					line.match(/\/([^\/]+\.(ts|tsx|js|jsx))/) || line.match(/([^\/\s]+\.(ts|tsx|js|jsx))/)
				if (match) {
					return match[1]
				}
			}
		}
	} catch (e) {
		// Fallback
	}
	return 'unknown'
}

const winstonLogger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ timestamp, level, message, caller }) => {
			return `${timestamp} [${level.toUpperCase()}] ${caller}: ${message}`
		})
	),
	transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'app.log' })],
})

const logger = {
	info: (message: string) => winstonLogger.info(message, { caller: getCaller() }),
	error: (message: string) => winstonLogger.error(message, { caller: getCaller() }),
	debug: (message: string) => winstonLogger.debug(message, { caller: getCaller() }),
	warn: (message: string) => winstonLogger.warn(message, { caller: getCaller() }),
}

export { logger }
