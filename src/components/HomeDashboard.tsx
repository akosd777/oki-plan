/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Sun, AlertCircle, Plane, Sparkles, Navigation, ListChecks, DollarSign, Download, Upload, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { TravelStyleInfo } from '../types';

interface HomeDashboardProps {
  departureDate: string;
  setDepartureDate: (date: string) => void;
  arrivalDate: string;
  setArrivalDate: (date: string) => void;
  travelStyle: string | null;
  plannerData: Record<number, string[]>;
  budgetList: any[];
  checklist: any[];
  totalBudget: number;
  onImportBackup: (data: any) => boolean;
  travelStyleInfo: TravelStyleInfo | null;
  totalScheduleCount: number;
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
  travelStyle,
  plannerData,
  budgetList,
  checklist,
  totalBudget,
  onImportBackup,
  travelStyleInfo,
  totalScheduleCount,
  spentBudget,
  checklistTotal,
  checklistCompleted,
  setActiveTab,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBackupPanel, setShowBackupPanel] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [pastedCode, setPastedCode] = useState('');
  const [importStatus, setImportStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    try {
      const backupData = {
        departureDate,
        arrivalDate,
        travelStyle,
        plannerData,
        totalBudget,
        budgetList,
        checklist,
        version: '1.0'
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `OKI_PLAN_Backup_${departureDate || 'trip'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyCode = () => {
    try {
      const backupData = {
        departureDate,
        arrivalDate,
        travelStyle,
        plannerData,
        totalBudget,
        budgetList,
        checklist,
        version: '1.0'
      };
      navigator.clipboard.writeText(JSON.stringify(backupData));
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          if (event.target?.result) {
            const parsed = JSON.parse(event.target.result as string);
            const success = onImportBackup(parsed);
            if (success) {
              setImportStatus({ type: 'success', message: '✓ 여행 복원 완료! 대시보드 및 일정이 성공적으로 동기화되었습니다.' });
              setTimeout(() => setImportStatus({ type: 'idle', message: '' }), 4000);
            } else {
              setImportStatus({ type: 'error', message: '❌ 복원에 실패했습니다. 지원되지 않는 백업 폼입니다.' });
              setTimeout(() => setImportStatus({ type: 'idle', message: '' }), 4000);
            }
          }
        } catch (error) {
          setImportStatus({ type: 'error', message: '❌ 올바르지 않은 JSON 백업 파일 형식입니다.' });
          setTimeout(() => setImportStatus({ type: 'idle', message: '' }), 4000);
        }
      };
    }
  };

  const handlePasteRestore = () => {
    if (!pastedCode.trim()) {
      setImportStatus({ type: 'error', message: '⚠️ 마법의 복원 코드를 먼저 입력해주세요!' });
      return;
    }
    try {
      const parsed = JSON.parse(pastedCode.trim());
      const success = onImportBackup(parsed);
      if (success) {
        setImportStatus({ type: 'success', message: '✓ 코드로 완벽 복원 성공! 전체 일정이 복구되었습니다.' });
        setPastedCode('');
        setTimeout(() => setImportStatus({ type: 'idle', message: '' }), 4000);
      } else {
        setImportStatus({ type: 'error', message: '❌ 복원 실패! 올바른 여행 코드를 복사해 넣어보세요.' });
        setTimeout(() => setImportStatus({ type: 'idle', message: '' }), 4000);
      }
    } catch (e) {
      setImportStatus({ type: 'error', message: '❌ 코드가 손상되었거나 올바르지 않은 JSON 포맷입니다.' });
      setTimeout(() => setImportStatus({ type: 'idle', message: '' }), 4000);
    }
  };

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

      {/* Dynamic Data Backup & Restore Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-2xl flex flex-col gap-3">
        <div className="flex justify-between items-center select-none">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
            <RefreshCw className="text-cyan-300 stroke-[2.5px]" size={14} />
            내 여행 계획 저장 & 복원 (백업)
          </h3>
          <button
            type="button"
            onClick={() => setShowBackupPanel(!showBackupPanel)}
            className="text-[10px] font-bold text-cyan-200 bg-white/10 hover:bg-white/20 border border-white/10 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
          >
            {showBackupPanel ? '간단히 보기 ▵' : '백업하기 ▿'}
          </button>
        </div>

        <p className="text-[10.5px] leading-relaxed text-cyan-100/70">
          💡 <strong>미리보기 핵심 팁</strong>: AI Studio의 코딩 미리보기 창은 브라우저 보안 규정상 주소나 빌드 동기화 시 일시적으로 초기화될 수 있습니다. 
          우측 상단 <strong>&lsquo;Launch Preview/새 창으로 열기&rsquo;</strong> 단추를 눌러 진짜 인터넷 창으로 실행하시면 새로고침을 해도 영구히 자동 보존됩니다!
        </p>

        <AnimatePresence>
          {showBackupPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 pt-4 flex flex-col gap-4 text-xs overflow-hidden"
            >
              {/* Export Panel Block */}
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col">
                <span className="text-[10px] font-extrabold text-cyan-200 uppercase tracking-widest block">📥 현재 나의 여행 조각 백업</span>
                <p className="text-[10px] text-cyan-100/60 mt-0.5 mb-2.5">
                  도착날짜 및 일정, 가계부 꿀지출, 기내 준비물 등을 파일이나 여행 코드로 보존합니다.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="bg-cyan-500/80 hover:bg-cyan-600/80 hover:scale-101 active:scale-98 text-white px-3 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm text-[11px]"
                  >
                    <Download size={13} />
                    파일 다운로드
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="bg-white/15 hover:bg-white/25 active:scale-98 text-white px-3 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-white/10 text-[11px]"
                  >
                    {copiedText ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
                    {copiedText ? '복사 완료!' : '여행 코드 복사'}
                  </button>
                </div>
              </div>

              {/* Import Panel Block */}
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col gap-2">
                <span className="text-[10px] font-extrabold text-cyan-200 uppercase tracking-widest block">📤 보존된 여행 불러오기</span>
                <p className="text-[10px] text-cyan-100/60 mt-0.5">
                  저장하신 백업 파일(.json)을 업로드하거나 복사 대입하여 가상의 일정을 완벽 복원하세요.
                </p>
                
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-teal-500/80 hover:bg-teal-600/80 text-white font-bold py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px]"
                  >
                    <Upload size={13} />
                    백업 파일 올리기
                  </button>
                </div>

                {/* Paste Direct Code Restorer */}
                <div className="flex gap-1.5 mt-1 border-t border-white/5 pt-2">
                  <input
                    type="text"
                    placeholder="복사한 코드를 여기에 붙여넣으세요"
                    value={pastedCode}
                    onChange={(e) => setPastedCode(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/10 rounded-xl px-2.5 py-1 text-white text-[10px] focus:outline-none focus:ring-1 focus:ring-cyan-300 placeholder-white/35 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handlePasteRestore}
                    className="bg-cyan-300 hover:bg-cyan-400 active:scale-95 text-cyan-950 font-black px-3 py-1 rounded-xl text-[10.5px] transition cursor-pointer"
                  >
                    복원
                  </button>
                </div>
              </div>

              {/* Alerts and Snackbars inside backupper */}
              {importStatus.message && (
                <div
                  className={`p-2.5 rounded-xl border text-[10px] font-bold ${
                    importStatus.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {importStatus.message}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
