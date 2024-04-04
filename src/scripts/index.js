import fs from 'fs';
import path from 'path';

const currentPath = path.resolve('.');
const distPath = path.join(currentPath, 'dist');

fs.cpSync(
  path.join(distPath, 'client'),
  path.join(currentPath, 'client'),
  { recursive: true, }
);
fs.cpSync(
  path.join(distPath, 'server'),
  path.join(currentPath, 'server'),
  { recursive: true, }
);
