import { copyFileSync, } from 'fs';
import path from 'path';

const currentPath = path.resolve('.');
const distPath = path.join(currentPath, 'dist');

copyFileSync(path.join(distPath, 'client', 'index.js'), path.join(currentPath, 'client.js'));
copyFileSync(path.join(distPath, 'server', 'index.js'), path.join(currentPath, 'server.js'));
