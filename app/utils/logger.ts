import winston from 'winston'

const winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, caller }) => {
            return `${timestamp} [${level.toUpperCase()}] ${caller}: ${message}`
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' }),
    ],
})

const logger = {
    info: (filename: string, message: string) =>
        winstonLogger.info(message, { caller: filename }),
    error: (filename: string, message: string) =>
        winstonLogger.error(message, { caller: filename }),
    debug: (filename: string, message: string) =>
        winstonLogger.debug(message, { caller: filename }),
    warn: (filename: string, message: string) =>
        winstonLogger.warn(message, { caller: filename }),
}

export { logger }
