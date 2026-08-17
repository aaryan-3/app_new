"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { useStore } from "@/lib/store";
import { LOVE_MESSAGES, randomFrom } from "@/lib/messages";
import { LoveCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES: LoveCategory[] = [
  "Anxiety",
  "Overwhelmed",
  "Confidence",
  "Self-worth",
  "Random",
];

export default function ForYouPage() {
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);

  const [category, setCategory] = useState<LoveCategory>("Random");
  const [message, setMessage] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  function giveLove() {
    const pool = LOVE_MESSAGES[category];
    let next = randomFrom(pool);
    // avoid immediate repeat when possible
    if (pool.length > 1) {
      let attempts = 0;
      while (next === message && attempts < 5) {
        next = randomFrom(pool);
        attempts++;
      }
    }
    setMessage(next);
  }

  const isFavorited = message ? favorites.some((f) => f.message === message) : false;

  return (
    <div className="space-y-5 pt-2 pb-4 animate-fade-up">
      <div className="text-center pt-1">
        <h1 className="font-display text-2xl sm:text-3xl text-plum flex items-center justify-center gap-2">
          For You <Heart className="text-rose" fill="currentColor" size={22} />
        </h1>
        <p className="text-plum-soft text-sm mt-1">A little love, whenever you need it.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            active={category === c}
            onClick={() => {
              setCategory(c);
              setMessage(null);
            }}
          >
            {c}
          </Chip>
        ))}
      </div>

      <Card className="relative overflow-hidden text-center py-10 px-6 min-h-[220px] flex flex-col items-center justify-center">
        <div
          aria-hidden
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-rose-light/30 blur-3xl animate-breathe"
        />
        {message ? (
          <p className="font-display text-2xl sm:text-3xl text-plum leading-snug relative animate-fade-up italic">
            &ldquo;{message}&rdquo;
          </p>
        ) : (
          <p className="text-plum-soft text-sm relative">
            Tap the button below whenever you need a little love.
          </p>
        )}

        {message && (
          <button
            onClick={() => toggleFavorite(message, category)}
            className="mt-5 relative flex items-center gap-1.5 text-sm font-medium text-rose-deep"
          >
            <Heart
              size={16}
              fill={isFavorited ? "currentColor" : "none"}
              className={isFavorited ? "text-rose" : "text-rose-deep"}
            />
            {isFavorited ? "Saved to favorites" : "Save this"}
          </button>
        )}
      </Card>

      <button
        onClick={giveLove}
        className="w-full py-5 rounded-[1.75rem] bg-gradient-to-br from-rose to-rose-deep text-white font-display text-lg shadow-[0_10px_30px_-10px_rgba(169,93,119,0.6)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
      >
        Give me some love <Heart size={20} fill="currentColor" />
      </button>

      <div>
        <button
          onClick={() => setShowFavorites((v) => !v)}
          className="text-sm font-medium text-plum-soft hover:text-plum flex items-center gap-1.5 mx-auto"
        >
          {showFavorites ? "Hide" : "Show"} your favorites ({favorites.length})
        </button>

        {showFavorites && (
          <div className="mt-4 space-y-2.5 animate-fade-up">
            {favorites.length === 0 ? (
              <p className="text-center text-sm text-plum-soft/60 py-6">
                Nothing saved yet — tap the heart on a message you love.
              </p>
            ) : (
              favorites.map((f) => (
                <div
                  key={f.message}
                  className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-white/60 border border-white/70"
                >
                  <div>
                    <p className="text-sm text-plum italic">&ldquo;{f.message}&rdquo;</p>
                    <p className="text-[11px] text-plum-soft/60 mt-1">{f.category}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(f.message, f.category)}
                    aria-label="Remove from favorites"
                    className="shrink-0"
                  >
                    <Heart size={16} fill="currentColor" className="text-rose" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
