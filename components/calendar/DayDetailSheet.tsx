"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import {
  stressForDate,
  avgStressForDate,
  foodForDate,
  yogaForDate,
} from "@/lib/selectors";
import { formatFriendlyDate, formatTime12 } from "@/lib/utils";
import { stressColor } from "@/components/ui/StressSlider";
import { ReflectionSheet } from "@/components/track/ReflectionSheet";
import { Salad, Sparkles, Pill } from "lucide-react";

export function DayDetailSheet({
  date,
  onClose,
}: {
  date: string | null;
  onClose: () => void;
}) {
  const stressEntries = useStore((s) => s.stressEntries);
  const medications = useStore((s) => s.medications);
  const medicationLogs = useStore((s) => s.medicationLogs);
  const foodEntries = useStore((s) => s.foodEntries);
  const yogaEntries = useStore((s) => s.yogaEntries);
  const reflections = useStore((s) => s.reflections);
  const [reflectOpen, setReflectOpen] = useState(false);

  if (!date) return null;

  const dayStress = stressForDate(stressEntries, date);
  const avgStress = avgStressForDate(stressEntries, date);
  const dayMeds = medications
    .filter((m) => !m.archived)
    .map((m) => ({
      med: m,
      log: medicationLogs.find((l) => l.medicationId === m.id && l.date === date),
    }));
  const dayFood = foodForDate(foodEntries, date);
  const dayYoga = yogaForDate(yogaEntries, date);
  const reflection = reflections.find((r) => r.date === date);

  return (
    <>
      <Sheet open={!!date} onClose={onClose} title={formatFriendlyDate(date)}>
        <div className="space-y-6">
          {/* Stress */}
          <section>
            <p className="text-sm font-medium text-plum-soft mb-2">Stress</p>
            {dayStress.length === 0 ? (
              <p className="text-sm text-plum-soft/60 italic">No check-ins this day.</p>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display"
                    style={{ backgroundColor: stressColor(Math.round(avgStress ?? 5)) }}
                  >
                    {avgStress?.toFixed(1)}
                  </div>
                  <p className="text-xs text-plum-soft">
                    Average of {dayStress.length} check-in{dayStress.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="space-y-2">
                  {dayStress.map((e) => (
                    <div key={e.id} className="flex items-start gap-2.5 text-sm">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0 mt-0.5"
                        style={{ backgroundColor: stressColor(e.level) }}
                      >
                        {e.level}
                      </span>
                      <div>
                        <span className="text-plum-soft">
                          {new Date(e.createdAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        {e.tags.length > 0 && (
                          <span className="text-plum-soft/70"> &middot; {e.tags.join(", ")}</span>
                        )}
                        {e.note && <p className="text-plum text-sm mt-0.5">{e.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Medication */}
          {dayMeds.length > 0 && (
            <section>
              <p className="text-sm font-medium text-plum-soft mb-2">Medication</p>
              <div className="space-y-1.5">
                {dayMeds.map(({ med, log }) => (
                  <div key={med.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-plum">
                      <Pill size={14} className="text-plum-soft" /> {med.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        log?.status === "taken"
                          ? "bg-sage-light text-sage"
                          : log?.status === "skipped"
                          ? "bg-plum/5 text-plum-soft"
                          : log?.status === "later"
                          ? "bg-peach-light text-peach"
                          : "bg-plum/5 text-plum-soft/50"
                      }`}
                    >
                      {log?.status ?? "no record"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Food */}
          <section>
            <p className="text-sm font-medium text-plum-soft mb-2 flex items-center gap-1.5">
              <Salad size={14} /> Food
            </p>
            {dayFood.length === 0 ? (
              <p className="text-sm text-plum-soft/60 italic">Nothing logged.</p>
            ) : (
              <div className="space-y-1.5">
                {dayFood.map((f) => (
                  <p key={f.id} className="text-sm text-plum-soft">
                    <span className="text-plum font-medium">{f.meal}:</span> {f.description}{" "}
                    <span className="text-plum-soft/60">({formatTime12(f.time)})</span>
                  </p>
                ))}
              </div>
            )}
          </section>

          {/* Yoga */}
          <section>
            <p className="text-sm font-medium text-plum-soft mb-2 flex items-center gap-1.5">
              <Sparkles size={14} /> Yoga
            </p>
            <p className="text-sm text-plum-soft">
              {!dayYoga
                ? "Not logged."
                : dayYoga.didYoga
                ? `${dayYoga.duration ?? ""} min ${dayYoga.type ? `· ${dayYoga.type}` : ""}`
                : "Rested — and that's okay."}
            </p>
          </section>

          {/* Reflection */}
          <section>
            <p className="text-sm font-medium text-plum-soft mb-2">Reflection</p>
            {reflection ? (
              <div className="space-y-1.5 text-sm text-plum-soft">
                {reflection.wentWell && (
                  <p>
                    <span className="text-plum font-medium">Went well: </span>
                    {reflection.wentWell}
                  </p>
                )}
                {reflection.wasDifficult && (
                  <p>
                    <span className="text-plum font-medium">Difficult: </span>
                    {reflection.wasDifficult}
                  </p>
                )}
                {reflection.proudOf && (
                  <p>
                    <span className="text-plum font-medium">Proud of: </span>
                    {reflection.proudOf}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-plum-soft/60 italic mb-2">No reflection for this day.</p>
            )}
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => setReflectOpen(true)}
            >
              {reflection ? "Edit reflection" : "Add reflection"}
            </Button>
          </section>
        </div>
      </Sheet>
      <ReflectionSheet open={reflectOpen} onClose={() => setReflectOpen(false)} date={date} />
    </>
  );
}
