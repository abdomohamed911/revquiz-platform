import mongoose from "mongoose";

beforeAll(async () => {
  // Only connect to MongoDB for integration tests
  if (process.env.TEST_TYPE !== "integration") return;

  const mongoUri = process.env.DB_URL || "mongodb://localhost:27017";
  const dbName = process.env.DB_NAME || "revquiz-test";

  try {
    await mongoose.connect(mongoUri, { dbName });
    console.log(`Test DB connected: ${dbName}`);
  } catch (err) {
    console.error("Test DB connection failed, skipping DB-dependent tests:", (err as Error).message);
  }
});

afterAll(async () => {
  if (process.env.TEST_TYPE !== "integration") return;

  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch {
    // DB not connected, nothing to clean up
  }
});
