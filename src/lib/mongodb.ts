import mongoose from "mongoose";

type MongooseCache = {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
};

declare global {
	var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI env variable inside .env");
}

// Initialize the cache on global object to persist across hot reloads in development
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
	global.mongoose = cached;
}

// Caches the connection to prevent multiple connections during development hot reloads.
async function connectDB(): Promise<typeof mongoose> {
	// Return existing connection if available
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const options = {
			bufferCommands: false,
		};

		cached.promise = mongoose
			.connect(MONGODB_URI!, options)
			.then((mongoose) => {
				return mongoose;
			});
	}

	try {
		cached.conn = await cached.promise;
		console.log("MongoDB connected (～￣▽￣)～");
	} catch (error) {
		cached.promise = null;
		throw error;
	}

	return cached.conn;
}

export default connectDB;
