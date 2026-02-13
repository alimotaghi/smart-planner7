
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Download, 
  Trash2, 
  Sparkles,
  Quote,
  LayoutDashboard,
  CalendarDays,
  CircleDollarSign,
  CloudCheck,
  FileText,
  Check
} from 'lucide-react';
import { WeekData, DayData, Habit, Task, Assignment, FinanceData } from './types';
import { getStartOfWeek, formatDateFA, getWeekRangeKey } from './utils/dateUtils';
import DayCard from './components/DayCard';
import HabitTracker from './components/HabitTracker';
import Dashboard from './components/Dashboard';
import FinanceDashboard from './components/FinanceDashboard';
import PersianCalendar from './components/PersianCalendar';
import AMLogo from './components/AMLogo';
import { getMotivationalQuote } from './services/geminiService';

const DEFAULT_FINANCE_DATA: FinanceData = {
  income: [{ id: '1', label: 'حقوق/درآمد', budget: 0, actual: 0 }],
  expenses: [{ id: '1', label: 'اجاره/هزینه ثابت', budget: 0, actual: 0 }],
  bills: [],
  debt: [],
  savings: [],
  dailyTransactions: []
};

const DEFAULT_WEEK_DATA: WeekData = {
  quote: "تلاش امروز، آرامش فرداست.",
  reminders: [],
  habits: [
    { id: '1', name: 'ورزش روزانه', checks: Array(7).fill(false) },
    { id: '2', name: 'مطالعه کتاب', checks: Array(7).fill(false) },
    { id: '3', name: 'نوشیدن آب کافی', checks: Array(7).fill(false) }
  ],
  assignments: [],
  finance: DEFAULT_FINANCE_DATA,
  days: {}
};

const createInitialDay = (): DayData => ({
  priorities: ['', '', '', '', ''],
  events: [],
  tasks: []
});

