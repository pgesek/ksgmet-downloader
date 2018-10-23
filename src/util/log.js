const settings = require('./settings.js');
const winston = require('winston');
const { combine, timestamp, simple, printf } = winston.format;

const customFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  });

const logger = winston.createLogger({
    level: settings.LOG_LEVEL,
    format: combine(simple(), timestamp(), customFormat),
    transports: [ new winston.transports.Console() ]
});

module.exports = logger;
