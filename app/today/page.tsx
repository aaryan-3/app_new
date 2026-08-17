"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import {
  avgStressForDate,
  medsStatusForDate,
  foodForDate,
  yogaForDate,
  stressForDate,
} from "@/lib/selectors";
import { todayStr } from "@/lib/utils";
import { GREETING_MESSAGES, randomFrom } from "@/lib/messages";
import { StressCheckInSheet } from "@/components/track/StressCheckInSheet";
import { FoodSheet } from "@/components/track/FoodSheet";
import { YogaSheet } from "@/components/track/YogaSheet";
import { ReflectionSheet } from "@/components/track/ReflectionSheet";
import { MedicationList } from "@/components/track/MedicationList";
import { stressColor } from "@/components/ui/StressSlider";
import { HeartPulse, Salad, Sparkles as Leaf, NotebookPen } from "lucide-react";
import Link from "next/link";

export default function TodayPage() {
  const name = useStore((s) => s.profile.name);
  const stressEntries = useStore((s) => s.stressEntries);
  const medications = useStore((s) => s.medications);
  const medicationLogs = useStore((s) => s.medicationLogs);
  const foodEntries = useStore((s) => s.foodEntries);
  const yogaEntries = useStore((s) => s.yogaEntries);
  const hydrated = useStore((s) => s.hydrated);

  const today = todayStr();
  const greeting = useMemo(() => randomFrom(GREETING_MESSAGES), []);

  const [stressOpen, setStressOpen] = useState(false);
  const [foodOpen, setFoodOpen] = useState(false);
  const [yogaOpen, setYogaOpen] = useState(false);
  const [reflectionOpen, setReflectionOpen] = useState(false);

  const todaysStress = stressForDate(stressEntries, today);
  const avgStress = avgStressForDate(stressEntries, today);
  const medStatus = medsStatusForDate(medications, medicationLogs, today);
  const todaysFood = foodForDate(foodEntries, today);
  const todaysYoga = yogaForDate(yogaEntries, today);

  if (!hydrated) {
    return (
      <div className="pt-10 space-y-4 animate-pulse">
        <div className="h-8 w-2/3 bg-white/50 rounded-xl" />
        <div className="h-24 bg-white/40 rounded-3xl" />
        <div className="h-40 bg-white/40 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-2 animate-fade-up">
      {/* Greeting */}
      <div className="pt-2 pb-1">
        <h1 className="font-display text-[1.7rem] sm:text-3xl text-plum leading-tight">
          Hey {name} <span className="text-rose">❤️</span>
        </h1>
        <p className="text-plum-soft mt-1.5 italic">{greeting}</p>
      </div>

      {/* Ambient breathing orb + today's snapshot */}
      <Card className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-70 animate-breathe"
          style={{
            background: `radial-gradient(circle, ${
              avgStress ? stressColor(Math.round(avgStress)) : "#D9D8F0"
            }55, transparent 70%)`,
          }}
        />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-plum-soft/70 font-semibold mb-1">
              Today&apos;s average stress
            </p>
            {avgStress !== null ? (
              <p
                className="font-display text-4xl"
                style={{ color: stressColor(Math.round(avgStress)) }}
              >
                {avgStress.toFixed(1)}
                <span className="text-lg text-plum-soft">/10</span>
              </p>
            ) : (
              <p className="font-display text-2xl text-plum-soft/60">
                No check-ins yet
              </p>
            )}
            <p className="text-xs text-plum-soft mt-1.5">
              {todaysStress.length} check-in{todaysStress.length === 1 ? "" : "s"} today
            </p>
          </div>
          <button
            onClick={() => setStressOpen(true)}
            className="rounded-full bg-rose text-white px-5 py-3 text-sm font-medium shadow-[0_6px_20px_-6px_rgba(169,93,119,0.55)] active:scale-95 transition-transform shrink-0"
          >
            Check in
          </button>
        </div>
      </Card>

      {/* Status grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatusTile
          icon={<HeartPulse size={18} />}
          label="Medication"
          value={
            medStatus.total === 0
              ? "Not set up"
              : `${medStatus.taken}/${medStatus.total} taken`
          }
          tone={medStatus.total > 0 && medStatus.taken === medStatus.total ? "sage" : "neutral"}
        />
        <StatusTile
          icon={<Leaf size={18} />}
          label="Yoga"
          value={
            !todaysYoga
              ? "Not logged"
              : todaysYoga.didYoga
              ? `${todaysYoga.duration ?? ""} min`
              : "Resting today"
          }
          tone={todaysYoga?.didYoga ? "sage" : "neutral"}
        />
        <StatusTile
          icon={<Salad size={18} />}
          label="Food"
          value={
            todaysFood.length === 0
              ? "Nothing logged"
              : `${todaysFood.length} meal${todaysFood.length === 1 ? "" : "s"} logged`
          }
          tone={todaysFood.length > 0 ? "sage" : "neutral"}
        />
        <StatusTile
          icon={<NotebookPen size={18} />}
          label="Reflection"
          value="Add your thoughts"
          tone="neutral"
          onClick={() => setReflectionOpen(true)}
        />
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-sm font-medium text-plum-soft mb-2.5 px-1">Quick log</p>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="md" onClick={() => setStressOpen(true)} className="justify-start">
            🌤️ Stress check-in
          </Button>
          <Button variant="outline" size="md" onClick={() => setFoodOpen(true)} className="justify-start">
            🍽️ Log food
          </Button>
          <Button variant="outline" size="md" onClick={() => setYogaOpen(true)} className="justify-start">
            🧘 Log yoga
          </Button>
          <Button variant="outline" size="md" onClick={() => setReflectionOpen(true)} className="justify-start">
            📝 Reflect
          </Button>
        </div>
      </div>

      {/* Medications */}
      {medications.filter((m) => !m.archived).length > 0 && (
        <div>
          <p className="text-sm font-medium text-plum-soft mb-2.5 px-1">Today&apos;s medication</p>
          <MedicationList />
        </div>
      )}

      <div className="text-center pt-2 pb-4">
        <Link
          href="/for-you"
          className="text-sm text-rose-deep font-medium hover:underline"
        >
          Feeling low? Visit your For You space →
        </Link>
      </div>

      <StressCheckInSheet open={stressOpen} onClose={() => setStressOpen(false)} />
      <FoodSheet open={foodOpen} onClose={() => setFoodOpen(false)} />
      <YogaSheet open={yogaOpen} onClose={() => setYogaOpen(false)} />
      <ReflectionSheet
        open={reflectionOpen}
        onClose={() => setReflectionOpen(false)}
        date={today}
      />
    </div>
  );
}

function StatusTile({
  icon,
  label,
  value,
  tone,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "sage" | "neutral";
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className="text-left p-4 rounded-2xl bg-white/60 border border-white/70 flex flex-col gap-2 w-full"
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          tone === "sage" ? "bg-sage-light text-sage" : "bg-lavender-light/60 text-lavender"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-plum-soft">{label}</p>
        <p className="text-sm font-medium text-plum truncate">{value}</p>
      </div>
    </Comp>
  );
}
