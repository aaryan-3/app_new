"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  Home,
  CalendarDays,
  PenLine,
  Sparkles,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/track", label: "Track", icon: PenLine },
  { href: "/insights", label: "Insights", icon: Sparkles },
  { href: "/for-you", label: "For You", icon: Heart },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh flex flex-col sm:flex-row">
      {/* Ambient background blobs */}
      <div
        aria-hidden
        className="fixed -top-24 -left-24 w-72 h-72 rounded-full bg-lavender-light/40 blur-3xl animate-drift pointer-events-none"
      />
      <div
        aria-hidden
        className="fixed top-1/3 -right-32 w-96 h-96 rounded-full bg-peach-light/40 blur-3xl animate-drift pointer-events-none"
        style={{ animationDelay: "2s" }}
      />

      {/* Desktop sidebar */}
      <aside className="hidden sm:flex sm:flex-col sm:w-64 sm:shrink-0 sm:h-dvh sm:sticky sm:top-0 px-6 py-8 z-20">
        <div className="flex items-center gap-2 px-2 mb-10">
          <span className="font-display text-2xl text-plum italic">little space</span>
        </div>
        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-[0.95rem] font-medium transition-all",
                  active
                    ? "bg-white/80 text-rose-deep shadow-[0_4px_16px_-8px_rgba(62,53,72,0.12)]"
                    : "text-plum-soft hover:bg-white/50 hover:text-plum"
                )}
              >
                <Icon size={19} strokeWidth={active ? 2.3 : 1.9} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
              pathname === "/settings"
                ? "bg-white/80 text-rose-deep"
                : "text-plum-soft hover:bg-white/50 hover:text-plum"
            )}
          >
            <Settings size={18} strokeWidth={1.9} />
            Settings & privacy
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sm:hidden sticky top-0 z-20 flex items-center justify-between px-5 pt-5 pb-2 bg-gradient-to-b from-cream to-cream/0">
        <span className="font-display text-xl text-plum italic">little space</span>
        <Link
          href="/settings"
          aria-label="Settings"
          className="p-2 rounded-full text-plum-soft hover:bg-white/50"
        >
          <Settings size={19} />
        </Link>
      </header>

      <main className="flex-1 z-10 px-4 sm:px-8 pb-28 sm:pb-10 pt-2 sm:pt-8 max-w-3xl w-full mx-auto">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/85 backdrop-blur-lg border-t border-plum/5 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.4rem)]">
        <div className="flex justify-between max-w-md mx-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[3.5rem]"
              >
                <Icon
                  size={21}
                  strokeWidth={active ? 2.3 : 1.8}
                  className={active ? "text-rose-deep" : "text-plum-soft/70"}
                  fill={active && item.href === "/for-you" ? "currentColor" : "none"}
                />
                <span
                  className={cn(
                    "text-[10.5px] font-medium",
                    active ? "text-rose-deep" : "text-plum-soft/70"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
