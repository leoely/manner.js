import fs from 'fs';
import path from 'path';
import getDateString from '~/server/lib/getDateString';

export default function addToLog(logPath, content) {
  if (typeof logPath !== 'string') {
    throw new Error('[Error] Parameter logPath should be of string type.');
  }
  if (typeof content !== 'string') {
    throw new Error('[Error] Parameter content should be of string type.');
  }
  const dateString = getDateString();
  fs.appendFileSync(path.join(logPath, dateString), content);
}
