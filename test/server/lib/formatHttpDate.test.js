import { describe, expect, test, } from '@jest/globals';
import formatHttpDate from '~/server/lib/formatHttpDate';

describe('[lib] formatHttpDate;', () => {
  test('The formatHttpDate should be able to output the date in http format.', () => {
    expect(formatHttpDate(423423423)).toMatch('Tue, 06 Jan 1970 05:37:03 GMT');
  });
});
