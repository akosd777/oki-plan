/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Compass, Heart, AlertCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Place, TravelStyle, TravelStyleInfo, StyleTestQuestion } from '../types';
import { SAMPLE_PLACES, TRAVEL_STYLES, STYLE_TEST_QUESTIONS } from '../data/places';

interface TravelStyleTestProps {
  currentStyle: TravelStyle | null;
  onStyleComplete: (style: TravelStyle) => void;
  onResetStyle: () => void;
  onAddPlacesToSchedule: (placeIds: string[]) => void;
}

export const TravelStyleTest: React.FC<TravelStyleTestProps> = ({
  currentStyle,
  onStyleComplete,
  onResetStyle,
  onAddPlacesToSchedule,
}) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<TravelStyle[]>([]);
  const [showResultAnimation, setShowResultAnimation] = useState(false);
  const [addedPlacesNotification, setAddedPlacesNotification] = useState(false);
  const [expandedStyle, setExpandedStyle] = useState<string | null>(null);

  const handleSelectOption = (type: TravelStyle) => {
    const nextAnswers = [...answers, type];
    setAnswers(nextAnswers);

    if (currentQuestionIdx < STYLE_TEST_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Calculate results
      setShowResultAnimation(true);
      setTimeout(() => {
        const counts = nextAnswers.reduce((acc, curr) => {
          acc[curr] = (acc[curr] || 0) + 1;
          return acc;
        }, {} as Record<TravelStyle, number>);

        let winningStyle: TravelStyle = 'healing';
        let maxCount = 0;

        (Object.keys(counts) as TravelStyle[]).forEach((style) => {
          if (counts[style]! > maxCount) {
            maxCount = counts[style]!;
            winningStyle = style;
          }
        });

        onStyleComplete(winningStyle);
        setShowResultAnimation(false);
      }, 2000);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIdx(0);
    setAnswers([]);
    onResetStyle();
  };

  const handleApplyRecommendedPlaces = (places: string[]) => {
    onAddPlacesToSchedule(places);
    setAddedPlacesNotification(true);
    setTimeout(() => {
      setAddedPlacesNotification(false);
    }, 3000);
  };

  // Rendering Loading Animation Screen when test is being compiled
  if (showResultAnimation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 gap-4 text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="text-cyan-300 mb-2"
        >
          <Compass size={60} />
        </motion.div>
        <h2 className="text-xl font-extrabold text-white font-display">오키나와 성향 분석 중...</h2>
        <p className="text-cyan-100/80 text-xs max-w-xs leading-relaxed font-medium">
          선택하신 답변들을 바탕으로 오키나와 최적의 맞춤 바다와 일정, 명품 미식을 선별하고 있습니다.
        </p>
      </div>
    );
  }

  // Question and Answer Flow
  if (!currentStyle) {
    const currentQuestion = STYLE_TEST_QUESTIONS[currentQuestionIdx] as StyleTestQuestion;
    const progressPercent = Math.round(((currentQuestionIdx + 1) / STYLE_TEST_QUESTIONS.length) * 100);

    return (
      <div className="flex flex-col gap-5 pb-24 h-full justify-between">
        <div className="flex flex-col gap-4">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-white">
            <span className="text-[10px] font-black text-cyan-200 bg-cyan-900/40 border border-cyan-400/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              성향 테스트
            </span>
            <span className="text-xs font-semibold text-white/50">
              {currentQuestionIdx + 1} / {STYLE_TEST_QUESTIONS.length}
            </span>
          </div>

          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden border border-white/5">
            <motion.div
              layoutId="test-progress"
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-cyan-305 bg-gradient-to-r from-cyan-300 to-teal-300 rounded-full"
            />
          </div>

          {/* Question Display Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl mt-2 text-white"
            >
              <span className="text-2xl font-black text-cyan-300 select-none font-display">Q{currentQuestion.id}</span>
              <h3 className="font-bold text-white text-base mt-2 leading-relaxed">
                {currentQuestion.question}
              </h3>
            </motion.div>
          </AnimatePresence>

          {/* Answer Options Stack */}
          <div className="flex flex-col gap-3 mt-4">
            {currentQuestion.options.map((opt, oIdx) => (
              <motion.button
                key={oIdx}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectOption(opt.type)}
                className="flex text-left p-4 bg-white/10 border border-white/15 hover:border-white/25 hover:bg-white/20 active:bg-white/25 rounded-2xl cursor-pointer text-xs font-semibold text-white leading-relaxed transition-all shadow-xl"
              >
                <span className="mr-3 font-extrabold text-cyan-300">{['A', 'B', 'C', 'D'][oIdx]}</span>
                {opt.text}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Informational Hint Footer */}
        <div className="flex justify-center items-center gap-1.5 text-[11px] text-cyan-100/60 select-none mt-6">
          <Heart size={12} className="text-rose-300 animate-pulse" />
          답변에 정답은 없어요! 편안한 내면의 본 모습을 선택해주세요.
        </div>
      </div>
    );
  }

  // Result Visualisation Screen
  const styleInfo = TRAVEL_STYLES[currentStyle] as TravelStyleInfo;
  const recommendedPlaces = SAMPLE_PLACES.filter((p) => styleInfo.recommendedPlaces.includes(p.id));

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Toast Notification for Adding places successfully */}
      <AnimatePresence>
        {addedPlacesNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-950/90 backdrop-blur-md border border-white/10 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold w-11/12 max-w-sm"
          >
            <div className="w-5 h-5 bg-cyan-350 bg-cyan-400 rounded-full flex items-center justify-center text-cyan-950">
              <Check size={12} strokeWidth={3} />
            </div>
            <span>추천 명소들이 플래너에 추가되었습니다!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Hero Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl p-6 border border-white/20 shadow-2xl bg-white/15 backdrop-blur-xl relative overflow-hidden text-white"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1.5">
            <span className="text-3xl filter drop-shadow-md">{styleInfo.keyEmoji}</span>
            <div>
              <span className="text-[10px] font-black text-cyan-200 block tracking-wider uppercase">이벤트 진단 결과</span>
              <h2 className="text-lg font-black font-display text-white leading-tight">{styleInfo.name}</h2>
            </div>
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 text-[10px] text-white font-bold bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 px-2.5 py-1.5 rounded-xl cursor-pointer transition"
          >
            <RefreshCw size={10} />
            재테스트
          </button>
        </div>

        <div className="mt-6">
          <blockquote className="border-l-4 border-cyan-300/40 pl-3 italic text-xs font-semibold text-cyan-100/90 leading-relaxed">
            "{styleInfo.slogan}"
          </blockquote>
          <p className="text-white/80 text-xs font-medium mt-3.5 leading-relaxed">
            {styleInfo.description}
          </p>
        </div>

        {/* Spreading course suggestion block */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="text-[10px] font-bold text-cyan-200 uppercase tracking-widest">일정 프리뷰 코스</p>
          <p className="text-xs font-semibold text-cyan-50 mt-1.5 leading-relaxed">{styleInfo.courseSummary}</p>
        </div>

        {/* CTA to auto populate schedule planner */}
        <div className="mt-6">
          <button
            onClick={() => handleApplyRecommendedPlaces(styleInfo.recommendedPlaces)}
            className={`w-full py-3 px-4 bg-white hover:bg-cyan-50 text-cyan-950 rounded-2xl text-xs font-black shadow-xl transition cursor-pointer flex justify-center items-center gap-2`}
          >
            <Sparkles size={14} className="text-cyan-900 animate-pulse" />
            이 추천 장소들 복사하여 일정짜기
          </button>
          <span className="text-[10px] text-cyan-100/60 text-center block mt-2">
            *클릭 시 Day 1~Day 3에 추천 코스가 분할 자동 배치됩니다.
          </span>
        </div>
      </motion.div>

      {/* Recommended places details header */}
      <div>
        <h3 className="font-extrabold text-white text-sm pl-1">
          추천 코스 및 명소 카탈로그 ({recommendedPlaces.length}개)
        </h3>
        
        <div className="flex flex-col gap-4 mt-3">
          {recommendedPlaces.map((p) => (
            <div
              key={p.id}
              className="bg-white/10 border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex text-white"
            >
              <div className="w-1/3 min-h-[105px] h-full relative">
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[9px] font-black text-cyan-300 bg-cyan-950/70 border border-cyan-400/20 px-1.5 py-0.5 rounded-md backdrop-blur-md">
                  {p.region}
                </span>
              </div>
              <div className="w-2/3 p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-cyan-200 bg-cyan-950/40 border border-cyan-400/20 px-1.5 py-0.5 rounded">
                      {p.category}
                    </span>
                    <span className="text-[9px] text-cyan-100/70 font-medium">⏱️ {p.recommendedDuration}</span>
                  </div>
                  <h4 className="font-bold text-white text-xs mt-1">{p.name}</h4>
                  <p className="text-[10px] text-cyan-100/65 mt-1 line-clamp-2">
                    {p.description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-bold text-cyan-300">
                    {p.averageCost === 0 ? '무료 입장' : `비용: ₩${p.averageCost.toLocaleString()}`}
                  </span>
                  <div className="flex gap-1">
                    {p.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[8px] bg-white/10 text-cyan-100/70 border border-white/10 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore All Other Travel Styles Section */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <h3 className="font-extrabold text-white text-sm pl-1 mb-1">
          🌴 오키나와 다른 여행 성향 둘러보기
        </h3>
        <p className="text-[10px] text-cyan-100/60 pl-1 mb-4">
          오키plan이 제안하는 4가지 명품 메인 테마 조합 리스트입니다. 유형을 선택해 맞춤 일정과 명소를 탐색해보세요.
        </p>

        <div className="flex flex-col gap-3">
          {(Object.keys(TRAVEL_STYLES) as TravelStyle[]).map((styleKey) => {
            const style = TRAVEL_STYLES[styleKey];
            const isCurrent = styleKey === currentStyle;
            const isExpanded = expandedStyle === styleKey;

            return (
              <div
                key={styleKey}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-cyan-900/40 to-teal-950/40 border-cyan-400/30 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Header Row */}
                <button
                  type="button"
                  onClick={() => setExpandedStyle(isExpanded ? null : styleKey)}
                  className="w-full text-left p-4 flex items-center justify-between cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl filter drop-shadow-sm">{style.keyEmoji}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">
                          {style.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[8px] font-black bg-cyan-300 text-cyan-950 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            나의 유형 ✦
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-cyan-100/70 mt-0.5 line-clamp-1">{style.slogan}</p>
                    </div>
                  </div>
                  <div className="text-white/40">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Expanded Content with details and Switch button */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-white/10 bg-white/[0.02] p-4 text-xs text-white flex flex-col gap-3.5"
                    >
                      <p className="text-cyan-100/85 leading-relaxed text-[11px] font-medium">
                        {style.description}
                      </p>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-[9px] font-bold text-cyan-200 uppercase tracking-widest block">일정 코스 개요</span>
                        <p className="text-[11px] text-white font-medium mt-1 leading-relaxed">{style.courseSummary}</p>
                      </div>

                      <div className="flex justify-between items-center gap-3 pt-1">
                        <span className="text-[10px] text-white/40">
                          추천 명소: {style.recommendedPlaces.length}곳 수록
                        </span>
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStyleComplete(styleKey);
                              setExpandedStyle(null);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-cyan-300 hover:bg-cyan-400 active:scale-97 text-cyan-950 px-3.5 py-1.5 rounded-xl text-[10px] font-black transition cursor-pointer shadow-md"
                          >
                            이 성향으로 전환하기 👉
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
