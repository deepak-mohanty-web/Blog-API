// node modules
import mongoose from 'mongoose';
//custom  modules
import config from '@/config';
import { logger } from '@/lib/winston';
// types
import type { ConnectOptions } from 'mongoose';

const clientOption:ConnectOptions = {
  dbName: "blog-db",
  appName:"Blog API",
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors:true,
  }
}

// establish the connection to the MOngoDB database using Mongoose
export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error("MOngoDB URI is not defined in the configuration.");
  }
  try {
    await mongoose.connect(config.MONGO_URI, clientOption);
    logger.info('connected to the database successfully.',{
      uri: config.MONGO_URI,
      options:clientOption,
    })
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    logger.error('Error connecting to the database.',error)
  }
}

// disconnect form the MongoDB database using Mongoose.
export const disConnectFromDatabase = async ():Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.warn("Disconnect from the database successfully.", {
      uri: config.MONGO_URI,
      options:clientOption
    })
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    logger.error("Error disconnecting form the database.",error)
  }
}


