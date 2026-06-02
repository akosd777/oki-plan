/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Plus, Trash2, Coins, ArrowRight, BarChart2 } from 'lucide-react';
import { BudgetItem } from '../types';

interface BudgetCalculatorProps {
  totalBudget: number;
  setTotalBudget: (budget: number) => void;
  budgetList: BudgetItem[];
  onAddBudgetItem: (title: string, category: BudgetItem['category'], amount: number) => void;
  onDeleteBudgetItem: (id: string) => void;
}

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  totalBudget,
  setTotalBudget,
  budgetList,
  onAddBudgetItem,
  onDeleteBudgetItem,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<BudgetItem['category']>('식비');
  const [newAmount, setNewAmount] = useState<string>('');
  const [isEditingCap, setIsEditingCap] = useState(false);
  const [customCapVal, setCustomCapVal] = useState<string>(totalBudget.toString());

  const categories: BudgetItem['category'][] = ['항공', '숙박', '교통', '식비', '쇼핑', '액티비티', '기타'];

  const categoryIcons: Record<BudgetItem['category'], string> = {
    항공: '✈️',
    숙박: '🏨',
    교통: '🚗',
    식비: '🍴',
    쇼핑: '🛍️',
    액티비티: '🏄',
    기타: '📦',
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount) return;
    const amountVal = parseFloat(newAmount);
    if (!amountVal || amountVal <= 0) return;

    onAddBudgetItem(newTitle.trim(), newCategory, amountVal);
    setNewTitle('');
    setNewAmount('');
  };

  const handleSaveBudgetCap = () => {
    const val = parseFloat(customCapVal);
    if (val && val >= 0) {
      setTotalBudget(val);
      setIsEditingCap(false);
    }
  };

  const totalSpent = budgetList.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const spentPercent = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;

  // Compute stats per category
  const categorySpending = categories.reduce((acc, cat) => {
    const sum = budgetList.filter(item => item.category === cat).reduce((s, i) => s + i.amount, 0);
    acc[cat] = sum;
    return acc;
  }, {} as Record<BudgetItem['category'], number>);

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Upper Budget Dashboard Wallet */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-3xl p-5 shadow-2xl">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold flex items-center gap-1.5 leading-none text-cyan-200">
            <Coins size={14} className="text-cyan-300" />
            오키나와 총 여행 예산
          </span>
          <button
            onClick={() => {
              setCustomCapVal(totalBudget.toString());
              setIsEditingCap(!isEditingCap);
            }}
            className="bg-white/15 hover:bg-white/25 border border-white/15 text-[10px] px-2.5 py-1 rounded-xl font-bold transition cursor-pointer"
          >
            {isEditingCap ? '취소' : '수정'}
          </button>
        </div>

        {isEditingCap ? (
          <div className="mt-3 flex gap-2">
            <input
              id="budget-cap-input"
              type="number"
              value={customCapVal}
              onChange={(e) => setCustomCapVal(e.target.value)}
              className="flex-1 text-slate-805 bg-white px-3 py-1.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyan-300 text-slate-900"
            />
            <button
              onClick={handleSaveBudgetCap}
              className="bg-cyan-300 hover:bg-cyan-400 text-cyan-950 font-black text-xs px-3.5 py-1.5 rounded-xl transition cursor-pointer"
            >
              저장
            </button>
          </div>
        ) : (
          <div className="mt-3">
            <h2 className="text-2xl font-black font-display text-white">
              ₩{totalBudget.toLocaleString()}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10 bg-white/5 -mx-5 -mb-5 p-5 rounded-b-3xl">
          <div>
            <span className="text-[10px] text-cyan-200 font-bold uppercase tracking-wide">총 지출 금액</span>
            <p className="text-base font-extrabold mt-0.5 text-white">₩{totalSpent.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-[10px] text-cyan-200 font-bold uppercase tracking-wide">남은 예산</span>
            <p className={`text-base font-extrabold mt-0.5 ${remainingBudget < 0 ? 'text-rose-300 font-black' : 'text-cyan-300 font-black'}`}>
              ₩{remainingBudget.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Spending Warning Progress Indicator */}
      <div className="bg-white/10 border border-white/15 p-4.5 rounded-3xl shadow-xl text-white">
        <div className="flex justify-between text-xs mb-2">
          <span className="font-bold text-white/70">예산 소모 진도율</span>
          <span className={`font-black ${spentPercent > 90 ? 'text-rose-300' : 'text-cyan-300'}`}>
            {spentPercent}% 사용 완료
          </span>
        </div>
        <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${spentPercent}%` }}
            className={`h-full ${spentPercent > 90 ? 'bg-rose-450 bg-gradient-to-r from-rose-400 to-rose-500' : 'bg-cyan-305 bg-gradient-to-r from-cyan-300 to-teal-300'} rounded-full`}
          />
        </div>
        {remainingBudget < 0 && (
          <div className="flex gap-2 items-center mt-3">
            <span className="text-[8px] font-black bg-rose-500/20 border border-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full">
              예산 초과 경고 ⚠️
            </span>
            <span className="text-[10px] text-rose-250 font-semibold text-rose-200">설정한 예산 금액 한도를 초과했습니다!</span>
          </div>
        )}
      </div>

      {/* New Spend Form */}
      <div className="bg-white/5 border border-white/15 rounded-3xl p-4 shadow-xl">
        <h4 className="text-xs font-bold text-cyan-250 mb-3 flex items-center gap-1.5 text-cyan-250 text-cyan-100">
          <Wallet size={12} className="text-cyan-300" />
          예산 소비 항목 등록
        </h4>
        <form onSubmit={handleCreateExpense} className="flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-white/50">지출 품목</label>
              <input
                id="budget-item-title"
                type="text"
                placeholder="예: 아구 가마샤브"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-bold text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:bg-white/15 transition"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-white/50">지출 금액 (₩)</label>
              <input
                id="budget-item-amount"
                type="number"
                placeholder="예: 32000"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-bold text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:bg-white/15 transition"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 flex-1 select-none scrollbar-none">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setNewCategory(cat)}
                  className={`text-[10px] px-2.5 py-1 font-bold rounded-lg border shrink-0 transition cursor-pointer ${
                    newCategory === cat
                      ? 'bg-cyan-300 border-cyan-300 text-cyan-950 font-bold shadow-md'
                      : 'border-white/15 text-white/70 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  {categoryIcons[cat]} {cat}
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-white hover:bg-cyan-50 text-cyan-950 font-black rounded-xl text-xs shrink-0 transition cursor-pointer flex items-center justify-center gap-1 shadow-md"
            >
              <Plus size={12} className="stroke-[2.5px]" />
              등록
            </button>
          </div>
        </form>
      </div>

      {/* Category Breakdown Tracker */}
      <div className="bg-white/10 border border-white/15 p-5 rounded-3xl shadow-2xl text-white">
        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
          <BarChart2 size={14} className="text-cyan-350 text-cyan-300" />
          카테고리별 지출 요약 통계
        </h4>
        <div className="flex flex-col gap-3.5 mt-4">
          {categories.map((cat) => {
            const sum = categorySpending[cat] || 0;
            const percent = totalSpent > 0 ? Math.round((sum / totalSpent) * 100) : 0;
            return (
              <div key={cat} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-white/80">{categoryIcons[cat]} {cat}</span>
                  <span className="text-white font-bold">
                    ₩{sum.toLocaleString()} <span className="text-cyan-200/50">({percent}%)</span>
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div style={{ width: `${percent}%` }} className="h-full bg-cyan-300 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense ledger list / 소비로그 */}
      <div>
        <h3 className="font-extrabold text-white text-sm pl-1 mb-3">지출 명세 장부 ({budgetList.length}건)</h3>
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {budgetList.length > 0 ? (
              budgetList.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.15 }}
                  className="bg-white/10 border border-white/15 rounded-2xl p-3 px-4 shadow-xl flex justify-between items-center text-white"
                >
                  <div className="flex gap-3 items-center">
                    <span className="text-lg bg-white/10 p-1.5 rounded-xl w-8 h-8 flex items-center justify-center border border-white/10 text-white">
                      {categoryIcons[item.category] || '📦'}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-xs">{item.title}</h4>
                      <p className="text-[9px] text-cyan-100/50 font-bold uppercase tracking-wider">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white font-display">
                      ₩{item.amount.toLocaleString()}
                    </span>
                    <button
                      id={`budget-delete-${item.id}`}
                      onClick={() => onDeleteBudgetItem(item.id)}
                      className="p-1 px-2.5 hover:bg-rose-500/10 text-white/30 hover:text-rose-350 hover:text-rose-300 transition shrink-0 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-3xl border border-dashed border-white/15 text-center">
                <span className="text-3xl filter drop-shadow-sm">🎫</span>
                <h5 className="font-bold text-white text-xs mt-3">아직 작성한 가계부 항목이 없습니다</h5>
                <p className="text-[10px] text-cyan-100/60 mt-1">위의 폼을 채워 소중한지출 내역을 적어보세요.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
