import { describe, expect, test, } from '@jest/globals';
import http from 'http';
import fetch from 'node-fetch';
import CommonHttp from '~/server/class/CommonHttp';

beforeAll(() => {
  http.createServer(async (req, res) => {
    const commonHttp = new CommonHttp({});
    await commonHttp.process(req, res);
    res.end('result')
  }).listen(80);
});

test('[class] CommonHttp', async () => {
  const response = await fetch('http://localhost');
  const body = await response.text();
  expect(JSON.stringify(body)).toMatch('\"result\"');
});
