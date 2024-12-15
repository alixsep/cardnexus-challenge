import type { Request, Response } from 'express'
import { CONFIG } from '@/config'
import { log } from '@/utils/logger'

/**
 * Custom application error class extending the built-in Error class.
 *
 * @class
 * @extends Error
 *
 * @property statusCode - The HTTP status code associated with the error.
 * @property status - The status string ('fail' for 4xx errors, 'error' for 5xx errors).
 * @property isOperational - Indicates if the error is operational (true).
 *
 * @param message - The error message.
 * @param statusCode - The HTTP status code.
 */
class AppError extends Error {
  statusCode: number
  status: string
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

// Error handling middleware
/**
 * Middleware to handle errors in the application.
 *
 * @param err - The error object containing details about the error.
 * @param req - The Express request object (unused).
 * @param res - The Express response object used to send the error response.
 *
 * Logs the error and sends an appropriate JSON response with the error details.
 * If the application is running in development mode, the stack trace is included in the response.
 */
export const errorHandler = (err: AppError, _req: Request, res: Response) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  // Log the error
  log.error(`${err.status.toUpperCase()} - ${err.message}`, {
    error: err,
    stack: err.stack,
  })

  // Send response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(CONFIG.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

/**
 * Handles unhandled promise rejections.
 *
 * Logs the unhandled rejection and gracefully shuts down the process.
 */
export const unhandledRejectionHandler = () => {
  process.on(
    'unhandledRejection',
    (reason: Error, promise: Promise<unknown>) => {
      log.error('Unhandled Rejection at:', {
        promise,
        reason: reason.message,
      })

      // Graceful shutdown
      process.exit(1)
    },
  )
}

/**
 * Handles uncaught exceptions.
 *
 * Logs the uncaught exception and gracefully shuts down the process.
 */
export const uncaughtExceptionHandler = () => {
  process.on('uncaughtException', (error: Error) => {
    log.error('Uncaught Exception:', {
      error: error.message,
      stack: error.stack,
    })

    // Graceful shutdown
    process.exit(1)
  })
}
