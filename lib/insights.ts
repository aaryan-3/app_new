import { StressEntry, YogaEntry, FoodEntry, Reflection } from "./types";
import { avg, todayStr, daysAgoStr } from "./utils";
import { lastNDates, stressForDate, avgStressForDate, yogaForDate } from "./selectors";

export interface Insight {
  id: string;
  text: string;
  tone: "gentle" | "encouraging";
}

function hourOf(iso: string): number {
  return new Date(iso).getHours();
}

export function generateWeeklyInsights(
  stressEntries: StressEntry[],
  yogaEntries: YogaEntry[],
  foodEntries: FoodEntry[]
): Insight[] {
  const insights: Insight[] = [];
  const week = lastNDates(7);
  const weekEntries = stressEntries.filter((e) => week.includes(e.createdAt.slice(0, 10)));

  if (weekEntries.length < 3) {
    insights.push({
      id: "not-enough-data",
      text: "There isn't quite enough data yet this week to notice patterns — and that's completely okay. Insights will gently appear as you check in.",
      tone: "gentle",
    });
    return insights;
  }

  // Morning vs afternoon vs evening comparison
  const morning = weekEntries.filter((e) => hourOf(e.createdAt) < 12).map((e) => e.level);
  const afternoon = weekEntries
    .filter((e) => hourOf(e.createdAt) >= 12 && hourOf(e.createdAt) < 18)
    .map((e) => e.level);
  const evening = weekEntries.filter((e) => hourOf(e.createdAt) >= 18).map((e) => e.level);

  const mAvg = avg(morning);
  const aAvg = avg(afternoon);
  const eAvg = avg(evening);

  const buckets = [
    { label: "mornings", value: mAvg },
    { label: "afternoons", value: aAvg },
    { label: "evenings", value: eAvg },
  ].filter((b) => b.value !== null) as { label: string; value: number }[];

  if (buckets.length >= 2) {
    const sorted = [...buckets].sort((a, b) => b.value - a.value);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];
    if (highest.value - lowest.value >= 1) {
      insights.push({
        id: "time-of-day",
        text: `Your stress seemed a little higher in the ${highest.label} this week, and a bit lighter in the ${lowest.label}. It may be worth noticing what's different about those times.`,
        tone: "gentle",
      });
    }
  }

  // Yoga correlation
  const yogaDaysThisWeek = week.filter((d) => {
    const y = yogaForDate(yogaEntries, d);
    return y?.didYoga;
  });
  const nonYogaDaysThisWeek = week.filter((d) => {
    const y = yogaForDate(yogaEntries, d);
    return y && !y.didYoga;
  });

  if (yogaDaysThisWeek.length >= 2 && nonYogaDaysThisWeek.length >= 2) {
    const yogaAvg = avg(
      yogaDaysThisWeek
        .map((d) => avgStressForDate(stressEntries, d))
        .filter((v): v is number => v !== null)
    );
    const restAvg = avg(
      nonYogaDaysThisWeek
        .map((d) => avgStressForDate(stressEntries, d))
        .filter((v): v is number => v !== null)
    );
    if (yogaAvg !== null && restAvg !== null && restAvg - yogaAvg >= 0.8) {
      insights.push({
        id: "yoga-correlation",
        text: "Your entries show somewhat lower stress on days when you did yoga this week. It might be a gentle thing to lean on, no pressure though.",
        tone: "encouraging",
      });
    }
  }

  // Trigger tag frequency
  const tagCounts: Record<string, number> = {};
  for (const e of weekEntries) {
    for (const t of e.tags) {
      tagCounts[t] = (tagCounts[t] ?? 0) + 1;
    }
  }
  const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];
  if (topTag && topTag[1] >= 2) {
    insights.push({
      id: "top-trigger",
      text: `"${topTag[0]}" came up a few times as something on your mind this week. You might notice if there's a small way to soften its edges.`,
      tone: "gentle",
    });
  }

  // Check-in consistency, celebrated gently
  const daysWithCheckins = week.filter((d) => stressForDate(stressEntries, d).length > 0).length;
  if (daysWithCheckins >= 5) {
    insights.push({
      id: "consistency",
      text: "You checked in with yourself most days this week. That quiet consistency is its own kind of care.",
      tone: "encouraging",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "steady",
      text: "Your week looks fairly steady overall. No strong patterns jumped out — sometimes that's simply a calm stretch.",
      tone: "gentle",
    });
  }

  return insights;
}

export function generateDailyReflection(
  date: string,
  stressEntries: StressEntry[],
  yogaEntries: YogaEntry[],
  reflection?: Reflection
): { summary: string; suggestion: string } {
  const dayAvg = avgStressForDate(stressEntries, date);
  const yoga = yogaForDate(yogaEntries, date);

  let summary: string;
  if (dayAvg === null) {
    summary = "You didn't check in today, and that's completely alright. Some days are just for living, not logging.";
  } else if (dayAvg >= 7) {
    summary =
      "Today looks like it carried a lot. However you got through it, that counts for something.";
  } else if (dayAvg >= 4) {
    summary = "Today seemed to have its ups and downs, like most days do. You showed up for yourself anyway.";
  } else {
    summary = "Today seemed a little lighter. It's worth noticing what made that possible, if anything.";
  }

  let suggestion: string;
  if (dayAvg !== null && dayAvg >= 7) {
    suggestion = "Tomorrow, you might try starting with something small and soft — a slow morning, or a few quiet minutes before anything else.";
  } else if (!yoga?.didYoga) {
    suggestion = "Tomorrow, a little gentle movement could feel nice — but only if it calls to you.";
  } else {
    suggestion = "Tomorrow, maybe carry forward whatever felt steady about today.";
  }

  if (reflection?.whatHelped) {
    suggestion = `You mentioned that ${reflection.whatHelped.toLowerCase()} helped today — that might be worth reaching for again tomorrow.`;
  }

  return { summary, suggestion };
}
