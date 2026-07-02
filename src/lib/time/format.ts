import { formatInTimeZone } from "date-fns-tz";

import {
  DEFAULT_BUSINESS_TIME_ZONE,
  resolveBusinessTimeZone,
  type BusinessTimeZone,
} from "@/lib/time/options";

const DASHBOARD_DATE_TIME_FORMAT = "MMM d, h:mm a zzz";

export function getBusinessTimeZone() {
  return resolveBusinessTimeZone(process.env.APP_TIME_ZONE?.trim());
}

export function formatBusinessDateTime(
  value: Date | string | null | undefined,
  timeZone: BusinessTimeZone = getBusinessTimeZone(),
) {
  if (!value) {
    return "No activity yet";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  try {
    return formatInTimeZone(date, timeZone, DASHBOARD_DATE_TIME_FORMAT);
  } catch {
    return formatInTimeZone(date, DEFAULT_BUSINESS_TIME_ZONE, DASHBOARD_DATE_TIME_FORMAT);
  }
}
