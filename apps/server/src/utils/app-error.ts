/**
 * Custom application error class extending the built-in Error class.
 * Provides additional properties and methods for handling HTTP errors.
 *
 * @class AppError
 * @extends {Error}
 *
 * @example
 * throw new AppError('Invalid email', 400)
 * throw AppError.badRequest('Invalid email')
 */
class AppError extends Error {
  /**
   * HTTP status code of the error.
   */
  statusCode: number

  /**
   * Status string derived from the status code, either 'fail' or 'error'.
   */
  status: string

  /**
   * Flag indicating whether the error is operational (true) or a programming error (false).
   */
  isOperational: boolean

  /**
   * Creates an instance of AppError.
   *
   * @param message - The error message.
   * @param statusCode - The HTTP status code. Defaults to 500.
   * @param isOperational - Flag indicating if the error is operational. Defaults to true.
   */
  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    // Call parent constructor
    super(message)

    // Set the name of the error
    this.name = this.constructor.name

    // Determine status based on status code
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'

    // Set status code
    this.statusCode = statusCode

    // Flag to distinguish between operational and programming errors
    this.isOperational = isOperational

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor)
  }

  /**
   * Serializes the error object for API responses.
   */
  toJSON() {
    return {
      status: this.status,
      message: this.message,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
    }
  }

  /**
   * Creates an `AppError` representing an HTTP 400 (Bad Request) error.
   *
   * @param message - Optional error message. Defaults to "Bad Request".
   * @returns A new `AppError` instance with status code 400.
   */
  static badRequest(message: string = 'Bad Request') {
    return new AppError(message, 400)
  }

  /**
   * Creates an `AppError` representing an HTTP 401 (Unauthorized) error.
   *
   * @param message - Optional error message. Defaults to "Unauthorized".
   * @returns A new `AppError` instance with status code 401.
   */
  static unauthorized(message: string = 'Unauthorized') {
    return new AppError(message, 401)
  }

  /**
   * Creates an `AppError` representing an HTTP 403 (Forbidden) error.
   *
   * @param message - Optional error message. Defaults to "Forbidden".
   * @returns A new `AppError` instance with status code 403.
   */
  static forbidden(message: string = 'Forbidden') {
    return new AppError(message, 403)
  }

  /**
   * Creates an `AppError` representing an HTTP 404 (Not Found) error.
   *
   * @param message - Optional error message. Defaults to "Not Found".
   * @returns A new `AppError` instance with status code 404.
   */
  static notFound(message: string = 'Not Found') {
    return new AppError(message, 404)
  }

  /**
   * Creates an `AppError` representing an HTTP 500 (Internal Server Error) error.
   *
   * @param message - Optional error message. Defaults to "Internal Server Error".
   * @returns A new `AppError` instance with status code 500 and `isOperational` set to `false`.
   */
  static internalServerError(message: string = 'Internal Server Error') {
    return new AppError(message, 500, false)
  }
}

export default AppError
