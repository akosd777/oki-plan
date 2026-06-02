/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Map, Sparkles, CheckSquare, Wallet } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  completedChecklistCount: number;
  totalChecklistCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  completedChecklistCount,
  totalChecklistCount,
}) => {
  const navItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'planner', label: '일정', icon: Map },
    { id: 'recommend', label: '성향테스트', icon: Sparkles },
    { id: 'budget', label: '가계부', icon: Wallet },
    { id: 'checklist', label: '준비물', icon: CheckSquare },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-t border-white/15 px-4 py-2 shadow-2xl">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-300 flex-1 ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-white/50 hover:text-white/95'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-transform duration-200 ${
                  isActive ? 'scale-110 bg-white/25 border border-white/20' : 'hover:scale-105 hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={isActive ? 'stroke-[2.5px] text-white' : 'stroke-2'} />
              </div>
              <span className="text-[10px] mt-1 tracking-tight font-medium">{item.label}</span>
              {item.id === 'checklist' && totalChecklistCount > 0 && (
                <span className="absolute top-1 right-2 bg-cyan-300 text-cyan-950 text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-black scale-90">
                  {totalChecklistCount - completedChecklistCount}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 w-5 h-0.5 bg-cyan-300 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>

  );
};
