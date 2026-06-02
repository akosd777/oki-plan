/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Compass, ChevronUp, ChevronDown, Check, Trash2, ArrowLeftRight, Clock, DollarSign, MapPin } from 'lucide-react';
import { Place } from '../types';
import { SAMPLE_PLACES } from '../data/places';

interface SchedulePlannerProps {
  departureDate: string;
  arrivalDate: string;
  plannerData: Record<number, string[]>; // { 1: ['1', '2'], 2: ['3']... }
  onAddPlace: (day: number, id: string) => void;
  onRemovePlace: (day: number, index: number) => void;
  onReorderPlace: (day: number, index: number, direction: 'up' | 'down') => void;
  onMovePlaceToDay: (day: number, index: number, targetDay: number) => void;
}

export const SchedulePlanner: React.FC<SchedulePlannerProps> = ({
  departureDate,
  arrivalDate,
  plannerData,
  onAddPlace,
  onRemovePlace,
  onReorderPlace,
  onMovePlaceToDay,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');
  const [regionFilter, setRegionFilter] = useState<string>('전체');

  // Calculate dynamic day list based on departure and arrival dates
  const getTravelDaysCount = () => {
    if (!departureDate || !arrivalDate) return 3;
    const start = new Date(departureDate);
    const end = new Date(arrivalDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 3;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const daysCount = getTravelDaysCount();
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  // Auto-correct if selectedDay is out of bounds
  React.useEffect(() => {
    if (selectedDay > daysCount) {
      setSelectedDay(1);
    }
  }, [daysCount, selectedDay]);

  // Load added places for the active day
  const addedPlaceIds = plannerData[selectedDay] || [];
  const activeTimelinePlaces = addedPlaceIds
    .map((id) => SAMPLE_PLACES.find((p) => p.id === id))
    .filter((p): p is Place => p !== undefined);

  // Filter available cards to browse
  const availablePlaces = SAMPLE_PLACES.filter((p) => {
    const matchesSearch = p.name.includes(searchQuery) || p.description.includes(searchQuery);
    const matchesCategory = categoryFilter === '전체' || p.category === categoryFilter;
    const matchesRegion = regionFilter === '전체' || p.region === regionFilter;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  const travelRegions = ['전체', '북부', '중부', '남부'];
  const travelCategories = ['전체', '관광지', '음식점', '카페', '레저'];

  // Compute stats for current active Day timeline
  const totalCost = activeTimelinePlaces.reduce((sum, p) => sum + p.averageCost, 0);
  
  // Custom smart duration parsing (combines strings like "1시간 30분" or "2시간" into numeric minutes)
  const calculateTotalMinutes = (places: Place[]) => {
    let minutes = 0;
    places.forEach(p => {
      const durStr = p.recommendedDuration;
      let matchHr = durStr.match(/(\d+)시간/);
      let matchMin = durStr.match(/(\d+)분/);
      
      if (matchHr) minutes += parseInt(matchHr[1]!) * 60;
      if (matchMin) minutes += parseInt(matchMin[1]!);
    });
    
    if (minutes === 0) return '0시간';
    
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hrs > 0 && mins > 0) return `${hrs}시간 ${mins}분`;
    if (hrs > 0) return `${hrs}시간`;
    return `${mins}분`;
  };

  const totalDurationStr = calculateTotalMinutes(activeTimelinePlaces);

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Upper Navigation Tabs dynamically based on your selected travel duration */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-1.5 shadow-xl flex gap-1.5 overflow-x-auto select-none scrollbar-none">
        {daysArray.map((dayNum) => (
          <button
            key={dayNum}
            onClick={() => setSelectedDay(dayNum)}
            className={`shrink-0 flex-1 min-w-[70px] py-2 text-xs font-bold rounded-xl transition-all duration-300 relative cursor-pointer ${
              selectedDay === dayNum ? 'text-[#0e3b43] bg-cyan-300 font-black shadow-md' : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Day {dayNum} 일정
          </button>
        ))}
      </div>

      {/* Selected Day's active timeline details summary */}
      <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex justify-between items-center text-xs shadow-xl">
        <div>
          <h4 className="font-bold text-white">Day {selectedDay} 전체 코스 요약</h4>
          <p className="text-[10px] text-cyan-100/70 mt-1">지정된 순서로 오키나와 드라이브를 빕니다.</p>
        </div>
        <div className="text-right flex flex-col gap-1">
          <span className="font-bold text-cyan-300 bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 flex items-center justify-end gap-1 font-sans">
            <Clock size={11} /> {totalDurationStr} 소요 예상
          </span>
          <span className="font-bold text-cyan-300 bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 flex items-center justify-end gap-1 font-sans">
            <DollarSign size={11} /> ₩{totalCost.toLocaleString()} 경비
          </span>
        </div>
      </div>

      {/* Interactive Timeline Agenda */}
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-white text-sm pl-1">📍 내 타임라인 플래너 ({activeTimelinePlaces.length}개)</h3>
        
        <div className="relative border-l border-dashed border-white/20 pl-4.5 ml-2.5 pb-2 flex flex-col gap-4 mt-1">
          <AnimatePresence initial={false}>
            {activeTimelinePlaces.length > 0 ? (
              activeTimelinePlaces.map((place, idx) => (
                <motion.div
                  key={`${place.id}-${idx}`}
                  layoutId={`timeline-${place.id}-${idx}`}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/10 border border-white/20 rounded-2xl p-3.5 shadow-xl relative flex flex-col gap-2 hover:bg-white/15 transition duration-150 text-white"
                >
                  {/* Outer chronological timeline sequencing bubble */}
                  <span className="absolute -left-7 bg-cyan-300 border border-cyan-200 text-cyan-950 font-sans text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                    {idx + 1}
                  </span>

                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-black text-cyan-200 bg-cyan-950/40 border border-cyan-400/20 px-1.5 py-0.5 rounded">
                          {place.category}
                        </span>
                        <span className="text-[9px] font-black text-white/70 bg-white/10 border border-white/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <MapPin size={9} /> {place.region}
                        </span>
                        <span className="text-[9px] text-cyan-50/70 font-semibold">⏱️ {place.recommendedDuration}</span>
                      </div>
                      <h4 className="font-display font-bold text-white text-sm mt-1">{place.name}</h4>
                    </div>

                    {/* Timeline Interaction Buttons Panel */}
                    <div className="flex gap-1 items-center bg-white/5 border border-white/15 p-0.5 rounded-lg shrink-0 select-none">
                      <button
                        title="순서 위로"
                        disabled={idx === 0}
                        onClick={() => onReorderPlace(selectedDay, idx, 'up')}
                        className={`p-1 rounded transition text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed`}
                      >
                        <ChevronUp size={12} strokeWidth={2.5} />
                      </button>
                      <button
                        title="순서 아래로"
                        disabled={idx === activeTimelinePlaces.length - 1}
                        onClick={() => onReorderPlace(selectedDay, idx, 'down')}
                        className={`p-1 rounded transition text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed`}
                      >
                        <ChevronDown size={12} strokeWidth={2.5} />
                      </button>
                    </div>

                  </div>

                  <div className="flex justify-between items-center mt-1.5 border-t border-white/10 pt-2 text-[10px]">
                    <span className="text-[10px] font-bold text-cyan-100">
                      경비: {place.averageCost === 0 ? '무료' : `₩${place.averageCost.toLocaleString()}`}
                    </span>
                    
                    <div className="flex gap-2">
                      {/* Move to another Day menu toggle */}
                      <div className="flex gap-1 items-center border border-white/15 rounded-lg px-2 py-0.5 text-[9px] hover:bg-white/5 font-bold bg-white/5 text-cyan-100/90 cursor-pointer">
                        <ArrowLeftRight size={10} className="stroke-[2.5px] text-cyan-300" />
                        <select
                          className="bg-transparent border-none p-0 outline-none select-none font-bold text-cyan-200 text-[9px] cursor-pointer"
                          value={selectedDay}
                          style={{ colorScheme: 'dark' }}
                          onChange={(e) => {
                            const targetDay = parseInt(e.target.value);
                            if (targetDay !== selectedDay) {
                              onMovePlaceToDay(selectedDay, idx, targetDay);
                            }
                          }}
                        >
                          {daysArray.map((dNum) => (
                            <option key={dNum} value={dNum} className="bg-slate-800 text-white">Day {dNum}로</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => onRemovePlace(selectedDay, idx)}
                        className="flex items-center gap-0.5 border border-rose-500/10 bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 text-[10px] font-semibold px-2 py-0.5 rounded-lg cursor-pointer transition"
                      >
                        <Trash2 size={9} /> 삭제
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white/5 rounded-2xl border border-dashed border-white/15 p-8 text-center shrink-0 -ml-4.5 relative z-10">
                <span className="text-3xl filter drop-shadow-sm">🗺️</span>
                <h5 className="font-bold text-white text-xs mt-3">Day {selectedDay} 일정이 텅 비었습니다</h5>
                <p className="text-[10px] text-cyan-100/60 mt-1">아래의 탐색기로 오키나와 로컬 명소를 찾아 추가해 보세요!</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <hr className="border-white/10 my-2" />

      {/* Explorer / Available Catalog Browsing panel */}
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-white text-sm pl-1 flex items-center gap-1.5">
          <Compass className="text-cyan-300 stroke-[2.5px]" size={15} />
          오키나와 로컬 명소 탐색기
        </h3>

        {/* Filters and search stack */}
        <div className="bg-white/5 border border-white/15 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-2xl">
          <div className="relative">
            <input
              id="search-places-input"
              type="text"
              placeholder="장소 명소, 키워드를 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:bg-white/15 transition"
            />
            <Search className="absolute left-3 top-2.5 text-white/50 shrink-0" size={14} />
          </div>

          {/* Region Filters Stack */}
          <div className="flex items-center gap-1.5 select-none">
            <span className="text-[10px] font-bold text-white/50 whitespace-nowrap">지역:</span>
            <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none w-full">
              {travelRegions.map((reg) => (
                <button
                  key={reg}
                  id={`reg-filter-${reg}`}
                  onClick={() => setRegionFilter(reg)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition font-bold cursor-pointer ${
                    regionFilter === reg
                      ? 'bg-cyan-300 border-cyan-300 text-cyan-950 shadow-md'
                      : 'bg-white/15 border-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters Stack */}
          <div className="flex items-center gap-1.5 select-none">
            <span className="text-[10px] font-bold text-white/50 whitespace-nowrap">테마:</span>
            <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none w-full">
              {travelCategories.map((cat) => (
                <button
                  key={cat}
                  id={`cat-filter-${cat}`}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition font-bold cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-cyan-300 border-cyan-300 text-cyan-950 shadow-md'
                      : 'bg-white/15 border-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List of matching cards ready to be inserted */}
        <div className="flex flex-col gap-3.5 mt-1.5">
          {availablePlaces.length > 0 ? (
            availablePlaces.map((p) => {
              // Check if place is already added to current day
              const isAddedToCurrentDay = addedPlaceIds.includes(p.id);
              
              return (
                <div
                  key={p.id}
                  className="bg-white/10 border border-white/15 rounded-2xl overflow-hidden shadow-xl flex transition hover:border-white/20 text-white"
                >
                  <div className="w-1/3 min-h-[90px] max-h-[115px] relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 text-[8px] font-black text-cyan-300 bg-cyan-950/70 border border-cyan-400/20 px-1.5 py-0.5 rounded backdrop-blur-md">
                      {p.region}
                    </span>
                  </div>

                  <div className="w-2/3 p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-black text-cyan-200 bg-cyan-950/40 border border-cyan-400/20 px-1.5 py-0.5 rounded">
                          {p.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] text-cyan-100/70 font-semibold shrink-0">
                          <span>⏱️ {p.recommendedDuration}</span>
                          <span>|</span>
                          <span>₩{(p.averageCost/1000).toFixed(1)}k</span>
                        </div>
                      </div>
                      <h4 className="font-extrabold text-white text-xs mt-1.5">{p.name}</h4>
                      <p className="text-[9px] text-cyan-100/60 mt-0.5 line-clamp-1">
                        {p.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center gap-1.5 mt-2.5 pt-1 border-t border-white/10">
                      <div className="flex gap-1 overflow-hidden">
                        {p.tags.slice(0, 1).map((tag, idx) => (
                          <span key={idx} className="text-[8px] bg-white/10 text-cyan-100/65 border border-white/10 px-1.5 py-0.5 rounded shrink-0 truncate">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <button
                        id={`add-place-${p.id}`}
                        onClick={() => onAddPlace(selectedDay, p.id)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-black transition duration-250 cursor-pointer ${
                          isAddedToCurrentDay
                            ? 'bg-white/15 text-cyan-300 border border-white/15'
                            : 'bg-cyan-300 hover:bg-cyan-400 text-cyan-950 shadow-md'
                        }`}
                      >
                        {isAddedToCurrentDay ? (
                          <span className="flex items-center gap-0.5">
                            <Check size={10} strokeWidth={2.5} /> 추가됨
                          </span>
                        ) : (
                          `+ 일정 추가`
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/15">
              <p className="text-xs text-cyan-100/60 font-semibold">검색하거나 매칭되는 오키나와 명소가 없습니다.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('전체');
                  setRegionFilter('전체');
                }}
                className="mt-3.5 text-[10px] bg-white/10 hover:bg-white/20 border border-white/10 text-white px-3.5 py-1.5 rounded-xl cursor-pointer"
              >
                필터 조건 전체 해제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
