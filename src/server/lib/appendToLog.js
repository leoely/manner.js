import fs from 'fs';
import path from 'path';
import getDateString from '~/server/lib/getDateString';
import getGTMNowString from '~/server/lib/getGTMNowString';

export default function appendToLog(logPath, content) {
  const dateString = getDateString();
  fs.appendFileSync(
    path.join(logPath, dateString), getGTMNowString() + content
  );
}
