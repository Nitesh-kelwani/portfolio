import { cn } from "@/lib/utils";

/**
 * The mark: a half sun resting on the horizon, with its reflection below.
 * It echoes the dusk landscape the site is drawn on and reads cleanly from 16px up.
 */
export function Logo({ className, title = "Nitesh Kelwani" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} role="img" aria-label={title} fill="currentColor">
      <path d="M5.5 18.6a10.5 10.5 0 0 1 21 0Z" />
      <rect x="2.5" y="21.4" width="27" height="3.4" rx="1.7" />
      <rect x="8.5" y="27" width="15" height="3" rx="1.5" opacity="0.55" />
    </svg>
  );
}
