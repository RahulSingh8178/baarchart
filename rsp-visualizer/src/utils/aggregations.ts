import type { RawRow } from "../types";

/**
 * Given raw rows, compute all unique cities, fuels and years.
 */
export function getUniqueFields(rows: RawRow[]) {
  const cities = new Set<string>();
  const fuels = new Set<string>();
  const years = new Set<number>();

  rows.forEach(r => {
    cities.add(r.city);
    fuels.add(r.fuel);
    const y = extractYear(r.date);
    if (y) years.add(y);
  });

  return {
    cities: Array.from(cities).sort(),
    fuels: Array.from(fuels).sort(),
    years: Array.from(years).sort((a, b) => a - b),
  };
}

export function extractYear(dateStr: string): number | null {
  if (!dateStr) return null;
  const match = dateStr.match(/^(\d{4})/);
  return match ? Number(match[1]) : null;
}

/**
 * Compute monthly average RSP for a given city, fuel, year.
 * Returns an array of 12 numbers (Jan to Dec).
 */
export function computeMonthlyAverage(
  rows: RawRow[],
  city: string,
  fuel: string,
  year: number
) {
  const monthsSum = new Array<number>(12).fill(0);
  const monthsCount = new Array<number>(12).fill(0);

  rows.forEach(r => {
    if (r.city !== city) return;
    if (r.fuel !== fuel) return;
    const y = extractYear(r.date);
    if (y !== year) return;
    const dt = new Date(r.date);
    if (isNaN(dt.getTime())) return;
    const m = dt.getMonth(); // 0..11
    monthsSum[m] += r.rsp;
    monthsCount[m] += 1;
  });

  // average (if count == 0, returns 0)
  return monthsSum.map((s, i) =>
    monthsCount[i] === 0 ? 0 : +(s / monthsCount[i]).toFixed(2)
  );
}
