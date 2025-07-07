import { describe, expect, test, } from '@jest/globals';
import wrapIpv6 from '~/server/lib/wrapIpv6';

describe('[lib] wrapIpv6;', () => {
  test('The output of the function isIpv6Address should be correct.', () => {
    expect(wrapIpv6('2408:826c:118:3908:80d:728:2c50:d540')).toMatch('[2408:826c:118:3908:80d:728:2c50:d540]');
  });
});
