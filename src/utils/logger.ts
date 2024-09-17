import dotenv from 'dotenv';
import log4js from 'log4js';

dotenv.config();

const logger = log4js.getLogger();
const logLevel = process.env.LOG_LEVEL || 'debug';
logger.level = logLevel;

export default logger;