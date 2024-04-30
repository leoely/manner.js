import { describe, expect, test, } from '@jest/globals';
import http from 'http';
import fetch from 'node-fetch';
import { CommonHttp, }from '~/server';

beforeAll(() => {
  http.createServer(async (req, res) => {
    const commonHttp = new CommonHttp({
      title: 'Test',
      content: 'Test',
      fonts: ['ttf'],
      develope: true,
    });
    await commonHttp.process(req, res);
  }).listen(80);
});

test('[class] CommonHttp', async () => {
  const response = await fetch('http://localhost');
  const body = await response.text();
  expect(JSON.stringify(body)).toMatch('\"<!doctype html><html lang=\\\"en\\\"><head><meta charset=\\\"utf-8\\\"><title>Test</title><meta name=\\\"description\\\" content=\\\"Test\\\"><meta name=\\\"viewport\\\" content=\\\"width=device-width,initial-scale=1\\\"><link rel=\\\"shortcut icon\\\" href=\\\"http://www.example.com/my_empty_resource\\\"></head><body><main id=\\\"root\\\"></main><script src=\\\"main.bundle.js\\\"></script></body></html>\"');
});
