/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Sun, AlertCircle, Plane, Sparkles, Navigation, ListChecks, DollarSign } from 'lucide-react';
import { TravelStyleInfo } from '../types';

interface HomeDashboardProps {
  departureDate: string;
  setDepartureDate: (date: string) => void;
  arrivalDate: string;
  setArrivalDate: (date: string) => void;
  travelStyleInfo: TravelStyleInfo | null;
  totalScheduleCount: number;
  totalBudget: number;
  spentBudget: number;
  checklistTotal: number;
  checklistCompleted: number;
  setActiveTab: (tab: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  departureDate,
  setDepartureDate,
  arrivalDate,
  setArrivalDate,
  travelStyleInfo,
  totalScheduleCount,
  totalBudget,
  spentBudget,
  checklistTotal,
  checklistCompleted,
  setActiveTab,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const calculateDDay = (targetDateStr: string) => {
    if (!targetDateStr) return null;
    const target = new Date(targetDateStr);
    const now = new Date();
    
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'D-Day';
    return diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
  };

  const calculateTravelDuration = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return '';
    const start = new Date(startStr);
    const end = new Date(endStr);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return '';
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '당일치기';
    return `${diffDays}박 ${diffDays + 1}일`;
  };

  const dDayStr = calculateDDay(departureDate);
  const percentSpent = totalBudget > 0 ? Math.min(Math.round((spentBudget / totalBudget) * 100), 100) : 0;
  const percentChecklist = checklistTotal > 0 ? Math.round((checklistCompleted / checklistTotal) * 100) : 0;

  // Weather and general tips for Okinawa
  const tips = [
    { text: '오키나와는 110V 전압을 사용합니다. 멀티 어댑터(돼지코)를 꼭 챙기세요!', isAlert: true },
    { text: '렌터카 이용 시 꼭 여권과 국제운전면허증을 세트로 소지해야 유효합니다.', isAlert: true },
    { text: '자외선이 한국의 3배 이상 강합니다. 자외선 차단 지수가 높은 선크림을 강력 권장합니다.', isAlert: false },
    { text: '오키나와 바다 속 산호초 관찰 시 특수 아쿠아 슈즈는 안전 예방에 필수적입니다.', isAlert: false }
  ];

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Hero Banner with Countdown */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-3xl p-6 shadow-2xl overflow-hidden"
      >
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
          <Plane size={180} />
        </div>
        
        <div className="flex justify-between items-start">
          <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1.5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
            OKINAWA, JAPAN
          </div>
          
          <button
            id="change-date-btn"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-1.5 text-[11px] bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/15 transition-all cursor-pointer font-bold"
          >
            <Calendar size={12} className="text-cyan-200" />
            날짜 수정
          </button>
        </div>

