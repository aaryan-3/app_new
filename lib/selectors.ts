import {
  StressEntry,
  Medication,
  MedicationLog,
  FoodEntry,
  YogaEntry,
} from "./types";
import { avg, todayStr } from "./utils";

export function stressForDate(entries: StressEntry[], date: string): StressEntry[] {
  return entries
    .filter((e) => e.createdAt.slice(0, 10) === date)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function avgStressForDate(entries: StressEntry[], date: string): number | null {
  const nums = stressForDate(entries, date).map((e) => e.level);
  return avg(nums);
}

export function medsStatusForDate(
  meds: Medication[],
  logs: MedicationLog[],
  date: string
): { total: number; taken: number; skipped: number; pending: number } {
  const active = meds.filter((m) => !m.archived);
  let taken = 0;
  let skipped = 0;
  for (const m of active) {
    const log = logs.find((l) => l.medicationId === m.id && l.date === date);
    if (log?.status === "taken") taken++;
    else if (log?.status === "skipped") skipped++;
  }
  return {
    total: active.length,
    taken,
    skipped,
    pending: active.length - taken - skipped,
  };
}

export function foodForDate(entries: FoodEntry[], date: string): FoodEntry[] {
  return entries
    .filter((e) => e.date === date)
    .sort((a, b) => (a.time > b.time ? 1 : -1));
}

export function yogaForDate(entries: YogaEntry[], date: string): YogaEntry | undefined {
  return entries.find((y) => y.date === date);
}

export function lastNDates(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`
    );
  }
  return out;
}

export interface DayStressPoint {
  date: string;
  avg: number | null;
  count: number;
}

export function stressSeriesForDates(
  entries: StressEntry[],
  dates: string[]
): DayStressPoint[] {
  return dates.map((date) => {
    const dayEntries = stressForDate(entries, date);
    return {
      date,
      avg: avg(dayEntries.map((e) => e.level)),
      count: dayEntries.length,
    };
  });
}

export function todayHourlySeries(entries: StressEntry[]) {
  const today = todayStr();
  return stressForDate(entries, today)
    .slice()
    .reverse()
    .map((e) => ({
      time: e.createdAt.slice(11, 16),
      level: e.level,
    }));
}
