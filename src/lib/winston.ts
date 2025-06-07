//node modules
import config from "@/config";
import winston from "winston";
// custom modules

const { combine, timestamp, colorize, json, errors, align, printf } = winston.format;

// define the transports array to hold different logging transports
const transports: winston.transport[] = [];

// If the application is not running in production , add a console transport
if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // add colors to log levels
        timestamp({
          format:'YYYY-MM-DD hh:mm:ss A'
        }), // add timestamp to logs
        align(), // align log message
        printf(({timestamp,level,message,...meta }) => {
          const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta)}` : "";
          return `${timestamp} [${level}]: ${message}${metaStr}`
        })
      )
    })
  )
}

// create a logger instance using winston
const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info', // set the default logging level to 'info'
  format: combine(timestamp(), errors({ stack: true }), json()), // use JSON format for log message
  transports,
  silent: config.NODE_ENV === ' test',// disable logging in test mode
});

export {logger}