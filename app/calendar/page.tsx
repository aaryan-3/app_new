"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/lib/store";
import { avgStressForDate, foodForDate, yogaForDate } from "@/lib/selectors";
import { todayStr } from "@/lib/utils";
import { stressColor } from "@/components/ui/StressSlider";
import { DayDetailSheet } from "@/components/calendar/DayDetailSheet";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const stressEntries = useStore((s) => s.stressEntries);
  const medications = useStore((s) => s.medications);
  const medicationLogs = useStore((s) => s.medicationLogs);
  const foodEntries = useStore((s) => s.foodEntries);
  const yogaEntries = useStore((s) => s.yogaEntries);
  const reflections = useStore((s) => s.reflections);

  const [cursor, setCursor] = useState(() => {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth() };
  });
  const [selected, setSelected] = useState<string | null>(null);

  const today = todayStr();

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const cells = useMemo(() => {
    const firstOfMonth = new Date(cursor.year, cursor.month, 1);
    const startDayOfWeek = firstOfMonth.getDay();
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();

    const out: { date: string | null; day: number | null }[] = [];
    for (let i = 0; i < startDayOfWeek; i++) out.push({ date: null, day: null });
    for (let d = 1; d <= daysInMonth; d++) {
      out.push({ date: toDateStr(cursor.year, cursor.month, d), day: d });
    }
    return out;
  }, [cursor]);

  function goMonth(delta: number) {
    setCursor((c) => {
      let month = c.month + delta;
      let year = c.year;
      if (month < 0) {
        month = 11;
        year--;
      } else if (month > 11) {
        month = 0;
        year++;
      }
      return { year, month };
    });
  }

  const activeMeds = medications.filter((m) => !m.archived);

  return (
    <div className="space-y-5 pt-2 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-plum">Calendar</h1>
        <p className="text-plum-soft text-sm mt-1">
          A gentle look back — tap any day to see what it held.
        </p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => goMonth(-1)}
            aria-label="Previous month"
            className="p-2 rounded-full hover:bg-plum/5 text-plum-soft"
          >
            <ChevronLeft size={18} />
          </button>
          <p className="font-display text-lg text-plum">{monthLabel}</p>
          <button
            onClick={() => goMonth(1)}
            aria-label="Next month"
            className="p-2 rounded-full hover:bg-plum/5 text-plum-soft"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-1 text-center">
          {WEEKDAY_LABELS.map((w, i) => (
            <div key={i} className="text-[11px] font-semibold text-plum-soft/60 pb-2">
              {w}
            </div>
          ))}
          {cells.map((cell, i) => {
            if (!cell.date) return <div key={i} />;
            const isToday = cell.date === today;
            const isFuture = cell.date > today;
            const avgStress = avgStressForDate(stressEntries, cell.date);
            const food = foodForDate(foodEntries, cell.date);
            const yoga = yogaForDate(yogaEntries, cell.date);
            const hasReflection = reflections.some((r) => r.date === cell.date);
            const medTaken = activeMeds.some((m) =>
              medicationLogs.some(
                (l) => l.medicationId === m.id && l.date === cell.date && l.status === "taken"
              )
            );

            const hasAnyActivity =
              avgStress !== null || food.length > 0 || yoga || hasReflection || medTaken;

            return (
              <button
                key={i}
                disabled={isFuture}
                onClick={() => setSelected(cell.date)}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all
                  ${isFuture ? "text-plum-soft/25 cursor-default" : "hover:bg-white/70 text-plum"}
                  ${isToday ? "ring-2 ring-rose/50 font-semibold" : ""}
                `}
              >
                <span>{cell.day}</span>
                {!isFuture && (
                  <span className="flex gap-0.5 mt-1 h-1.5">
                    {avgStress !== null && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: stressColor(Math.round(avgStress)) }}
                      />
                    )}
                    {yoga?.didYoga && <span className="w-1.5 h-1.5 rounded-full bg-sage" />}
                    {food.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-peach" />}
                    {hasReflection && (
                      <span className="w-1.5 h-1.5 rounded-full bg-lavender" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-plum-soft">
        <LegendDot color="#C97A93" label="Stress logged" />
        <LegendDot color="#93B08C" label="Yoga" />
        <LegendDot color="#EFAE83" label="Food logged" />
        <LegendDot color="#8E8FC7" label="Reflection" />
      </Card>

      <DayDetailSheet date={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
