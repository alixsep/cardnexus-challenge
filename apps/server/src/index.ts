import app from './app'
import { CONFIG } from './config'
import { log } from './utils/logger'
import {
  unhandledRejectionHandler,
  uncaughtExceptionHandler,
} from './middleware/error-handler'
import { connectMongoDB, disconnectMongoDB } from './db/connection'

// Setup global error handlers
uncaughtExceptionHandler()
unhandledRejectionHandler()

// Immediately connect to MongoDB before starting the server
connectMongoDB()
  .then(() => {
    // Start the server only after a successful DB connection
    const server = app.listen(CONFIG.PORT, () => {
      log.info(
        `Server running in ${CONFIG.NODE_ENV} mode on port ${CONFIG.PORT}`,
      )
    })

    /**
     * Handles graceful shutdown of the server.
     *
     * Logs the receipt of a kill signal and initiates the shutdown process.
     * Closes remaining server connections and the MongoDB connection.
     */
    const gracefulShutdown = () => {
      log.info('Received kill signal, shutting down gracefully')

      // Close Express server
      server.close(async () => {
        log.info('Closed out remaining connections')

        // Disconnect Mongo
        await disconnectMongoDB()

        process.exit(0)
      })

      // If connections don't close in 10 seconds, forcefully shut down
      setTimeout(() => {
        log.error(
          'Could not close connections in time, forcefully shutting down',
        )
        process.exit(1)
      }, 10000)
    }

    // Listen for termination signals
    process.on('SIGTERM', gracefulShutdown)
    process.on('SIGINT', gracefulShutdown)
  })
  .catch(error => {
    // If DB connection fails, log and exit
    log.error('Unable to start server due to DB connection error:', error)
    process.exit(1)
  })
