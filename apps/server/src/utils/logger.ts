/**
 * A simple logger class to handle logging messages with different log levels.
 *
 * Inspired by ts-node-dev
 * @see https://github.com/wclr/ts-node-dev/blob/master/src/logger.ts
 */

import path from 'path'

// Define the possible log levels as an enum for better type safety.
enum LogLevel {
  Info = 'INFO',
  Error = 'ERROR',
  Warn = 'WARN',
  Debug = 'DEBUG',
}

// Define a mapping of log levels to their respective ANSI color codes.
const colors: Record<LogLevel, string> = {
  [LogLevel.Info]: '\x1b[36m', // Cyan for info messages.
  [LogLevel.Error]: '\x1b[31m', // Red for error messages.
  [LogLevel.Warn]: '\x1b[33m', // Yellow for warning messages.
  [LogLevel.Debug]: '\x1b[90m', // Gray for debug messages.
}

// ANSI reset code to reset the color after each log message.
const resetColor = '\x1b[0m'

// Logger class to handle log message formatting and output.
class Logger {
  /**
   * Logs a message to the console with a specific log level.
   * Accepts multiple arguments and formats them appropriately.
   * @param level - The severity level of the log message.
   * @param args - The content of the log message, can be strings, objects, etc.
   */
  log(level: LogLevel, ...args: unknown[]) {
    // Determine the caller file by inspecting the call stack.
    const callerFile = this.getCallerFile()

    // Get the relative path to make the output more readable.
    const relativePath = path.relative(process.cwd(), callerFile)

    // Apply the appropriate color to the log level for console output.
    const coloredLevel = `${colors[level]}${level}${resetColor}`

    // Format the message to include the relative file path.
    console.log(`[${coloredLevel}][${relativePath}]`, ...args)
  }

  /**
   * Logs an informational message.
   * @param args - The content of the informational log message.
   */
  info(...args: unknown[]) {
    this.log(LogLevel.Info, ...args)
  }

  /**
   * Logs an error message.
   * @param args - The content of the error log message.
   */
  error(...args: unknown[]) {
    this.log(LogLevel.Error, ...args)
  }

  /**
   * Logs a warning message.
   * @param args - The content of the warning log message.
   */
  warn(...args: unknown[]) {
    this.log(LogLevel.Warn, ...args)
  }

  /**
   * Logs a debug message, typically used for development and troubleshooting.
   * @param args - The content of the debug log message.
   */
  debug(...args: unknown[]) {
    this.log(LogLevel.Debug, ...args)
  }

  /**
   * Inspects the call stack to find the file that called the log method.
   */
  private getCallerFile(): string {
    const originalFunc = Error.prepareStackTrace

    let callerFile: string = ''

    try {
      const err = new Error()
      let currentFile: string = ''

      Error.prepareStackTrace = function (_, stack) {
        return stack
      }

      const stack = err.stack as unknown as NodeJS.CallSite[]

      // Find the first stack frame that isn't part of the logger.
      for (let i = 0; i < stack.length; i++) {
        currentFile = stack[i].getFileName() || ''

        if (currentFile !== __filename) {
          callerFile = currentFile
          break
        }
      }
    } catch (e) {
      this.error(e)
      // In case of an error, fallback to an empty string.
    } finally {
      Error.prepareStackTrace = originalFunc
    }

    return callerFile
  }
}

/**
 * Export a singleton instance of the Logger class for use throughout the application.
 *
 * @example
 * log.info("This is an informational message");
 * log.error("This is an error message");
 * log.warn("This is a warning message");
 * log.debug("This is a debug message");
 */
export const log = new Logger()
