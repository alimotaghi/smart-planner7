
import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { 
  getTodayJalali, 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  JALALI_MONTH_NAMES, 
  WEEKDAYS_FA, 
  PERSIAN_HOLIDAYS,
  JalaliDate
} from '../utils/jalaliUtils';

const PersianCalendar: React.FC = () => {
  const today = useMemo(() => getTodayJalali(), []);
  const [viewDate, setViewDate] = useState<JalaliDate>(today);

  const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
  const firstDayIdx = getFirstDayOfMonth(viewDate.year, viewDate.month);

  const prevMonth = () => {
    if (viewDate.month === 1) {
      setViewDate({ ...viewDate, year: viewDate.year - 1, month: 12 });
    } else {
      setViewDate({ ...viewDate, month: viewDate.month - 1 });
    }
  };

  const nextMonth = () => {
    if (viewDate.month === 12) {
      setViewDate({ ...viewDate, year: viewDate.year + 1, month: 1 });
    } else {
      setViewDate({ ...viewDate, month: viewDate.month + 1 });
    }
  };

  const monthHolidays = PERSIAN_HOLIDAYS.filter(h => h.month === viewDate.month);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Calendar Header */}
      <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center">
        <button onClick={prevMonth} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
          <ChevronRight size={18} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-black text-slate-800">
            {JALALI_MONTH_NAMES[viewDate.month - 1]} {viewDate.year}
          </span>
        </div>
        <button onClick={nextMonth} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
        {WEEKDAYS_FA.map(day => (
          <div key={day} className="py-2 text-[9px] font-black text-slate-400 text-center uppercase">
            {day[0]}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 p-2 gap-1">
        {/* Empty cells for start of month */}
        {Array.from({ length: firstDayIdx }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Month days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = today.year === viewDate.year && today.month === viewDate.month && today.day === day;
          const holiday = monthHolidays.find(h => h.day === day);
          const isFriday = (firstDayIdx + i) % 7 === 6;

          return (
            <div 
              key={day} 
              className={`
                aspect-square flex flex-col items-center justify-center rounded-lg text-[10px] font-bold relative group cursor-default transition-all
                ${isToday ? 'bg-indigo-600 text-white shadow-md z-10' : 'hover:bg-slate-100 text-slate-600'}
                ${(holiday || isFriday) && !isToday ? 'text-rose-500' : ''}
              `}
            >
              {day}
              {holiday && (
                <div className="absolute -bottom-0.5 w-1 h-1 bg-rose-400 rounded-full" />
              )}
              {/* Tooltip on hover */}
              {holiday && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[8px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                  {holiday.title}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Month Events/Holidays List */}
      {monthHolidays.length > 0 && (
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <div className="text-[9px] font-black text-slate-400 mb-2 uppercase flex items-center gap-1">
            <CalendarIcon size={10}/> مناسبت‌های این ماه
          </div>
          <div className="space-y-1.5">
            {monthHolidays.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[9px] font-black text-rose-500 w-4">{h.day}</span>
                <span className="text-[9px] font-bold text-slate-600">{h.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersianCalendar;
