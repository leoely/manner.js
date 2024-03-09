import path from 'path';
import { cpSync, } from 'fs';

const packagePath = path.resolve('.', 'packages');
const currentPath = path.resolve('.');

cpSync(
  path.join(packagePath, 'client', 'dist'), path.join(currentPath, 'client'),
  { recursive: true, },
);
cpSync(
  path.join(packagePath, 'server', 'dist'), path.join(currentPath, 'server'),
  { recursive: true, }
);
