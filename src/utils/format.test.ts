import {
  formatClock,
  formatPercent,
  formatRating,
  formatTimeLeft,
  metaLine,
  parseDurationToMinutes,
} from '@/utils/format';

describe('format utils', () => {
  test('formatPercent clamps and rounds', () => {
    expect(formatPercent(0.35)).toBe('35%');
    expect(formatPercent(0)).toBe('0%');
    expect(formatPercent(1.5)).toBe('100%');
    expect(formatPercent(-1)).toBe('0%');
  });

  test('formatRating keeps one decimal', () => {
    expect(formatRating(4.7)).toBe('4.7');
    expect(formatRating(5)).toBe('5.0');
  });

  test('metaLine joins only non-empty parts', () => {
    expect(metaLine('Beginner', undefined, '8h 20m')).toBe('Beginner  ·  8h 20m');
    expect(metaLine(null, undefined)).toBe('');
  });

  test('parseDurationToMinutes parses h/m', () => {
    expect(parseDurationToMinutes('8h 20m')).toBe(500);
    expect(parseDurationToMinutes('45m')).toBe(45);
    expect(parseDurationToMinutes('2h')).toBe(120);
  });

  test('formatTimeLeft computes remaining', () => {
    expect(formatTimeLeft('10h 00m', 0)).toBe('10h 0m left');
    expect(formatTimeLeft('10h 00m', 1)).toBe('0m left');
    expect(formatTimeLeft('8h 20m', 0.5)).toBe('4h 10m left');
  });

  test('formatClock formats seconds', () => {
    expect(formatClock(750)).toBe('12:30');
    expect(formatClock(3725)).toBe('1:02:05');
    expect(formatClock(5)).toBe('0:05');
  });
});
