
import React, { useState } from 'react';
import { FinanceData, FinanceItem, Transaction, WEEKDAY_NAMES_FA } from '../types';
import { Plus, Trash2, Wallet, TrendingUp, Receipt, PiggyBank, CreditCard, PieChart as PieChartIcon, Calendar, ArrowRightLeft, DollarSign } from 'lucide-react';

interface FinanceTableProps {
  title: string;
  category: keyof Omit<FinanceData, 'dailyTransactions'>;
  colorClass: string;
  items: FinanceItem[];
  onUpdateItem: (category: keyof Omit<FinanceData, 'dailyTransactions'>, id: string, updates: Partial<FinanceItem>) => void;
  onRemoveItem: (category: keyof Omit<FinanceData, 'dailyTransactions'>, id: string) => void;
  onAddItem: (category: keyof Omit<FinanceData, 'dailyTransactions'>) => void;
}

const FinanceTable: React.FC<FinanceTableProps> = ({ title, category, colorClass, items, onUpdateItem, onRemoveItem, onAddItem }) => (
  <div className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex-1`}>
    <div className={`${colorClass} p-3 text-center border-b border-slate-200 flex justify-between items-center px-4`}>
      <span className="font-black text-xs">{title}</span>
      <button onClick={() => onAddItem(category)} className="bg-white/50 hover:bg-white p-1 rounded-md transition-colors"><Plus size={14}/></button>
    </div>
    <table className="w-full text-right text-[10px]">
      <thead>
        <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
          <th className="p-2">دسته بندی</th>
          <th className="p-2 text-center">بودجه (تومان)</th>
          <th className="p-2 text-center">واقعی (تومان)</th>
          <th className="p-2 text-center">% مانده</th>
          <th className="w-8"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {items.map(item => {
          const remainingPercent = item.budget > 0 ? Math.max(0, ((item.budget - item.actual) / item.budget) * 100).toFixed(1) : "0.0";
          return (
            <tr key={item.id} className="group hover:bg-slate-50">
              <td className="p-2">
                <input 
                  type="text" 
                  value={item.label} 
                  onChange={e => onUpdateItem(category, item.id, { label: e.target.value })}
                  placeholder="نام..."
                  className="w-full bg-transparent border-none p-0 outline-none text-slate-700 font-bold"
                />
              </td>
              <td className="p-2">
                <input 
                  type="number" 
                  value={item.budget === 0 ? '' : item.budget} 
                  onChange={e => onUpdateItem(category, item.id, { budget: e.target.value === '' ? 0 : Number(e.target.value) })}
                  placeholder="0"
                  className="w-full bg-transparent border-none p-0 text-center outline-none text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </td>
              <td className="p-2">
                <input 
                  type="number" 
                  value={item.actual === 0 ? '' : item.actual} 
                  onChange={e => onUpdateItem(category, item.id, { actual: e.target.value === '' ? 0 : Number(e.target.value) })}
                  placeholder="0"
                  className="w-full bg-transparent border-none p-0 text-center outline-none font-black text-slate-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </td>
              <td className="p-2 text-center text-[9px] text-slate-400 font-bold">{remainingPercent}%</td>
              <td className="p-2 text-center">
                <button onClick={() => onRemoveItem(category, item.id)} className="opacity-0 group-hover:opacity-100 text-rose-300 hover:text-rose-500 transition-all"><Trash2 size={12}/></button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

interface FinanceDashboardProps {
  data: FinanceData;
  onUpdate: (data: FinanceData) => void;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');

  const calculateTotal = (items: FinanceItem[]) => {
    return items.reduce((acc, item) => ({
      budget: acc.budget + (Number(item.budget) || 0),
      actual: acc.actual + (Number(item.actual) || 0)
    }), { budget: 0, actual: 0 });
  };

  const dailyTotal = (data.dailyTransactions || []).reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totals = {
    income: calculateTotal(data.income),
    expenses: calculateTotal(data.expenses),
    bills: calculateTotal(data.bills),
    debt: calculateTotal(data.debt),
    savings: calculateTotal(data.savings),
  };

  const remainingToSpend = totals.income.actual - totals.expenses.actual - totals.bills.actual - totals.debt.actual - totals.savings.actual - dailyTotal;

  const addItem = (category: keyof Omit<FinanceData, 'dailyTransactions'>) => {
    const newItem: FinanceItem = { id: Math.random().toString(36).substr(2, 9), label: '', budget: 0, actual: 0 };
    onUpdate({ ...data, [category]: [...data[category], newItem] });
  };

  const updateItem = (category: keyof Omit<FinanceData, 'dailyTransactions'>, id: string, updates: Partial<FinanceItem>) => {
    onUpdate({
      ...data,
      [category]: data[category].map(item => item.id === id ? { ...item, ...updates } : item)
    });
  };

  const removeItem = (category: keyof Omit<FinanceData, 'dailyTransactions'>, id: string) => {
    onUpdate({
      ...data,
      [category]: data[category].filter(item => item.id !== id)
    });
  };

  const addTransaction = () => {
    const newT: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      dayIndex: 0,
      label: '',
      amount: 0,
      category: 'متفرقه'
    };
    onUpdate({ ...data, dailyTransactions: [newT, ...(data.dailyTransactions || [])] });
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    onUpdate({
      ...data,
      dailyTransactions: data.dailyTransactions.map(t => t.id === id ? { ...t, ...updates } : t)
    });
  };

  const removeTransaction = (id: string) => {
    onUpdate({
      ...data,
      dailyTransactions: data.dailyTransactions.filter(t => t.id !== id)
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary Header Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'درآمد کل', value: totals.income.actual, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'هزینه جاری', value: totals.expenses.actual + dailyTotal, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'قبوض', value: totals.bills.actual, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'بدهی ها', value: totals.debt.actual, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'پس انداز', value: totals.savings.actual, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { label: 'مانده نهایی', value: remainingToSpend, color: remainingToSpend >= 0 ? 'text-emerald-700' : 'text-rose-700', bg: remainingToSpend >= 0 ? 'bg-emerald-100' : 'bg-rose-100', highlight: true }
        ].map((card, i) => (
          <div key={i} className={`${card.bg} p-4 rounded-2xl border border-white shadow-sm flex flex-col items-center justify-center transition-transform hover:scale-105`}>
            <span className="text-[10px] font-black text-slate-400 uppercase mb-1">{card.label}</span>
            <span className={`text-sm font-black ${card.color}`}>{card.value.toLocaleString()} تومان</span>
          </div>
        ))}
      </div>

      {/* Tabs Switcher */}
      <div className="flex justify-center no-print">
        <div className="bg-slate-200 p-1 rounded-2xl flex gap-1 shadow-inner">
          <button 
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'daily' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Receipt size={14} /> مخارج روزانه (دفتر کل)
          </button>
          <button 
            onClick={() => setActiveTab('monthly')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Calendar size={14} /> بودجه‌بندی ماهانه
          </button>
        </div>
      </div>

      {activeTab === 'daily' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Daily Entry Form / Ledger */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <ArrowRightLeft size={18} className="text-indigo-500" /> لیست تراکنش‌های هفته
              </h3>
              <button 
                onClick={addTransaction}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-[10px] flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md active:scale-95 no-print"
              >
                <Plus size={14} /> ثبت هزینه جدید
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                    <th className="p-4">روز</th>
                    <th className="p-4">عنوان هزینه</th>
                    <th className="p-4">دسته</th>
                    <th className="p-4 text-center">مبلغ (تومان)</th>
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(data.dailyTransactions || []).map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 group">
                      <td className="p-4">
                        <select 
                          value={t.dayIndex} 
                          onChange={e => updateTransaction(t.id, { dayIndex: Number(e.target.value) })}
                          className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold outline-none cursor-pointer border-none"
                        >
                          {WEEKDAY_NAMES_FA.map((name, i) => <option key={i} value={i}>{name}</option>)}
                        </select>
                      </td>
                      <td className="p-4">
                        <input 
                          type="text" 
                          value={t.label} 
                          onChange={e => updateTransaction(t.id, { label: e.target.value })}
                          placeholder="مثلاً: کرایه تاکسی"
                          className="w-full bg-transparent border-none outline-none font-bold text-slate-700"
                        />
                      </td>
                      <td className="p-4">
                        <input 
                          type="text" 
                          value={t.category} 
                          onChange={e => updateTransaction(t.id, { category: e.target.value })}
                          placeholder="دسته..."
                          className="w-full bg-transparent border-none outline-none text-slate-400 text-[10px]"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input 
                          type="number" 
                          value={t.amount === 0 ? '' : t.amount} 
                          onChange={e => updateTransaction(t.id, { amount: e.target.value === '' ? 0 : Number(e.target.value) })}
                          placeholder="0"
                          className="w-32 bg-indigo-50 px-2 py-1 rounded text-center outline-none font-black text-indigo-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </td>
                      <td className="p-4">
                        <button onClick={() => removeTransaction(t.id)} className="opacity-0 group-hover:opacity-100 text-rose-300 hover:text-rose-500 transition-all no-print">
                          <Trash2 size={16}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(data.dailyTransactions || []).length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-300 italic font-bold">هنوز تراکنشی ثبت نکرده‌اید</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               <h3 className="text-sm font-black opacity-80 mb-1">جمع مخارج روزانه این هفته</h3>
               <div className="text-3xl font-black mb-4">{dailyTotal.toLocaleString()} <span className="text-xs">تومان</span></div>
               <div className="space-y-2">
                 {WEEKDAY_NAMES_FA.map((name, i) => {
                   const daySum = (data.dailyTransactions || []).filter(t => t.dayIndex === i).reduce((s, t) => s + (Number(t.amount) || 0), 0);
                   const dayPercent = dailyTotal > 0 ? (daySum / dailyTotal) * 100 : 0;
                   return (
                     <div key={i} className="flex flex-col gap-1">
                       <div className="flex justify-between text-[10px] font-bold">
                         <span>{name}</span>
                         <span>{daySum.toLocaleString()} تومان</span>
                       </div>
                       <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                         <div className="h-full bg-white transition-all duration-700" style={{ width: `${dayPercent}%` }}></div>
                       </div>
                     </div>
                   )
                 })}
               </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="text-xs font-black text-slate-800 mb-4 flex items-center gap-2"><DollarSign size={14} className="text-emerald-500" /> تحلیل مخارج</h4>
               <p className="text-[10px] leading-loose text-slate-500 font-bold">
                 میانگین مخارج روزانه شما در این هفته برابر با 
                 <span className="text-indigo-600 mx-1">{(dailyTotal / 7).toLocaleString()}</span> 
                 تومان است. 
                 {dailyTotal > (totals.expenses.budget / 4) ? " مخارج روزانه شما کمی بالاست، حواس‌تان به بودجه ماهانه باشد." : " مدیریت مالی روزانه شما عالی است!"}
               </p>
            </div>
          </div>
        </div>
      ) : (
        /* Monthly Budget View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-500" /> بودجه‌بندی ماهانه
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'درآمد', totals: totals.income, color: 'bg-emerald-500' },
                  { label: 'هزینه‌ها', totals: { ...totals.expenses, actual: totals.expenses.actual + dailyTotal }, color: 'bg-rose-500' },
                  { label: 'قبوض', totals: totals.bills, color: 'bg-indigo-500' },
                  { label: 'بدهی‌ها', totals: totals.debt, color: 'bg-amber-500' },
                  { label: 'پس‌انداز', totals: totals.savings, color: 'bg-cyan-500' },
                ].map((row, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>{row.label}</span>
                      <span>{row.totals.actual.toLocaleString()} / {row.totals.budget.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className={`h-full ${row.color} opacity-30`} style={{ width: `${(row.totals.budget / (totals.income.budget || 1)) * 100}%` }}></div>
                      <div className={`h-full ${row.color} -ml-full`} style={{ width: `${(row.totals.actual / (totals.income.budget || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center">
                <h4 className="text-xs font-bold text-slate-400 mb-4 w-full">توزیع بودجه کل</h4>
                <div className="w-32 h-32 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-50" strokeWidth="4" />
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-rose-400" strokeWidth="4" strokeDasharray="40 100" transform="rotate(-90 18 18)" />
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-400" strokeWidth="4" strokeDasharray="30 100" transform="rotate(54 18 18)" />
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-amber-400" strokeWidth="4" strokeDasharray="20 100" transform="rotate(162 18 18)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PieChartIcon className="text-slate-200" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-indigo-600 rounded-3xl p-6 text-white flex flex-col justify-center shadow-lg">
                <h4 className="text-xs font-black opacity-80 mb-2">وضعیت نقدینگی ماهانه:</h4>
                <div className="text-lg font-black">{remainingToSpend.toLocaleString()} تومان</div>
                <p className="text-[10px] leading-loose font-bold mt-1 opacity-90">
                  مازاد بودجه در دسترس شما برای سایر هزینه‌ها.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <FinanceTable title="درآمدها" category="income" colorClass="bg-emerald-100 text-emerald-800" items={data.income} onUpdateItem={updateItem} onRemoveItem={removeItem} onAddItem={addItem} />
            <FinanceTable title="هزینه‌های ثابت ماهانه" category="expenses" colorClass="bg-rose-100 text-rose-800" items={data.expenses} onUpdateItem={updateItem} onRemoveItem={removeItem} onAddItem={addItem} />
            <FinanceTable title="قبوض و اقساط" category="bills" colorClass="bg-indigo-100 text-indigo-800" items={data.bills} onUpdateItem={updateItem} onRemoveItem={removeItem} onAddItem={addItem} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FinanceTable title="بدهی‌ها" category="debt" colorClass="bg-amber-100 text-amber-800" items={data.debt} onUpdateItem={updateItem} onRemoveItem={removeItem} onAddItem={addItem} />
               <FinanceTable title="پس‌انداز" category="savings" colorClass="bg-cyan-100 text-cyan-800" items={data.savings} onUpdateItem={updateItem} onRemoveItem={removeItem} onAddItem={addItem} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;
