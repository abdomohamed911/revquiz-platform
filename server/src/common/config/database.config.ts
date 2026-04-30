/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

const dbConnection = {
  connect: async () => {
    try {
      // Support both MONGODB_URI (Atlas/Railway full connection string)
      // and DB_URL + DB_NAME (local development)
      const uri = process.env.MONGODB_URI || process.env.DB_URL || 'mongodb://localhost:27017';
      const dbName = process.env.DB_NAME;

      const options: mongoose.ConnectOptions = {};
      if (dbName && !process.env.MONGODB_URI) {
        options.dbName = dbName;
      }

      const conn = await mongoose.connect(uri, options);
      console.log(`Database Connected: ${conn.connection.host}`);
    } catch (err: any) {
      console.error(`Database Connection Error: ${err.message}`);
      process.exit(1);
    }
  },
  close: async () => {
    try {
      await mongoose.connection.close();
      console.log('Database Disconnected');
    } catch (err: any) {
      console.error(`Database Disconnection Error: ${err.message}`);
    }
  },
};

export default dbConnection;
