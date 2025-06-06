// node modules
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
// custom modules
import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import { connectToDatabase, disConnectFromDatabase } from '@/lib/mongoose';
import {logger} from '@/lib/winston'
/* routes */
import v1Routes from '@/routes/v1';
// types 
import type { CorsOptions } from 'cors';
const app = express();

// configure cors options 
const corsOptions:CorsOptions = {
  origin(origin, callback) {
    if(config.NODE_ENV === 'development' || !origin ||config.WHITELIST_ORIGINS.includes(origin)){
      callback(null,true)
    } else {
      // reject request from non-whitelisted origins
      callback(new Error(`CORS Error : ${origin} is not allowed by CORS`), false);
      logger.warn(`CORS Error : ${origin} is not allowed by CORS`);
    }
  }
}

// Apply cors middleware
app.use(cors(corsOptions));
// Enable JSON request body parsing 
app.use(express.json());
// Enable URL_encoded requests body parsing 
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());

// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, // Only compress responses larger then 1kb
  })
)

// Use helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhanced security
app.use(limiter);

(async () => {
  try {
    await connectToDatabase();
    app.use('/api/v1', v1Routes)
    app.listen(config.PORT, () => {
      logger.info(`Server running: http://localhost:${config.PORT}`);
    })
  } catch (error) {
    logger.error('Failed to start the server.');
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

/**
 * Handles server shutdown gracefully by disconnecting from the database.
 *
 * - Attempts to disconnect from the database before shutting down the server.
 * - Logs a success message if the disconnection is successful.
 * - If an error occurs during disconnection , it is logged to the console.
 * - Exits the process with the status code `0` (indicating a successful shutdown).
*/ 

const handleServerShutDown = async () => {
  try {
    await disConnectFromDatabase();
    logger.warn("Server SHUTDOWN");
    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown.',error)
  }
}

/**
 * Listens for termination signals (`SIGTERM` and `SIGINT`)
 * 
 * - `SIGTERM` is typically sent when stopping a process (e.g. `kill` command or container shutdown).
 * - `SIGINT` is trigger when user interrupts the process (e.g. pressing `Ctrl + c`).
 * - when either signal is received, `handleServerShutdown` is executed to ensure cleanup.
 */
process.on('SIGTERM', handleServerShutDown);
process.on('SIGINT', handleServerShutDown);
