//Logger declarations
const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint } = format;
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
      filename: './log/error.log',
      level: 'error',
    }),
    new transports.File({
      filename: './log/combined.log',
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
