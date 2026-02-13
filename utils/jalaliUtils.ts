
export interface JalaliDate {
  year: number;
  month: number;
  day: number;
}

export const JALALI_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const WEEKDAYS_FA = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export function getTodayJalali(): JalaliDate {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    numberingSystem: 'latn'
  }).formatToParts(now);

  return {
    year: parseInt(parts.find(p => p.type === 'year')?.value || '1403'),
    month: parseInt(parts.find(p => p.type === 'month')?.value || '1'),
    day: parseInt(parts.find(p => p.type === 'day')?.value || '1')
  };
}

export function isLeapYear(year: number): boolean {
  const r = year % 33;
  return r === 1 || r === 5 || r === 9 || r === 13 || r === 17 || r === 22 || r === 26 || r === 30;
}

export function getDaysInMonth(year: number, month: number): number {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isLeapYear(year) ? 30 : 29;
}

// این تابع تخمینی برای پیدا کردن روز شروع ماه در شبکه تقویم است
export function getFirstDayOfMonth(year: number, month: number): number {
  // استفاده از Intl برای پیدا کردن روز هفته اولین روز ماه شمسی
  // ما باید یک تاریخ میلادی معادل ۱ آن ماه پیدا کنیم.
  // برای سادگی از یک رویکرد تقریبی با استفاده از تاریخ جاری استفاده می‌کنیم
  const today = new Date();
  const todayJ = getTodayJalali();
  
  // محاسبه اختلاف روزها تا اول ماه مورد نظر
  // این یک پیاده سازی ساده شده است. برای دقت ۱۰۰٪ در اپلیکیشن‌های تجاری از کتابخانه‌هایی مثل jalaali-js استفاده می‌شود.
  // اما برای این پلنر، از متد فرمت Intl برای استخراج روز هفته استفاده می‌کنیم.
  const date = new Date();
  // تنظیم به یک تاریخ تقریبی که می‌دانیم در آن ماه است
  // سپس با آزمون و خطا به روز ۱ می‌رسیم
  for(let i = -60; i < 60; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const p = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric', month: 'numeric', day: 'numeric', numberingSystem: 'latn'
    }).formatToParts(d);
    
    const py = parseInt(p.find(p => p.type === 'year')?.value || '0');
    const pm = parseInt(p.find(p => p.type === 'month')?.value || '0');
    const pd = parseInt(p.find(p => p.type === 'day')?.value || '0');
    
    if (py === year && pm === month && pd === 1) {
      const day = d.getDay(); // 0 is Sunday
      // Convert to Saturday-based (0 = Sat, 6 = Fri)
      return (day + 1) % 7;
    }
  }
  return 0;
}

export interface Holiday {
  month: number;
  day: number;
  title: string;
  isReligious?: boolean;
}

export const PERSIAN_HOLIDAYS: Holiday[] = [
  { month: 1, day: 1, title: 'نوروز' },
  { month: 1, day: 2, title: 'نوروز' },
  { month: 1, day: 3, title: 'نوروز' },
  { month: 1, day: 4, title: 'نوروز' },
  { month: 1, day: 12, title: 'روز جمهوری اسلامی' },
  { month: 1, day: 13, title: 'روز طبیعت (سیزده‌بدر)' },
  { month: 3, day: 14, title: 'رحلت امام خمینی' },
  { month: 3, day: 15, title: 'قیام ۱۵ خرداد' },
  { month: 11, day: 22, title: 'پیروزی انقلاب اسلامی' },
  { month: 12, day: 29, title: 'ملی شدن صنعت نفت' },
];
