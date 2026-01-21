import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Invalid/Missing environment variable: 'MONGODB_URI'");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the value
  // is preserved across module reloads caused by HMR.
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;


// import { MongoClient, Db } from "mongodb";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("Please define MONGODB_URI env variable");
// }

// const uri = MONGODB_URI;

// let client: MongoClient;
// let db: Db;

// declare global {
//   // eslint-disable-next-line no-var
//   var _mongoDb: Db | undefined;
// }

// export async function getDb(): Promise<Db> {
//   if (process.env.NODE_ENV === "development") {
//     if (!global._mongoDb) {
//       client = new MongoClient(uri);
//       await client.connect();
//       global._mongoDb = client.db("misun-academy");
//     }
//     return global._mongoDb;
//   }

//   client = new MongoClient(uri);
//   await client.connect();
//   return client.db("misun-academy");
// }

// // For Better Auth, export the database promise
// export default getDb();
