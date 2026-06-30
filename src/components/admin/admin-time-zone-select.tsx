"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Clock3 } from "lucide-react";

import {
  BUSINESS_TIME_ZONE_OPTIONS,
  TIME_ZONE_QUERY_PARAM,
  type BusinessTimeZone,
} from "@/lib/time/options";
import { cn } from "@/lib/utils";

type AdminTimeZoneSelectProps = {
  selectedTimeZone: BusinessTimeZone;
};

export function AdminTimeZoneSelect({
  selectedTimeZone,
}: AdminTimeZoneSelectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedOption =
    BUSINESS_TIME_ZONE_OPTIONS.find(
      (option) => option.value === selectedTimeZone,
    ) ?? BUSINESS_TIME_ZONE_OPTIONS[0];

  function updateTimeZone(value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set(TIME_ZONE_QUERY_PARAM, value);

    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }

  return (
    <label className="flex w-full flex-col gap-2 rounded-lg border border-border bg-card/80 p-3 sm:w-[320px]">
      <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Clock3 className="h-3.5 w-3.5 text-primary" aria-hidden />
        Display timezone
      </span>

      <span className="relative block">
        <select
          value={selectedTimeZone}
          onChange={(event) => updateTimeZone(event.target.value)}
          className={cn(
            "h-10 w-full appearance-none rounded-md border border-border bg-background px-3 pr-10 text-sm text-foreground shadow-sm outline-none transition-colors",
            "hover:border-primary/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/35",
          )}
        >
          {BUSINESS_TIME_ZONE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.detail}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </span>

      <span className="text-xs leading-5 text-muted-foreground">
        Showing times for {selectedOption.detail}
      </span>
    </label>
  );
}
