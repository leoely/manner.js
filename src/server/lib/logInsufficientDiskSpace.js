import appendToLog from '~/server/lib/appendToLog';

export default function logInsufficientDiskSpace(logPath, available) {
  appendToLog(
    logPath,
    ' || ████ ⛔ Available:' + available + ' ████ & ████ REASON: Insufficient disk space ████ ||\n'
  );
}
