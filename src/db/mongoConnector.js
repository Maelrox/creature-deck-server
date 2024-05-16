import { MongoClient } from "mongodb";

//const url = "mongodb://host.docker.internal:27017"; // MongoDB URL using host docker
const url = "mongodb://172.23.0.1:27017"; // MongoDB URL using docker host ip

const dbName = "creaturedeck"; // Database name

const client = new MongoClient(url, {
  maxPoolSize: 10, // Set the pool size to 10 connections
});

let dbInstance = null;

async function connectToDatabase() {
  if (!dbInstance) {
    try {
      await client.connect(); // This initializes the pool
      dbInstance = client.db(dbName); // Get the database instance
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
    }
  }
  return dbInstance;
}

async function closeDatabaseConnection() {
  // Check if the client is initialized and if the underlying topology is connected
  if (client) {
    await client.close();
  } else {
    console.log("No active connection to close.");
  }
}

export default { connectToDatabase, closeDatabaseConnection };
