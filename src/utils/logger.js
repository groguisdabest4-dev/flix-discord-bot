/**
 * Log levels for Flix
 */
const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

function getLogColor(level) {
  const colors = {
    DEBUG: '\x1b[36m',
    INFO: '\x1b[32m',
    WARN: '\x1b[33m',
    ERROR: '\x1b[31m'
  };
  return colors[level] || '\x1b[0m';
}

function formatLogMessage(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const color = getLogColor(level);
  const reset = '\x1b[0m';
  const padding = level.padEnd(5);

  let output = `${color}[${timestamp}] [${padding}]${reset} ${message}`;

  if (data) {
    output += `\n${JSON.stringify(data, null, 2)}`;
  }

  return output;
}

function log(level, message, data = null) {
  const output = formatLogMessage(level, message, data);
  console.log(output);
}

function debug(message, data = null) {
  log(LogLevel.DEBUG, message, data);
}

function info(message, data = null) {
  log(LogLevel.INFO, message, data);
}

function warn(message, data = null) {
  log(LogLevel.WARN, message, data);
}

function error(message, errorData = null) {
  if (errorData instanceof Error) {
    log(LogLevel.ERROR, message, {
      message: errorData.message,
      stack: errorData.stack
    });
  } else {
    log(LogLevel.ERROR, message, errorData);
  }
}

module.exports = {
  LogLevel,
  log,
  debug,
  info,
  warn,
  error
};
