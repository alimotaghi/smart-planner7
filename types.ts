
export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Event {
  id: string;
  time: string;
  text: string;
}

export interface DayData {
  priorities: string[];
  events: Event[];
  tasks: Task[];
}

export interface Habit {
  id: string;
  name: string;
  checks: boolean[]; // 7 days (Sat to Fri)
}

export type AssignmentPriority = 'کم' | 'متوسط' | 'زیاد';
export type AssignmentStatus = 'شروع نشده' | 'در حال انجام' | 'ارسال شده' | 'تعویق شده';
export type AssignmentType = 'کوییز' | 'تکلیف' | 'امتحان' | 'خواندن' | 'پروژه' | 'کنفرانس';

export interface Assignment {
  id: string;
  className: string;
  title: string;
  type: AssignmentType;
  description: string;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  dueDate: string;
  deadlineTime: string;
  grade: string;
  reminderSent?: boolean;
}

// Finance Types
export interface FinanceItem {
  id: string;
  label: string;
  budget: number;
  actual: number;
}

export interface Transaction {
  id: string;
  dayIndex: number; // 0-6 (Sat-Fri)
  label: string;
  amount: number;
  category: string;
}

export interface FinanceData {
  income: FinanceItem[];
  expenses: FinanceItem[];
  bills: FinanceItem[];
  debt: FinanceItem[];
  savings: FinanceItem[];
  dailyTransactions: Transaction[];
}

export interface WeekData {
  quote: string;
  reminders: Task[];
  habits: Habit[];
  assignments: Assignment[];
  finance: FinanceData;
  days: Record<string, DayData>;
}

export const WEEKDAY_NAMES_FA = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه'
];
