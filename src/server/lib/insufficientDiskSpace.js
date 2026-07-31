import appendToLog from '~/server/lib/appendToLog';

export default function insufficientDiskSpace(logPath, diskSpace) {
  appendToLog(
    logPath,
    ' || ████ ⛔ DISK_SPACE:' + diskSpace + ' ████ & ████ REASON: Insufficient disk space ████ ||\n'
  );
}
