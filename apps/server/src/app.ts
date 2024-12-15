import express from 'express'
import type { Express } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { errorHandler } from './middleware/error-handler'
import api from './api/routes'

const app: Express = express()

// Security Middleware
app.use(helmet()) // Adds various HTTP headers for security
app.use(cors()) // Enable CORS for all routes

// Parsing Middleware
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// Routes
app.use('/api', api)

// Root Route
app.get('/', (_req, res) => {
  res.json({ message: 'Server is running' })
})

// 404 Handler for undefined routes
app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

// Global Error Handling Middleware
app.use(errorHandler)

export default app
