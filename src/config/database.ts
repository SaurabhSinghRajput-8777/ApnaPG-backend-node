import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/apnapg';

export const connectDB = async () => {
    // Check if we have a connection and if it's already ready
    if (mongoose.connection.readyState >= 1) {
        console.log('✅ Reusing existing MongoDB connection...');
        return;
    }

    try {
        console.log('⏳ Establishing new MongoDB connection...');
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Faster timeout for serverless
            connectTimeoutMS: 10000,
        });
        console.log('🚀 MongoDB Connected successfully!');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        // Important: In serverless, we don't always want to exit(1) 
        // as it might crash the whole host function.
        // We'll let the error propagate.
        throw err;
    }
};
