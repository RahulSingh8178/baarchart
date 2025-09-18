// top of src/App.tsx
import { useEffect, useMemo, useState } from "react";
import type { RawRow } from "./types";            // <- use `import type`
import { Container, Select, Loader, Text, Paper } from "@mantine/core";
import { parseCsvToRows } from "./utils/parser";
import { getUniqueFields, computeMonthlyAverage } from "./utils/aggregations";
import RspChart from "./components/RspChart";


export default function App() {
  const [rows, setRows] = useState<RawRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState<string | null>(null);
  const [fuel, setFuel] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const fetchCsv = async () => {
      try {
        const res = await fetch("/data.csv");
        const txt = await res.text();
        const parsed = parseCsvToRows(txt);
        setRows(parsed);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load CSV:", err);
        setRows([]);
        setLoading(false);
      }
    };
    fetchCsv();
  }, []);

  const { cities, fuels, years } = useMemo(() => {
    if (!rows) return { cities: [], fuels: [], years: [] };
    return getUniqueFields(rows);
  }, [rows]);

  // initialize selects when data arrives
  useEffect(() => {
    if (!rows) return;
    if (!city && cities.length) setCity(cities[0]);
    if (!fuel && fuels.length) setFuel(fuels[0]);
    if (!year && years.length) setYear(years[years.length - 1]); // pick latest year by default
  }, [rows, cities, fuels, years]);

  const monthlyValues = useMemo(() => {
    if (!rows || !city || !fuel || !year) return new Array(12).fill(0);
    return computeMonthlyAverage(rows, city, fuel, year);
  }, [rows, city, fuel, year]);

  if (loading) return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
      <Loader />
    </div>
  );

  if (!rows || rows.length === 0) return (
    <Container style={{ paddingTop: 40 }}>
      <Text color="red">No dataset found. Please place your CSV as <code>/public/data.csv</code> and restart the dev server.</Text>
    </Container>
  );

  return (
    <Container className="app-shell">
      <Text size="xl" weight={700} mb={12}>Retail Selling Price (RSP) — Monthly Average</Text>
      <div className="controls">
        <Select
          value={city}
          onChange={(v) => setCity(v)}
          data={cities}
          placeholder="Select city"
          label="Metro City"
          searchable
          style={{ minWidth: 220 }}
        />
        <Select
          value={fuel}
          onChange={(v) => setFuel(v)}
          data={fuels}
          placeholder="Select fuel"
          label="Fuel Type"
          searchable
          style={{ minWidth: 180 }}
        />
        <Select
          value={year ? String(year) : null}
          onChange={(v) => setYear(v ? Number(v) : null)}
          data={years.map(y => String(y))}
          placeholder="Select year"
          label="Year"
          style={{ minWidth: 120 }}
        />
      </div>

      <Paper className="chart-card" shadow="xs">
        <RspChart monthlyValues={monthlyValues} title={`${city || ""} — ${fuel || ""} — ${year || ""}`} />
      </Paper>
    </Container>
  );
}
