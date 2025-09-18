import type { RawRow } from "../types";

/**
 * Parse CSV text into RawRow[].
 * - Accepts columns: city, fuel (or fuel_type), date, rsp
 * - Treats missing numeric fields as 0
 */
export function parseCsvToRows(csvText: string): RawRow[] {
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];

  const header = lines[0].split(",").map(h => h.trim().toLowerCase());
  const idx = {
    city: header.indexOf("city"),
    fuel: header.indexOf("fuel") !== -1 ? header.indexOf("fuel") : header.indexOf("fuel_type"),
    date: header.indexOf("date"),
    rsp: header.indexOf("rsp") !== -1 ? header.indexOf("rsp") : header.indexOf("price"),
  };

  lines.shift(); // remove header
  const rows: RawRow[] = lines.map(line => {
    const cols = line.split(",").map(c => c.trim());
    const city = (idx.city >= 0 ? cols[idx.city] : cols[0]) || "Unknown";
    const fuel = (idx.fuel >= 0 ? cols[idx.fuel] : cols[1]) || "Unknown";
    const date = (idx.date >= 0 ? cols[idx.date] : cols[2]) || "";
    const rawRsp = idx.rsp >= 0 ? cols[idx.rsp] : cols[3];
    const rsp = rawRsp === undefined || rawRsp === "" ? 0 : Number(rawRsp);
    return {
      city,
      fuel,
      date,
      rsp: Number.isFinite(rsp) ? rsp : 0,
    };
  });

  return rows;
}
