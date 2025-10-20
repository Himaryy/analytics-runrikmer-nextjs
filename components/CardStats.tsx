// components/CardStats.tsx
import { Card, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface FeatureProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}

export function CardStats({ title, value, icon, className }: FeatureProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-lg h-14",
        // LIGHT
        "bg-white border border-zinc-200/70 shadow-sm hover:shadow-md",
        // DARK (tamed)
        "dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-sm dark:hover:shadow-md",
        // motion polish
        "transition-all duration-150 hover:-translate-y-0.5",
        className
      )}
    >
      {/* left olive accent (subtle in dark) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-green-700/60 dark:bg-green-500/45" />

      {/* soft gradation wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-700/6 via-amber-500/5 to-transparent dark:from-emerald-300/6 dark:via-amber-200/4 dark:to-transparent" />

      {/* top hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-700/25 to-transparent dark:via-green-400/20" />

      <CardHeader className="h-full px-3 py-0">
        <div className="grid h-full grid-cols-[auto_1fr] items-center gap-3">
          {icon ? (
            <div className="grid size-7 place-items-center rounded-md border border-zinc-200/70 bg-zinc-50/70 text-green-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-green-200">
              {icon}
            </div>
          ) : null}

          <div className="min-w-0">
            <div className="text-[11px] leading-none text-zinc-500 dark:text-zinc-400 truncate">
              {title}
            </div>
            <CardTitle
              className={cn(
                "text-base leading-tight font-semibold truncate",
                "text-green-700 dark:text-green-200"
              )}
            >
              {value}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      {/* hover ring (no layout shift) */}
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-0 group-hover:ring-1 ring-green-700/15 dark:group-hover:ring-green-400/18" />

      {/* kill default outlines that look harsh on dark */}
      <span className="sr-only">stat card</span>
    </Card>
  );
}
