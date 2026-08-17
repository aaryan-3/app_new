"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { useStore } from "@/lib/store";
import { StressChart } from "@/components/track/StressChart";
import { StressCheckInSheet } from "@/components/track/StressCheckInSheet";
import { FoodSheet } from "@/components/track/FoodSheet";
import { YogaSheet } from "@/components/track/YogaSheet";
import { ReflectionSheet } from "@/components/track/ReflectionSheet";
import { MedicationList } from "@/components/track/MedicationList";
import { stressColor } from "@/components/ui/StressSlider";
import { todayStr, formatTime12, formatFriendlyDate } from "@/lib/utils";
import { foodForDate, yogaForDate } from "@/lib/selectors";
import { Trash2, Salad, Sparkles } from "lucide-react";

type Tab = "stress" | "medication" | "food" | "yoga" | "reflection";

const TABS: { id: Tab; label: string }[] = [
  { id: "stress", label: "Stress" },
  { id: "medication", label: "Medication" },
  { id: "food", label: "Food" },
  { id: "yoga", label: "Yoga" },
  { id: "reflection", label: "Reflection" },
];

export default function TrackPage() {
  const [tab, setTab] = useState<Tab>("stress");

  return (
    <div className="space-y-5 pt-2 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-plum">Track</h1>
        <p className="text-plum-soft text-sm mt-1">
          Log as much or as little as feels right today.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {TABS.map((t) => (
          <Chip key={t.id} active={tab === t.id} onClick={() => setTab(t.id)} className="whitespace-nowrap">
            {t.label}
          </Chip>
        ))}
      </div>

      {tab === "stress" && <StressTab />}
      {tab === "medication" && <MedicationTab />}
      {tab === "food" && <FoodTab />}
      {tab === "yoga" && <YogaTab />}
      {tab === "reflection" && <ReflectionTab />}
    </div>
  );
}

function StressTab() {
  const stressEntries = useStore((s) => s.stressEntries);
  const deleteStressEntry = useStore((s) => s.deleteStressEntry);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Card>
        <StressChart />
      </Card>
      <Button onClick={() => setOpen(true)} size="lg" className="w-full">
        + New check-in
      </Button>

      <div className="space-y-2.5">
        <p className="text-sm font-medium text-plum-soft px-1">Recent check-ins</p>
        {stressEntries.length === 0 && (
          <EmptyRow text="No check-ins yet. Whenever you're ready ❤️" />
        )}
        {stressEntries.slice(0, 20).map((e) => (
          <div
            key={e.id}
            className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 border border-white/70"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display text-sm shrink-0"
              style={{ backgroundColor: stressColor(e.level) }}
            >
              {e.level}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-plum-soft">
                {new Date(e.createdAt).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
              {e.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {e.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-lavender-light/50 text-plum-soft"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {e.note && <p className="text-sm text-plum mt-1.5">{e.note}</p>}
            </div>
            <button
              onClick={() => deleteStressEntry(e.id)}
              aria-label="Delete check-in"
              className="p-1.5 text-plum-soft/40 hover:text-rose-deep transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <StressCheckInSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function MedicationTab() {
  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm font-medium text-plum-soft mb-1">Today&apos;s medication</p>
        <p className="text-xs text-plum-soft/70 mb-4">
          This is just for your own record-keeping — never advice.
        </p>
        <MedicationList />
      </Card>
    </div>
  );
}

function FoodTab() {
  const foodEntries = useStore((s) => s.foodEntries);
  const deleteFoodEntry = useStore((s) => s.deleteFoodEntry);
  const [open, setOpen] = useState(false);
  const today = todayStr();
  const todaysFood = foodForDate(foodEntries, today);

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)} size="lg" className="w-full">
        + Log a bite
      </Button>
      <div className="space-y-2.5">
        <p className="text-sm font-medium text-plum-soft px-1">Today</p>
        {todaysFood.length === 0 && <EmptyRow text="Nothing logged yet today." />}
        {todaysFood.map((f) => (
          <div
            key={f.id}
            className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 border border-white/70"
          >
            <div className="w-9 h-9 rounded-full bg-peach-light/60 text-peach flex items-center justify-center shrink-0">
              <Salad size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-plum">
                {f.meal} &middot; {formatTime12(f.time)}
              </p>
              <p className="text-sm text-plum-soft">{f.description}</p>
              {f.note && <p className="text-xs text-plum-soft/70 italic mt-0.5">{f.note}</p>}
            </div>
            <button
              onClick={() => deleteFoodEntry(f.id)}
              aria-label="Delete entry"
              className="p-1.5 text-plum-soft/40 hover:text-rose-deep transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <FoodSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function YogaTab() {
  const yogaEntries = useStore((s) => s.yogaEntries);
  const [open, setOpen] = useState(false);
  const today = yogaForDate(yogaEntries, todayStr());

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-sage-light text-sage flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="font-medium text-plum text-sm">
              {today
                ? today.didYoga
                  ? `${today.duration ?? ""} min ${today.type ? `· ${today.type}` : ""}`
                  : "Resting today"
                : "Not logged yet"}
            </p>
            <p className="text-xs text-plum-soft">Today's movement</p>
          </div>
        </div>
        <Button onClick={() => setOpen(true)} className="w-full">
          {today ? "Update today's entry" : "Log today"}
        </Button>
      </Card>

      <div className="space-y-2.5">
        <p className="text-sm font-medium text-plum-soft px-1">History</p>
        {yogaEntries.length === 0 && <EmptyRow text="No entries yet." />}
        {yogaEntries.slice(0, 14).map((y) => (
          <div
            key={y.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-white/60 border border-white/70"
          >
            <div>
              <p className="text-sm font-medium text-plum">{formatFriendlyDate(y.date)}</p>
              <p className="text-xs text-plum-soft">
                {y.didYoga ? `${y.duration ?? ""} min ${y.type ?? ""}` : "Rested"}
              </p>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full ${
                y.didYoga ? "bg-sage-light text-sage" : "bg-plum/5 text-plum-soft"
              }`}
            >
              {y.didYoga ? "Moved" : "Rested"}
            </span>
          </div>
        ))}
      </div>

      <YogaSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function ReflectionTab() {
  const reflections = useStore((s) => s.reflections);
  const [open, setOpen] = useState(false);
  const today = todayStr();

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)} size="lg" className="w-full">
        + Reflect on today
      </Button>
      <div className="space-y-3">
        {reflections.length === 0 && <EmptyRow text="No reflections yet." />}
        {reflections.slice(0, 10).map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-plum">{formatFriendlyDate(r.date)}</p>
              {r.overallFeeling && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-lavender-light/60 text-plum-soft">
                  {r.overallFeeling}/10
                </span>
              )}
            </div>
            {r.wentWell && (
              <p className="text-sm text-plum-soft mb-1">
                <span className="text-plum font-medium">Went well: </span>
                {r.wentWell}
              </p>
            )}
            {r.proudOf && (
              <p className="text-sm text-plum-soft">
                <span className="text-plum font-medium">Proud of: </span>
                {r.proudOf}
              </p>
            )}
          </Card>
        ))}
      </div>
      <ReflectionSheet open={open} onClose={() => setOpen(false)} date={today} />
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="text-center py-8 px-4 rounded-2xl bg-white/40 border border-dashed border-plum/15">
      <p className="text-sm text-plum-soft">{text}</p>
    </div>
  );
}
