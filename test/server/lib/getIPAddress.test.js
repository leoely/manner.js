import { describe, expect, test, } from '@jest/globals';
import getIPAddress from '~/server/lib/getIPAddress';

describe('[lib] getIPAddress;', () => {
  test('The output of the function getIPAddress should be correct.', () => {
    expect(getIPAddress('192.168.2.5', 80)).toMatch('192.168.2.5:80');
    expect(getIPAddress('2001:db8:85a3:8d3:1319:8a2e:370:7348', 80)).toMatch('[2001:db8:85a3:8d3:1319:8a2e:370:7348]:80');
  });
});
