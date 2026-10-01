import mongoose from "mongoose"

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalForMongoose = globalThis as unknown as { _mongoose?: MongooseCache }
const cache: MongooseCache =
  globalForMongoose._mongoose ?? (globalForMongoose._mongoose = { conn: null, promise: null })

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI is not set")
  if (cache.conn) return cache.conn

  cache.promise ??= mongoose.connect(uri, {
    dbName: "viaridezmainbrand",
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  });

  try {
    cache.conn = await cache.promise
  } catch (error) {
    cache.promise = null
    throw error
  }
  return cache.conn
}
