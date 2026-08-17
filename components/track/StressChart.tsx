"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useStore } from "@/lib/store";
import { lastNDates, stressSeriesForDates, todayHourlySeries } from "@/lib/selectors";
import { Chip } from "@/components/ui/Chip";
import { formatTime12 } from "@/lib/utils";

type Range = "today" | "week" | "month";

export function StressChart() {
  const stressEntries = useStore((s) => s.stressEntries);
  const [range, setRange] = useState<Range>("week");

  const data = useMemo(() => {
    if (range === "today") {
      return todayHourlySeries(stressEntries).map((d) => ({
        label: formatTime12(d.time),
        level: d.level,
      }));
    }
    const days = range === "week" ? 7 : 30;
    const series = stressSeriesForDates(stressEntries, lastNDates(days));
    return series.map((d) => ({
      label: new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      level: d.avg !== null ? Math.round(d.avg * 10) / 10 : null,
    }));
  }, [range, stressEntries]);

  const hasData = data.some((d) => d.level !== null && d.level !== undefined);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-plum-soft">Stress over time</p>
        <div className="flex gap-1.5">
          {(["today", "week", "month"] as Range[]).map((r) => (
            <Chip key={r} active={range === r} onClick={() => setRange(r)} className="px-3 py-1 text-xs">
              {r === "today" ? "Today" : r === "week" ? "Week" : "Month"}
            </Chip>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="h-48 flex items-center justify-center text-center px-6">
          <p className="text-sm text-plum-soft/70">
            No check-ins yet for this range. Whenever you're ready, your gentle trends will
            show up here.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="stressFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C97A93" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#C97A93" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#3E3548" strokeOpacity={0.06} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6B6075" }}
              axisLine={false}
              tickLine={false}
              interval={range === "month" ? 4 : 0}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 5, 10]}
              tick={{ fontSize: 11, fill: "#6B6075" }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: "1px solid rgba(62,53,72,0.08)",
                boxShadow: "0 8px 30px -12px rgba(62,53,72,0.25)",
                fontSize: 13,
              }}
              formatter={(value) => [value as number, "Stress"]}
            />
            <Area
              type="monotone"
              dataKey="level"
              stroke="#C97A93"
              strokeWidth={2.5}
              fill="url(#stressFill)"
              connectNulls
              dot={{ r: 3, fill: "#C97A93", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
