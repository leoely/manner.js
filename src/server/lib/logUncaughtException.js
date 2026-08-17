import appendToLog from '~/server/lib/appendToLog';

export default function logUncaughtException(logPath, error) {
  appendToLog(
    logPath,
    ' || ████ ⛔ ERROR:' + error.name + ' ████ & ████ MESSAGE: ' + error.message + ' ████ ||\n'
  );
  addToLog(logPath, error.stack);
}
