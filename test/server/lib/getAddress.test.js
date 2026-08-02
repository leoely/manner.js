import { describe, expect, test, } from '@jest/globals';
import getAddress from '~/server/lib/getAddress';

describe('[lib] getAddress;', () => {
  test('The output of the function getAddress should be correct.', () => {
    expect(getAddress('192.168.2.5', 80)).toMatch('192.168.2.5:80');
    expect(getAddress('2001:db8:85a3:8d3:1319:8a2e:370:7348', 80)).toMatch('[2001:db8:85a3:8d3:1319:8a2e:370:7348]:80');
  });
});
