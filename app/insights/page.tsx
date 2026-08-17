"use client";

import { Card } from "@/components/ui/Card";
import { useStore } from "@/lib/store";
import { generateWeeklyInsights, generateDailyReflection } from "@/lib/insights";
import { todayStr } from "@/lib/utils";
import { StressChart } from "@/components/track/StressChart";
import { Sparkles, Moon } from "lucide-react";

export default function InsightsPage() {
  const stressEntries = useStore((s) => s.stressEntries);
  const yogaEntries = useStore((s) => s.yogaEntries);
  const foodEntries = useStore((s) => s.foodEntries);
  const reflections = useStore((s) => s.reflections);

  const insights = generateWeeklyInsights(stressEntries, yogaEntries, foodEntries);
  const today = todayStr();
  const todaysReflection = reflections.find((r) => r.date === today);
  const { summary, suggestion } = generateDailyReflection(
    today,
    stressEntries,
    yogaEntries,
    todaysReflection
  );

  return (
    <div className="space-y-5 pt-2 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-plum">Insights</h1>
        <p className="text-plum-soft text-sm mt-1">
          Gentle observations, never conclusions.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-lavender-light/50 to-white/70">
        <div className="flex items-center gap-2 mb-3">
          <Moon size={17} className="text-lavender" />
          <p className="text-sm font-semibold text-plum">Today, in a few words</p>
        </div>
        <p className="text-plum text-[0.95rem] leading-relaxed mb-3">{summary}</p>
        <div className="pt-3 border-t border-plum/10">
          <p className="text-xs font-semibold text-plum-soft/80 uppercase tracking-wide mb-1">
            For tomorrow
          </p>
          <p className="text-sm text-plum-soft leading-relaxed">{suggestion}</p>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={17} className="text-rose" />
          <p className="text-sm font-semibold text-plum">This week</p>
        </div>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-2xl bg-white/60 border border-white/70 text-sm text-plum-soft leading-relaxed"
            >
              {insight.text}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <StressChart />
      </Card>

      <p className="text-center text-xs text-plum-soft/60 px-6 pb-2">
        These reflections are gentle observations based only on your own entries — never
        medical advice or a diagnosis.
      </p>
    </div>
  );
}