        {/* Departure/Arrival Date Selection Panel */}
        {showDatePicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 bg-white/95 rounded-2xl p-4 text-slate-800 border border-slate-100 shadow-2xl flex flex-col gap-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">출발 날짜 Departure</label>
                <input
                  id="departure-datepicker"
                  type="date"
                  value={departureDate}
                  onChange={(e) => {
                    setDepartureDate(e.target.value);
                  }}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">도착 날짜 Arrival</label>
                <input
                  id="arrival-datepicker"
                  type="date"
                  value={arrivalDate}
                  min={departureDate}
                  onChange={(e) => {
                    setArrivalDate(e.target.value);
                  }}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
              </div>
            </div>
            {departureDate > arrivalDate && (
              <p className="text-[10px] text-rose-500 font-bold">
                ⚠️ 도착 날짜는 출발 날짜와 같거나 더 나중이어야 합니다.
              </p>
            )}
            <div className="flex justify-end gap-1.5 mt-1 border-t border-slate-100 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (departureDate > arrivalDate) {
                    setArrivalDate(departureDate);
                  }
                  setShowDatePicker(false);
                }}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-black px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm"
              >
                저장 및 완료
              </button>
            </div>
          </motion.div>
        )}

        <div className="mt-8 mb-4">
          <p className="text-xs text-cyan-100/90 font-semibold tracking-wider font-sans">
            기다리고 기다리던 오키나와 여행 {calculateTravelDuration(departureDate, arrivalDate) ? `(${calculateTravelDuration(departureDate, arrivalDate)})` : ''}
          </p>
          <div className="flex flex-col gap-1.5 mt-1">
            <h1 className="text-4xl font-extrabold tracking-tighter font-display text-white drop-shadow-md">
              {dDayStr === 'D-Day' ? 'D-Day 🎉' : dDayStr}
            </h1>
            <span className="text-cyan-200 text-[11px] font-bold bg-white/10 px-3 py-1.5 rounded-xl w-max border border-white/10 shadow-inner flex items-center gap-1.5">
              🗓️ {departureDate} ~ {arrivalDate}
            </span>
          </div>
        </div>

        {/* Animated Loading Progress Bar towards departure */}
        <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden mt-6 relative flex items-center border border-white/5">
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: dDayStr && dDayStr.startsWith('D-') ? `${Math.max(10, 100 - parseInt(dDayStr.split('-')[1]) * 2)}%` : '100%' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 rounded-full"
          />
          <div className="absolute right-0 text-yellow-300 transform -translate-y-0.5 animate-bounce">
            🌴
          </div>
        </div>
      </motion.div>

      {/* Travel Style Spotlight */}
      {travelStyleInfo ? (
        <motion.div
          id="style-dashboard-card"
          whileHover={{ y: -2 }}
          onClick={() => setActiveTab('recommend')}
          className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 p-5 rounded-3xl shadow-2xl cursor-pointer transition-all"
        >
          <div className="flex gap-4 items-start">
            <div className={`p-3 rounded-2xl bg-white/15 border border-white/25 text-white text-2xl flex items-center justify-center shadow-lg`}>
              <span>{travelStyleInfo.keyEmoji}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-cyan-200 bg-cyan-900/40 border border-cyan-400/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  나의 여행 성향
                </span>
                <span className="text-[10px] text-white/40">수정하려면 탭하세요</span>
              </div>
              <h3 className="font-display font-black text-white text-base mt-2">{travelStyleInfo.name}</h3>
              <p className="text-xs text-cyan-100/80 mt-1 line-clamp-2 leading-relaxed">{travelStyleInfo.slogan}</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          id="no-style-dashboard-card"
          whileHover={{ y: -2 }}
          onClick={() => setActiveTab('recommend')}
          className="bg-white/5 backdrop-blur-xl border border-dashed border-white/20 p-5 rounded-3xl shadow-xl cursor-pointer transition-all flex items-center justify-between"
        >
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-cyan-300 border border-white/10">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">내 진짜 여행 성향은 무엇일까?</h4>
              <p className="text-xs text-cyan-100/70 mt-0.5">10초 성향 테스트하고 맞춤 코스 받기</p>
            </div>
          </div>
          <span className="text-cyan-900 bg-white hover:bg-cyan-50 border border-white/30 px-3 py-1.5 rounded-xl text-xs font-black transition shadow-md">테스트 👉</span>
        </motion.div>
      )}

      {/* Real-time Status Bento Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Budget Status */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => setActiveTab('budget')}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl cursor-pointer transition-all flex flex-col justify-between min-h-[135px]"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/10 flex items-center justify-center text-cyan-300">
              <DollarSign size={16} />
            </div>
            <span className="text-white/60 text-[9px] bg-white/10 border border-white/10 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Budget</span>
          </div>
          <div className="mt-3">
            <h4 className="text-[10px] font-bold text-cyan-100/70">소비 금액 비율</h4>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-display text-white">{percentSpent}%</span>
              <span className="text-[9px] text-white/50">({Math.round(spentBudget / 10000)}만 / {Math.round(totalBudget / 10000)}만)</span>
            </div>
            {/* Minimalist progress bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2 border border-white/5">
              <div 
                style={{ width: `${percentSpent}%` }} 
                className={`h-full ${percentSpent > 90 ? 'bg-rose-400' : 'bg-cyan-300'} rounded-full`}
              />
            </div>
          </div>
        </motion.div>

        {/* Checklist Status */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => setActiveTab('checklist')}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl cursor-pointer transition-all flex flex-col justify-between min-h-[135px]"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/10 flex items-center justify-center text-cyan-300">
              <ListChecks size={16} />
            </div>
            <span className="text-white/60 text-[9px] bg-white/10 border border-white/10 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Check</span>
          </div>
          <div className="mt-3">
            <h4 className="text-[10px] font-bold text-cyan-100/70">준비 완료 아이템</h4>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-display text-white">{percentChecklist}%</span>
              <span className="text-[9px] text-white/50">({checklistCompleted}개 / {checklistTotal}개)</span>
            </div>
            {/* Minimalist progress bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2 border border-white/5">
              <div 
                style={{ width: `${percentChecklist}%` }} 
                className="h-full bg-cyan-300 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Schedule Summary Bar */}
      <motion.div
        whileHover={{ y: -1 }}
        onClick={() => setActiveTab('planner')}
        className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl flex items-center justify-between cursor-pointer transition-all shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/10 flex items-center justify-center text-cyan-300">
            <Navigation size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">나의 일정 요약</h4>
            <p className="text-[11px] text-cyan-100/80 mt-0.5">Day1~Day3 총 {totalScheduleCount}개의 장소가 저장되었습니다.</p>
          </div>
        </div>
        <span className="text-cyan-200 font-extrabold text-xs">일정 관리 👉</span>
      </motion.div>

      {/* Practical Tips Panel */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-2xl">
        <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
          <Sun className="text-yellow-300 fill-yellow-300 stroke-[2.5px]" size={16} />
          오키나와 여행 필수 꿀팁!
        </h3>
        
        <div className="flex flex-col gap-3 mt-4">
          {tips.map((tip, idx) => (
            <div key={idx} className="flex gap-2.5 items-start bg-white/5 border border-white/5 p-3 rounded-2xl">
              {tip.isAlert ? (
                <AlertCircle className="text-rose-300 stroke-2 shrink-0 mt-0.5" size={14} />
              ) : (
                <span className="text-cyan-300 font-bold text-[13px] shrink-0">✓</span>
              )}
              <p className={`text-[11.5px] leading-relaxed ${tip.isAlert ? 'text-white font-semibold' : 'text-cyan-100/80'}`}>
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
