import fs from 'fs';

export default function checkLogPath(logPath) {
  if (typeof logPath !== 'string') {
    throw new Error('[Error] Parameter logPath should be of string type.');
  }
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true });
  }
}

