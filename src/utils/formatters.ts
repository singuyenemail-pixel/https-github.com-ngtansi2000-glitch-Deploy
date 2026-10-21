/**
 * Currency and date formatting helpers for Vietnamese VND & localization
 */

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSalaryMillion(amount: number): string {
  const millions = (amount / 1_000_000).toFixed(0);
  return `${millions}M VND`;
}

export function formatSalaryRangeShort(min: number, max: number): string {
  const minM = Math.round(min / 1_000_000);
  const maxM = Math.round(max / 1_000_000);
  return `${minM}M – ${maxM}M VND/tháng`;
}

export function formatSalaryRangeFull(min: number, max: number): string {
  const minFmt = new Intl.NumberFormat('vi-VN').format(min);
  const maxFmt = new Intl.NumberFormat('vi-VN').format(max);
  return `${minFmt} ₫ – ${maxFmt} ₫`;
}

export function getDaysAgo(dateString: string): number {
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = Math.max(0, now.getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 3600 * 24));
}

export function isWithinDays(dateString: string, maxDays: number = 7): boolean {
  return getDaysAgo(dateString) <= maxDays;
}

export function formatRelativeDate(dateString: string, hoursAgo?: number): string {
  if (hoursAgo !== undefined && hoursAgo <= 24) {
    if (hoursAgo <= 1) return 'Vừa đăng 30 phút trước';
    return `Đăng ${hoursAgo} giờ trước`;
  }

  const diffDays = getDaysAgo(dateString);
  if (diffDays <= 0) return 'Hôm nay (Online)';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays <= 7) return `${diffDays} ngày trước (Trong 7 ngày)`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  return new Date(dateString).toLocaleDateString('vi-VN');
}

