"use client";

import { cn } from "@/lib/utils";

interface StressSliderProps {
  value: number;
  onChange: (v: number) => void;
}

const LABELS: Record<number, string> = {
  1: "Calm",
  2: "At ease",
  3: "Settled",
  4: "A little tense",
  5: "Noticeable",
  6: "Stretched thin",
  7: "Heavy",
  8: "A lot right now",
  9: "Overwhelmed",
  10: "Right at the edge",
};

// Warm gradient from sage (calm) through peach to rose (intense) — never red/alarm colors
function colorFor(level: number): string {
  const stops = [
    "#93B08C", // 1 sage
    "#A3B489",
    "#B7B687",
    "#CDBB86",
    "#E0BC85",
    "#EFAE83", // peach mid
    "#EDA189",
    "#E5928F",
    "#DA8598",
    "#C97A93", // 10 rose
  ];
  return stops[clampIdx(level - 1, 0, 9)];
}
function clampIdx(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function StressSlider({ value, onChange }: StressSliderProps) {
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-3">
        <span className="font-display text-3xl" style={{ color: colorFor(value) }}>
          {value}
        </span>
        <span className="text-plum-soft text-sm font-medium">{LABELS[value]}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-rose"
        style={{
          background: `linear-gradient(to right, #93B08C 0%, #EFAE83 50%, #C97A93 100%)`,
        }}
        aria-label="Stress level"
      />
      <div className="flex justify-between mt-2 px-0.5">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "w-6 h-6 -mx-0.5 rounded-full text-[10px] font-semibold flex items-center justify-center transition-all",
              value === n
                ? "scale-110 text-white shadow-md"
                : "text-plum-soft/60 hover:text-plum"
            )}
            style={value === n ? { backgroundColor: colorFor(n) } : undefined}
            aria-label={`Set stress to ${n}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export { colorFor as stressColor };
