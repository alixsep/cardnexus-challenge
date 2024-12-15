import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

/**
 * Configuration object for the server application.
 *
 * @constant
 * @property PORT - The port on which the server will listen. Defaults to 3000 if not specified in the environment variables.
 * @property NODE_ENV - The environment in which the server is running. Defaults to 'development' if not specified in the environment variables.
 * @property LOG_LEVEL - The level of logging to be used by the server. Defaults to 'info' if not specified in the environment variables.
 */
export const CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
}
