const INTERNAL_SOURCE_MARKER_PATTERN = /\s*\[S\d+\]/g;

export function removeInternalSourceMarkers(text: string) {
  return text.replace(INTERNAL_SOURCE_MARKER_PATTERN, "").trim();
}