const App: React.FC = () => {
  const [view, setView] = useState<'planner' | 'dashboard' | 'finance'>('planner');
  const [weekOffset, setWeekOffset] = useState(0);
  const [data, setData] = useState<WeekData>(DEFAULT_WEEK_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('');

  const weekKey = getWeekRangeKey(weekOffset);

  useEffect(() => {
    const saved = localStorage.getItem(weekKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({ 
          ...DEFAULT_WEEK_DATA, 
          ...parsed,
          finance: { ...DEFAULT_FINANCE_DATA, ...parsed.finance },
          days: parsed.days || {}
        });
      } catch (e) {
        setData(DEFAULT_WEEK_DATA);
      }
    } else {
      setData(DEFAULT_WEEK_DATA);
    }
    setLastSavedTime(new Date().toLocaleTimeString('fa-IR'));
  }, [weekKey]);

  const saveData = useCallback(() => {
    setIsSaving(true);
    localStorage.setItem(weekKey, JSON.stringify(data));
    setTimeout(() => {
      setIsSaving(false);
      setLastSavedTime(new Date().toLocaleTimeString('fa-IR'));
    }, 500);
  }, [data, weekKey]);

  const updateDayData = (dayKey: string, dayData: DayData) => {
    setData(prev => ({
      ...prev,
      days: { ...prev.days, [dayKey]: dayData }
    }));
  };

  const generateAiQuote = async () => {
    setIsAiLoading(true);
    const allTasks = Object.values(data.days).flatMap(d => d.tasks.map(t => t.text)).filter(t => t);
    const quote = await getMotivationalQuote(allTasks);
    setData(prev => ({ ...prev, quote }));
    setIsAiLoading(false);
  };

  const resetWeek = () => {
    if (confirm('آیا از پاک‌سازی اطلاعات این هفته اطمینان دارید؟')) {
      setData(DEFAULT_WEEK_DATA);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planner-${weekKey}.json`;
    a.click();
  };

  const exportPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <AMLogo size={32} className="text-indigo-600" />
              <h1 className="text-xl font-black text-indigo-600">پلنر هوشمند</h1>
            </div>
            
            <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setView('planner')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${view === 'planner' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <CalendarDays size={16} /> برنامه‌ریزی هفتگی
              </button>
              <button 
                onClick={() => setView('dashboard')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${view === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <LayoutDashboard size={16} /> تکالیف و اولویت‌ها
              </button>
              <button 
                onClick={() => setView('finance')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${view === 'finance' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <CircleDollarSign size={16} /> مدیریت مالی
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <button onClick={() => setWeekOffset(prev => prev - 1)} className="p-1 hover:bg-white rounded transition-colors"><ChevronRight size={18} /></button>
              <span className="text-[10px] font-black text-slate-600 min-w-[100px] text-center">{formatDateFA(getStartOfWeek(weekOffset))}</span>
              <button onClick={() => setWeekOffset(prev => prev + 1)} className="p-1 hover:bg-white rounded transition-colors"><ChevronLeft size={18} /></button>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={saveData} title="ذخیره" className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
                {isSaving ? <CloudCheck className="animate-bounce" size={20} /> : <Save size={20} />}
              </button>
              <button onClick={exportPdf} title="خروجی PDF" className="bg-white border border-slate-200 p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all">
                <FileText size={20} />
              </button>
              <button onClick={exportJson} title="خروجی JSON" className="bg-white border border-slate-200 p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"><Download size={20} /></button>
              <button onClick={resetWeek} title="پاک‌سازی هفته" className="bg-white border border-slate-200 p-2 rounded-xl text-rose-400 hover:bg-rose-50 transition-all"><Trash2 size={20} /></button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 lg:p-6 max-w-[1800px] mx-auto w-full">
        {view === 'planner' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Sidebar Stats/Habits */}
            <div className="xl:col-span-3 space-y-6">
              <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-center justify-between mb-4">
                  <AMLogo size={28} className="text-white/90" />
                  <Quote size={32} className="opacity-20" />
                </div>
                <p className="text-sm font-bold leading-relaxed relative z-10 italic">
                  {isAiLoading ? 'در حال دریافت انرژی از هوش مصنوعی...' : data.quote}
                </p>
                <button 
                  onClick={generateAiQuote}
                  disabled={isAiLoading}
                  className="mt-6 w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-black backdrop-blur-sm transition-all flex items-center justify-center gap-2 no-print"
                >
                  <Sparkles size={14} /> بازنویسی با هوش مصنوعی
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <HabitTracker 
                  habits={data.habits} 
                  onUpdate={(habits) => setData(prev => ({ ...prev, habits }))} 
                />
              </div>

              <div className="no-print">
                <PersianCalendar />
              </div>
            </div>

            {/* Daily Grid */}
            <div className="xl:col-span-9 flex flex-row overflow-x-auto gap-4 pb-4 no-scrollbar">
              {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'].map((day, i) => {
                const date = new Date(getStartOfWeek(weekOffset));
                date.setDate(date.getDate() + i);
                const dayKey = `day_${i}`;
                const colors = [
                  'bg-rose-100', 'bg-amber-100', 'bg-emerald-100', 
                  'bg-indigo-100', 'bg-cyan-100', 'bg-violet-100', 'bg-slate-100'
                ];
                const dayEnNames = ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

                return (
                  <DayCard
                    key={day}
                    dayName={day}
                    dayNameEn={dayEnNames[i]}
                    data={data.days[dayKey] || createInitialDay()}
                    date={date}
                    onUpdate={(d) => updateDayData(dayKey, d)}
                    colorClass={colors[i]}
                  />
                );
              })}
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <Dashboard 
            assignments={data.assignments} 
            onUpdate={(assignments) => setData(prev => ({ ...prev, assignments }))} 
          />
        )}

        {view === 'finance' && (
          <FinanceDashboard 
            data={data.finance} 
            onUpdate={(finance) => setData(prev => ({ ...prev, finance }))} 
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="bg-white border-t border-slate-100 p-4 no-print">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-[10px] text-slate-400 font-bold">
          <span>آخرین ذخیره‌سازی: {lastSavedTime}</span>
          <span>پلنر هوشمند هفتگی &copy; ۱۴۰۳</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
