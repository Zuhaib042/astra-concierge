export const TIME_ZONE_QUERY_PARAM = "tz";

export const BUSINESS_TIME_ZONE_OPTIONS = [
  {
    value: "Asia/Karachi",
    label: "Pakistan",
    detail: "Karachi, Lahore, Islamabad",
  },
  {
    value: "Asia/Dubai",
    label: "United Arab Emirates",
    detail: "Dubai, Abu Dhabi",
  },
  {
    value: "Asia/Kolkata",
    label: "India",
    detail: "Delhi, Mumbai, Bengaluru",
  },
  {
    value: "Europe/London",
    label: "United Kingdom",
    detail: "London",
  },
  {
    value: "Europe/Berlin",
    label: "Central Europe",
    detail: "Berlin, Paris, Amsterdam",
  },
  {
    value: "America/New_York",
    label: "US Eastern",
    detail: "New York, Toronto",
  },
  {
    value: "America/Chicago",
    label: "US Central",
    detail: "Chicago, Dallas",
  },
  {
    value: "America/Denver",
    label: "US Mountain",
    detail: "Denver, Phoenix",
  },
  {
    value: "America/Los_Angeles",
    label: "US Pacific",
    detail: "Los Angeles, San Francisco",
  },
  {
    value: "Australia/Sydney",
    label: "Australia Eastern",
    detail: "Sydney, Melbourne",
  },
  {
    value: "UTC",
    label: "UTC",
    detail: "Universal time",
  },
] as const;

export type BusinessTimeZone =
  (typeof BUSINESS_TIME_ZONE_OPTIONS)[number]["value"];

export const DEFAULT_BUSINESS_TIME_ZONE: BusinessTimeZone = "Asia/Karachi";

export function isBusinessTimeZone(value: unknown): value is BusinessTimeZone {
  return BUSINESS_TIME_ZONE_OPTIONS.some((option) => option.value === value);
}

export function resolveBusinessTimeZone(value: unknown): BusinessTimeZone {
  return isBusinessTimeZone(value) ? value : DEFAULT_BUSINESS_TIME_ZONE;
}
