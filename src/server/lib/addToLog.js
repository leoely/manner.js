import fs from 'fs';
import path from 'path';
import getDateString from '~/server/lib/getDateString';

export default function addToLog(logPath, content) {
  const dateString = getDateString();
  fs.appendFileSync(path.join(logPath, dateString), content);
}
