/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, Square, Trash2, Plus, Sparkles, FolderKanban } from 'lucide-react';
import { ChecklistItem } from '../types';

interface ChecklistProps {
  checklist: ChecklistItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (title: string, category: ChecklistItem['category']) => void;
  onDeleteItem: (id: string) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({
  checklist,
  onToggleItem,
  onAddItem,
  onDeleteItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('전체');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ChecklistItem['category']>('기타');

  const categories: { label: string; value: string }[] = [
    { label: '전체', value: '전체' },
    { label: '📌 필수', value: '필수' },
    { label: '👕 의류', value: '의류' },
    { label: '🧴 세면도구', value: '세면도구' },
    { label: '🔋 전자기기', value: '전자기기' },
    { label: '🩹 비상약', value: '비상약' },
    { label: '📦 기타', value: '기타' },
  ];

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    onAddItem(newItemTitle.trim(), newItemCategory);
    setNewItemTitle('');
  };

  const filteredItems = activeCategory === '전체'
    ? checklist
    : checklist.filter(item => item.category === activeCategory);

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Visual Status Progress Banner */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-3xl p-5 shadow-2xl">
        <h3 className="font-bold text-sm flex items-center gap-1.5 leading-none">
          <FolderKanban size={15} className="text-cyan-300 stroke-[2.5px]" />
          여행 짐싸기 진행 상태
        </h3>
        <div className="flex justify-between items-baseline mt-4 mb-2">
          <span className="text-2xl font-black font-display text-white">{progressPercent}%</span>
          <span className="text-xs font-semibold text-cyan-200">
            {completedCount}개 완료 / ({totalCount}개 중)
          </span>
        </div>
        <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-cyan-300 rounded-full shadow-sm"
          />
        </div>
        <p className="text-[10px] text-cyan-100/80 mt-2.5 leading-relaxed font-semibold">
          *여권과 면허증, 110V 변환 플러그는 비행기 탑승 전 반드시 2차 점검해두세요.
        </p>
      </div>

      {/* Quick Custom Packing Add Form Card */}
      <div className="bg-white/5 border border-white/15 rounded-3xl p-4 shadow-xl">
        <h4 className="text-xs font-bold text-cyan-200 mb-3 flex items-center gap-1">
          <Sparkles size={11} className="text-cyan-300 animate-pulse" />
          준비물 직접 추가
        </h4>
        <form onSubmit={handleCreateItem} className="flex flex-col gap-2.5">
          <div className="flex gap-2">
            <input
              id="checklist-item-title"
              type="text"
              placeholder="예: 멀미 패치, 충전 젠더, 귀마개 등"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-bold text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:bg-white/15 transition"
            />
            <button
              type="submit"
              className="px-4.5 bg-cyan-300 hover:bg-cyan-400 active:scale-98 text-cyan-950 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 shrink-0 shadow-md"
            >
              <Plus size={14} className="stroke-[2.5px]" />
              추가
            </button>
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-[10px] font-bold text-white/50 mr-1 shrink-0">카테고리:</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
              {(categories.slice(1) as { label: string; value: ChecklistItem['category'] }[]).map((cat) => (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setNewItemCategory(cat.value)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition cursor-pointer font-bold ${
                    newItemCategory === cat.value
                      ? 'border-cyan-350 text-cyan-950 bg-cyan-300'
                      : 'border-white/15 text-white/70 hover:border-white/25 hover:bg-white/5'
                  }`}
                >
                  {cat.label.split(' ')[1] || cat.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Horizontal Category Filters */}
      <div className="flex gap-1.5 overflow-x-auto py-1 max-w-full select-none">
        {categories.map((c) => (
          <button
            key={c.value}
            id={`filter-${c.value}`}
            onClick={() => setActiveCategory(c.value)}
            className={`text-[10px] px-3.5 py-1.5 rounded-xl border shrink-0 font-bold transition duration-200 cursor-pointer ${
              activeCategory === c.value
                ? 'bg-cyan-300 border-cyan-300 text-cyan-950 shadow-md'
                : 'bg-white/10 border-white/15 text-white/80 hover:bg-white/15'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Item Container list */}
      <div className="flex flex-col gap-2.5 mt-1">
        <AnimatePresence initial={false}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.18 }}
                className={`flex justify-between items-center border rounded-2xl px-4 py-3 shadow-xl transition duration-150 ${
                  item.completed 
                    ? 'bg-white/5 border-white/10 text-white/40' 
                    : 'bg-white/10 border-white/15 text-white hover:bg-white/15'
                }`}
              >
                <div
                  id={`item-toggle-${item.id}`}
                  onClick={() => onToggleItem(item.id)}
                  className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                >
                  {item.completed ? (
                    <span className="text-cyan-300">
                      <CheckSquare size={18} className="stroke-[2.5px]" />
                    </span>
                  ) : (
                    <span className="text-white/30">
                      <Square size={18} className="stroke-2" />
                    </span>
                  )}
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${
                      item.completed ? 'line-through text-white/40 font-medium' : 'text-white'
                    }`}>
                      {item.title}
                    </span>
                    <span className="text-[9px] font-bold text-cyan-200/50 mt-0.5">
                      {item.category}
                    </span>
                  </div>

                </div>

                {item.isCustom && (
                  <button
                    id={`item-delete-${item.id}`}
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1 px-2.5 hover:bg-rose-500/10 rounded-lg text-white/30 hover:text-rose-350 hover:text-rose-300 transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-3xl border border-dashed border-white/15 text-center">
              <span className="text-3xl filter drop-shadow-sm">🧳</span>
              <h5 className="font-bold text-white text-xs mt-3">담겨 있는 준비물이 없어요</h5>
              <p className="text-[10px] text-cyan-100/60 mt-1">다른 카테고리를 찾거나 직접 준비물을 채워보세요.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
