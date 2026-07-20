import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot-reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached && cached.conn) {
    return cached.conn;
  }

  if (cached && !cached.promise) {
    const opts = {
      bufferCommands: false,
      autoIndex: false, // Disable automatic index building during connection initialization to save latency
      maxPoolSize: 10,  // Keep up to 10 connection sockets pooled
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if connection is lost
      socketTimeoutMS: 45000, // Keep sockets alive for up to 45 seconds of inactivity
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m;
    });
  }

  try {
    if (cached) {
      cached.conn = await cached.promise;
    }
  } catch (e) {
    if (cached) {
      cached.promise = null;
    }
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached?.conn;
}
