import appendToLog from '~/server/lib/appendToLog';

export default function logOutOfMemory(logPath, freemem) {
  appendToLog(
    logPath,
    ' || ████ ❗❗❗❗FREEMEN:' + freemem + ' ████ & ████ REASON: Out fo memory ████ ||\n'
  );
}
