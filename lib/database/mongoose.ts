import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}


// express - connect to db only once
// nextjs - connect db on every request or server action
// because nextjs runs in a serverless environment
// serverless functions are stateless, start up to handle a request and shutdown right after without maintaining a continuous connection to db
// ensures each request is handled independently, allowing for better scalability and relability 
// as there's no need to manage persistent connections across many instances 
// but that means mongodb connections will open for each and every action will perform on the serverside
// to optimize our process, we will cache our connections

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = {
        conn: null,
        promise: null
    }
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');

    cached.promise =
        cached.promise ||
        mongoose.connect(MONGODB_URL, {
            dbName: "imaginify", bufferCommands: false
        });
    cached.conn = await cached.promise;

    return cached.conn;
}