import http from 'http';
import { describe, expect, test, } from '@jest/globals';
import MultiFetch from '~/server/class/MultiFetch';

let server1;
let server2;
let server3;
let server4;

beforeAll(() => {
  const startUpTime = new Date().getTime();
  function dealHttp(req, res) {
    if (req.url === '/update/message') {
      res.end(JSON.stringify({ startUpTime, }));
    }
  }
  server1 = http.createServer(dealHttp).listen(8001);
  server2 = http.createServer(dealHttp).listen(8002);
  server3 = http.createServer(dealHttp).listen(8003);
  server4 = http.createServer(dealHttp).listen(8004);
});

function getServerClosePromise(server) {
  return new Promise((resolve, reject) => {
    server.close(() => {
      resolve();
    });
  });
}

afterAll(async () => {
  await getServerClosePromise(server1);
  await getServerClosePromise(server2);
  await getServerClosePromise(server3);
  await getServerClosePromise(server4);
});

describe('[class] MultiFetch;', () => {
  test('MultiFetch should be able to complete load balancing.', async () => {
    const multiFetch = new MultiFetch([
      'http://localhost:8001',
      'http://localhost:8002',
      'http://localhost:8003',
      'http://localhost:8004',
    ]);
    for (let i = 0; i < 20; i += 1) {
      multiFetch.fetch('/update/message', {
        method: 'POST',
      }).then(async (response) => {
        const message = await response.json();
        const time = new Date().getTime();
        expect(message.startUpTime).toBeLessThan(time);
      });
    }
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  });
});
