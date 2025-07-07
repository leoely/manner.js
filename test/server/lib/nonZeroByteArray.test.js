import { describe, expect, test, } from '@jest/globals';
import * as nonZeroByteArray from '~/server/lib/nonZeroByteArray';

describe('[lib] nonZeroByteArray;', () => {
  test('The output of the function nonZeroByteArray should be correct.', () => {
    const buf = nonZeroByteArray.fromInt(534535345n);
    expect(String(nonZeroByteArray.toInt(buf))).toBe('534535345');
  });
});
