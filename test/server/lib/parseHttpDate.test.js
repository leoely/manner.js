import { describe, expect, test, } from '@jest/globals';
import parseHttpDate from '~/server/lib/parseHttpDate';

describe('[lib] parseHttpDate;', () => {
  test('The parseHttpDate should be able to output the format of http key.', () => {
    expect(parseHttpDate('Wed, 04 Jun 2025 15:12:05 GMT').toString()).toMatch('Wed Jun 04 2025 15:12:05 GMT+0800 (GMT+08:00)');
  });
});
