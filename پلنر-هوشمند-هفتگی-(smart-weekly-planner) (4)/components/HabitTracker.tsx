
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onUpdate: (habits: Habit[]) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onUpdate }) => {
  const toggleCheck = (habitId: string, dayIdx: number) => {
    onUpdate(habits.map(h => {
      if (h.id === habitId) {
        const newChecks = [...(h.checks || Array(7).fill(false))];
        newChecks[dayIdx] = !newChecks[dayIdx];
        return { ...h, checks: newChecks };
      }
      return h;
    }));
  };

  const removeHabit = (id: string) => onUpdate(habits.filter(h => h.id !== id));
  const addHabit = () => {
    onUpdate([...habits, { id: Math.random().toString(36).substr(2, 9), name: 'عادت جدید', checks: Array(7).fill(false) }]);
  };

  const totalChecks = habits.reduce((acc, h) => acc + (h.checks?.filter(c => c).length || 0), 0);
  const totalPossible = habits.length * 7;
  const progress = totalPossible > 0 ? Math.round((totalChecks / totalPossible) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="bg-[#F9FBE7] py-1 text-center font-black text-[11px] rounded border border-slate-100 flex justify-between px-2 items-center">
        <span>عادات هفتگی</span>
        <button onClick={addHabit} className="text-emerald-600"><Plus size={12}/></button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="text-[8px] font-black text-slate-400">
              <th className="text-right">نام</th>
              <th>ش</th><th>ی</th><th>د</th><th>س</th><th>چ</th><th>پ</th><th>ج</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id} className="group border-b border-slate-50">
                <td className="text-right py-1">
                  <input 
                    type="text" 
                    value={habit.name} 
                    onChange={e => onUpdate(habits.map(h => h.id === habit.id ? { ...h, name: e.target.value } : h))}
                    className="w-16 bg-transparent border-none text-[9px] outline-none text-slate-600 font-bold"
                  />
                </td>
                {Array.from({ length: 7 }).map((_, i) => (
                  <td key={i} className="px-0.5">
                    <input
                      type="checkbox"
                      checked={habit.checks?.[i] || false}
                      onChange={() => toggleCheck(habit.id, i)}
                      className="w-3 h-3 rounded border-slate-200 text-emerald-500"
                    />
                  </td>
                ))}
                <td>
                  <button onClick={() => removeHabit(habit.id)} className="opacity-0 group-hover:opacity-100 text-rose-200"><Trash2 size={10}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <div className="flex justify-between text-[9px] font-black text-slate-500 mb-1">
          <span>درصد تکمیل:</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
