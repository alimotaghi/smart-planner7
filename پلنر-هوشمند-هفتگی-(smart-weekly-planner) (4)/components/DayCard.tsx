
import React from 'react';
import { Trash2, Plus, CheckSquare, Square, Clock } from 'lucide-react';
import { DayData, Task, Event } from '../types';

interface DayCardProps {
  dayName: string;
  dayNameEn: string;
  data: DayData;
  date: Date;
  onUpdate: (updated: DayData) => void;
  colorClass: string;
}

const DayCard: React.FC<DayCardProps> = ({ dayName, dayNameEn, data, date, onUpdate, colorClass }) => {
  const updatePriority = (idx: number, val: string) => {
    const newPriorities = [...(data.priorities || [])];
    while (newPriorities.length < 5) newPriorities.push('');
    newPriorities[idx] = val;
    onUpdate({ ...data, priorities: newPriorities });
  };

  const addTask = () => {
    const newTask: Task = { id: Math.random().toString(36).substr(2, 9), text: '', completed: false };
    onUpdate({ ...data, tasks: [...(data.tasks || []), newTask] });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    onUpdate({ ...data, tasks: data.tasks.map(t => t.id === id ? { ...t, ...updates } : t) });
  };

  const removeTask = (id: string) => {
    onUpdate({ ...data, tasks: data.tasks.filter(t => t.id !== id) });
  };

  const addEvent = () => {
    const newEvent: Event = { id: Math.random().toString(36).substr(2, 9), time: '09:00', text: '' };
    onUpdate({ ...data, events: [...(data.events || []), newEvent] });
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    onUpdate({ ...data, events: data.events.map(e => e.id === id ? { ...e, ...updates } : e) });
  };

  const removeEvent = (id: string) => {
    onUpdate({ ...data, events: data.events.filter(e => e.id !== id) });
  };

  const completedTasks = data.tasks?.filter(t => t.completed).length || 0;
  const totalTasks = data.tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const priorities = data.priorities || ['', '', '', '', ''];

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 min-w-[300px]">
      {/* Day Header */}
      <div className={`${colorClass} p-3 text-center border-b border-slate-200`}>
        <div className="text-xs font-black uppercase tracking-widest text-slate-700">{dayNameEn}</div>
      </div>
      <div className="p-2 text-center border-b border-slate-200 bg-slate-50/50">
        <div className="text-[10px] font-bold text-slate-500">
          {new Intl.DateTimeFormat('fa-IR', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)}
        </div>
      </div>

      {/* Priorities Section */}
      <div className="p-3 border-b border-slate-200 bg-white">
        <h4 className="text-[11px] font-black text-slate-800 mb-3 text-center bg-slate-100 py-1 rounded">اولویت‌های امروز</h4>
        <div className="space-y-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 w-3">{i + 1}</span>
              <input
                type="text"
                value={priorities[i] || ''}
                onChange={(e) => updatePriority(i, e.target.value)}
                placeholder="..."
                className="flex-grow bg-transparent border-b border-slate-100 text-[11px] outline-none focus:border-indigo-300 py-0.5"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Events Section - Improved time input width */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/30 flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-[11px] font-black text-slate-800 text-center flex-grow bg-slate-100 py-1 rounded">اتفاقات مهم</h4>
          <button onClick={addEvent} className="p-1 hover:bg-slate-200 rounded text-slate-400 mr-1"><Plus size={12}/></button>
        </div>
        <div className="space-y-2 max-h-[150px] overflow-y-auto">
          {data.events?.map(event => (
            <div key={event.id} className="flex items-center gap-2 group">
              <input 
                type="time" 
                value={event.time} 
                onChange={e => updateEvent(event.id, { time: e.target.value })}
                className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 p-1 rounded outline-none w-[85px] shrink-0"
              />
              <input 
                type="text" 
                value={event.text} 
                onChange={e => updateEvent(event.id, { text: e.target.value })}
                placeholder="رویداد..."
                className="flex-grow bg-transparent border-none text-[10px] outline-none min-w-0"
              />
              <button onClick={() => removeEvent(event.id)} className="opacity-0 group-hover:opacity-100 text-rose-300 shrink-0"><Trash2 size={12}/></button>
            </div>
          ))}
          {(!data.events || data.events.length === 0) && (
            <div className="text-[9px] text-slate-300 text-center py-2">رویدادی ثبت نشده</div>
          )}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="p-3 flex-grow flex flex-col bg-white">
        <div className="flex justify-between items-center mb-2 bg-slate-100 py-1 px-2 rounded">
          <h4 className="text-[11px] font-black text-slate-800">وظایف</h4>
          <div className="text-[10px] font-black text-indigo-600">{progress}%</div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100 rounded-full mb-4 overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="space-y-2 flex-grow overflow-y-auto pr-1">
          {data.tasks?.map(task => (
            <div key={task.id} className="group flex items-start gap-2 border-b border-slate-50 pb-1">
              <button onClick={() => updateTask(task.id, { completed: !task.completed })} className="mt-0.5">
                {task.completed ? <CheckSquare size={14} className="text-emerald-500" /> : <Square size={14} className="text-slate-300" />}
              </button>
              <textarea
                value={task.text}
                onChange={e => updateTask(task.id, { text: e.target.value })}
                placeholder="کار جدید..."
                rows={1}
                className={`flex-grow bg-transparent border-none resize-none text-[11px] outline-none ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}
              />
              <button onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500"><Trash2 size={12}/></button>
            </div>
          ))}
          <button onClick={addTask} className="w-full py-1 border border-dashed border-slate-200 rounded text-[10px] text-slate-400 hover:bg-slate-50 flex items-center justify-center gap-1">
            <Plus size={12}/> افزودن وظیفه
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayCard;
