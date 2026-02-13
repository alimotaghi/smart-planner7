
import React, { useState } from 'react';
import { Assignment, AssignmentStatus, AssignmentPriority, AssignmentType } from '../types';
import { Trash2, Plus, Calendar, Clock, AlertCircle, CheckCircle2, BarChart3, Filter, Tag, Bell } from 'lucide-react';

interface DashboardProps {
  assignments: Assignment[];
  onUpdate: (assignments: Assignment[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ assignments, onUpdate }) => {
  const [typeFilter, setTypeFilter] = useState<AssignmentType | 'all'>('all');
  
  const todayStr = new Date().toISOString().split('T')[0];

  const calculateRemainingDays = (dueDate: string) => {
    if (!dueDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dueDate);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.status === 'ارسال شده').length,
    pending: assignments.filter(a => a.status !== 'ارسال شده').length,
    highPriority: assignments.filter(a => a.priority === 'زیاد' && a.status !== 'ارسال شده').length
  };

  const filteredAssignments = assignments.filter(a => typeFilter === 'all' || a.type === typeFilter);

  const addAssignment = () => {
    const newA: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      className: '',
      title: '',
      type: 'تکلیف',
      description: '',
      priority: 'متوسط',
      status: 'شروع نشده',
      dueDate: todayStr,
      deadlineTime: '23:59',
      grade: 'NA'
    };
    onUpdate([newA, ...assignments]);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    onUpdate(assignments.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAssignment = (id: string) => {
    if(confirm('تکلیف حذف شود؟')) onUpdate(assignments.filter(a => a.id !== id));
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  const assignmentTypes: (AssignmentType | 'all')[] = ['all', 'تکلیف', 'کوییز', 'امتحان', 'پروژه', 'کنفرانس', 'خواندن'];
  const selectableTypes: AssignmentType[] = ['تکلیف', 'کوییز', 'امتحان', 'پروژه', 'کنفرانس', 'خواندن'];
  const priorities: AssignmentPriority[] = ['زیاد', 'متوسط', 'کم'];
  const statuses: AssignmentStatus[] = ['شروع نشده', 'در حال انجام', 'ارسال شده', 'تعویق شده'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'کل تکالیف', value: stats.total, color: 'border-indigo-400', text: 'text-indigo-600' },
          { label: 'تکمیل شده', value: stats.completed, color: 'border-emerald-400', text: 'text-emerald-600' },
          { label: 'در انتظار', value: stats.pending, color: 'border-rose-400', text: 'text-rose-600' },
          { label: 'اولویت بالا', value: stats.highPriority, color: 'border-amber-400', text: 'text-amber-600' }
        ].map((s, i) => (
          <div key={i} className={`bg-white border-b-4 ${s.color} p-5 rounded-2xl shadow-sm text-center`}>
            <span className="text-[10px] font-black text-slate-400 uppercase">{s.label}</span>
            <div className={`text-2xl font-black ${s.text}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1">
            {assignmentTypes.map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all border whitespace-nowrap ${typeFilter === type ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
              >
                {type === 'all' ? 'همه دسته‌ها' : type}
              </button>
            ))}
          </div>
          <button onClick={addAssignment} className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 shadow-lg active:scale-95 shrink-0">
            <Plus size={18} /> افزودن تکلیف جدید
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                <th className="p-4">نام درس</th>
                <th className="p-4">شرح تکلیف</th>
                <th className="p-4">نوع</th>
                <th className="p-4 text-center">اولویت</th>
                <th className="p-4 text-center">وضعیت</th>
                <th className="p-4">ددلاین</th>
                <th className="p-4 text-center">باقی‌مانده</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAssignments.map((item) => {
                const remaining = calculateRemainingDays(item.dueDate);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 group transition-colors">
                    <td className="p-4">
                      <input type="text" value={item.className} onChange={e => updateAssignment(item.id, { className: e.target.value })} className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none font-bold text-slate-700" placeholder="درس..." />
                    </td>
                    <td className="p-4">
                      <input type="text" value={item.title} onChange={e => updateAssignment(item.id, { title: e.target.value })} className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none text-slate-500" placeholder="شرح..." />
                    </td>
                    <td className="p-4">
                      <select 
                        value={item.type} 
                        onChange={e => updateAssignment(item.id, { type: e.target.value as AssignmentType })}
                        className="bg-slate-100 px-2 py-1 rounded-lg text-[9px] font-black border-none outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer"
                      >
                        {selectableTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <select 
                        value={item.priority} 
                        onChange={e => updateAssignment(item.id, { priority: e.target.value as AssignmentPriority })}
                        className={`px-3 py-1 rounded-full text-[9px] font-black border-none outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer ${
                          item.priority === 'زیاد' ? 'bg-rose-100 text-rose-600' : 
                          item.priority === 'متوسط' ? 'bg-amber-100 text-amber-600' : 
                          'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <select 
                        value={item.status} 
                        onChange={e => updateAssignment(item.id, { status: e.target.value as AssignmentStatus })}
                        className={`px-3 py-1 rounded-full text-[9px] font-bold border-none outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer ${
                          item.status === 'ارسال شده' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                          item.status === 'در حال انجام' ? 'bg-indigo-50 text-indigo-600' :
                          'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <input type="date" value={item.dueDate} onChange={e => updateAssignment(item.id, { dueDate: e.target.value })} className="bg-transparent border-none text-[10px] outline-none font-bold text-slate-500" />
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-lg font-black text-[9px] ${remaining <= 1 && item.status !== 'ارسال شده' ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-50 text-slate-500'}`}>
                        {remaining === 0 ? 'امروز' : remaining === 1 ? 'فردا' : remaining < 0 ? 'گذشته' : `${remaining} روز`}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => deleteAssignment(item.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredAssignments.length === 0 && (
            <div className="p-16 text-center text-slate-300 font-bold italic">لیست تکالیف خالی است</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
