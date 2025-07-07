import http from 'http';
import { describe, expect, test, } from '@jest/globals';
import errorHandle from '~/server/lib/errorHandle';

let server1;
let server2;

beforeAll(() => {
  server1 = http.createServer(errorHandle(async (req, res) => {
    throw new Error('[Error] There are some errors in the request listener.');
  }));
  server1.listen(8005);
  server2 = http.createServer(errorHandle(async (req, res) => {
    res.end(JSON.stringify({ status: 'ok', }));
  }));
  server2.listen(8006);
});

async function getServerClosePromise(server) {
  return new Promise((resolve, reject) => {
    server.close(() => {
      resolve();
    });
  });
}

afterAll(async () => {
  await getServerClosePromise(server1);
  await getServerClosePromise(server2);
});

describe('[lib] errorHandle;', () => {
  test('Error handling should automatically handle errors.', async () => {
    const response1 = await fetch('http://localhost:8005');
    expect(response1.status).toBe(500);
    const response2 = await fetch('http://localhost:8006');
    const result = await response2.json();
    expect(JSON.stringify(result)).toBe('{\"status\":\"ok\"}');
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  });
});
