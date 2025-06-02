import { describe, expect, test, } from '@jest/globals';
import formatHttpKey from '~/server/lib/formatHttpKey';

describe('[lib] formatHttpKey;', () => {
  test('The formateHttpKey should be able to output the format of http key.', () => {
    expect(formatHttpKey('last-modified')).toMatch('Last-Modified');
  });
});
