import { createId } from "../shared/id";
import { formatRelativeTime } from "../shared/time";

export function generateId(): string {
  return createId();
}

export function formatDate(date: Date | string | number): string {
  if (typeof date === "number") return formatRelativeTime(date);
  if (typeof date === "string") {
    const parsed = new Date(date).getTime();
    return formatRelativeTime(Number.isFinite(parsed) ? parsed : Date.now());
  }
  return formatRelativeTime(date.getTime());
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
