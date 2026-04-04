import { format, parseISO } from "date-fns";

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    return format(parseISO(dateString), "dd MMM yyyy");
  } catch (e) {
    return dateString;
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    return format(parseISO(dateString), "dd MMM yyyy, HH:mm");
  } catch (e) {
    return dateString;
  }
}

export function getDaysRemaining(deadline: string | null | undefined): number | null {
  if (!deadline) return null;
  try {
    const d = parseISO(deadline);
    const now = new Date();
    const diffTime = d.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (e) {
    return null;
  }
}

export function snakeToTitle(str: string): string {
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
