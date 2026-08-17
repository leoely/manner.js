import appendToLog from '~/server/lib/appendToLog';
import addToLog from '~/server/lib/addToLog';

export default function logUncaughtException(logPath, error) {
  appendToLog(
    logPath,
    ' || ████ ⛔ ERROR:' + error.name + ' ████ & ████ MESSAGE: ' + error.message + ' ████ ||\n'
  );
  addToLog(logPath, error.stack);
}
