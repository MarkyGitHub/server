//Logger declarations
import  { format, createLogger, transports } from "winston";
import  { combine, timestamp, label, printf, prettyPrint } from format;
const CATEGORY = "VertriebsApp format";

const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: CATEGORY }),
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    prettyPrint()
  ),
  transports: [
    new transports.File({
      filename: './error.log',
      level: 'error',
    }),
    new transports.File({
      filename: './combined.log',
      level: 'verbose',
    }),
    new transports.Console(),
  ],
});

if (process.env.NODE_ENV !== 'production') {  
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

module.export = logger;
