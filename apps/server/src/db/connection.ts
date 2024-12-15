import mongoose from 'mongoose'
import { log } from '@/utils/logger'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/carddb'

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      retryWrites: true,
      w: 'majority',
    })
    log.info('MongoDB connected successfully')
  } catch (error) {
    log.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export const disconnectMongoDB = async () => {
  try {
    await mongoose.connection.close()
    log.info('MongoDB disconnected')
  } catch (error) {
    log.error('Error disconnecting from MongoDB:', error)
  }
}
