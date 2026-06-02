/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Navigation, Calendar } from 'lucide-react';

import { Place, TravelStyle, TravelStyleInfo, BudgetItem, ChecklistItem } from './types';
import { TRAVEL_STYLES, SAMPLE_PLACES } from './data/places';

import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { SchedulePlanner } from './components/SchedulePlanner';
import { TravelStyleTest } from './components/TravelStyleTest';
import { BudgetCalculator } from './components/BudgetCalculator';
import { Checklist } from './components/Checklist';

// Default checklists to populate the app on startup
const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: '1', category: '필수', title: '여권 (유효기간 6개월 이상) 🛂', completed: false },
  { id: '2', category: '필수', title: '엔화 환전하기 💴', completed: false },
  { id: '3', category: '필수', title: '110V 돼지코 변환 플러그 🔌', completed: false },
  { id: '4', category: '필수', title: '국제운전면허증 발급 (렌트 필수) 🪪', completed: false },
  { id: '5', category: '필수', title: '여행자 보험 가입서 출력 📄', completed: false },
  { id: '6', category: '의류', title: '개성 넘치는 수영복 & 래시가드 🩱', completed: false },
  { id: '7', category: '의류', title: '강렬한 햇빛을 가릴 선글라스 🕶️', completed: false },
  { id: '8', category: '의류', title: '시원한 여름옷 및 가바람막이 👕', completed: false },
  { id: '9', category: '의류', title: '물놀이용 아쿠아슈즈 & 슬리퍼 🩴', completed: false },
  { id: '10', category: '세면도구', title: '초강력 차단 선크림 (강추) 🧴', completed: false },
  { id: '11', category: '세면도구', title: '선크림 지우기용 클렌징 제품 🧴', completed: false },
  { id: '12', category: '세면도구', title: '여행용 치약 칫솔 휴대세트 🪥', completed: false },
  { id: '13', category: '전자기기', title: '대용량 보조배터리 (기내 수하물) 🔋', completed: false },
  { id: '14', category: '전자기기', title: '방수 카메라 또는 고프로 📸', completed: false },
  { id: '15', category: '전자기기', title: '튼튼한 스마트폰 방수팩 🤳', completed: false },
  { id: '16', category: '비상약', title: '속이 울렁거릴 때 먹는 배 멀미약 🤢', completed: false },
  { id: '17', category: '비상약', title: '소화제 & 물고기 상처 연고/밴드 💊', completed: false },
];

// Default budget list items to populate on startup
const DEFAULT_BUDGETS: BudgetItem[] = [
  { id: 'b1', title: '피치항공 왕복 탑승권 (2인)', category: '항공', amount: 720000 },
  { id: 'b2', title: '오키나와 오쿠미 료칸 2박', category: '숙박', amount: 450000 },
  { id: 'b3', title: '토요타 소형 하이브리드 렌트비', category: '교통', amount: 168000 },
  { id: 'b4', title: '츄라우미 수족관 입장료 2매', category: '액티비티', amount: 43600 },
  { id: 'b5', title: '국제거리 이자카야 사케랑 오뎅', category: '식비', amount: 54000 },
];

export default function App() {
  // Load initial states from localStorage or defaults
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('oki_active_tab') || 'home';
  });

  const [departureDate, setDepartureDate] = useState<string>(() => {
    // Generate a default departure date of June 20th, 2026 if none exists
    return localStorage.getItem('oki_departure_date') || '2026-06-20';
  });

  const [arrivalDate, setArrivalDate] = useState<string>(() => {
    // Generate a default arrival date of June 23rd, 2026 if none exists
    return localStorage.getItem('oki_arrival_date') || '2026-06-23';
  });

  const [travelStyle, setTravelStyle] = useState<TravelStyle | null>(() => {
    const saved = localStorage.getItem('oki_travel_style');
    return saved ? (saved as TravelStyle) : null;
  });

  const [plannerData, setPlannerData] = useState<Record<number, string[]>>(() => {
    const saved = localStorage.getItem('oki_planner_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback below
      }
    }
    // Default starting course distributed elegantly across Day 1, Day 2, Day 3
    return {
      1: ['5', '14'],       // 슈리성, 세나가지마 우미카지 테라스
      2: ['2', '3', '16'],  // 만좌모, 아메리칸 빌리지, 푸른동굴 스노클링
      3: ['1', '10'],       // 츄라우미 수족관, 아열대 고택 우후야
    };
  });

  const [totalBudget, setTotalBudget] = useState<number>(() => {
    const saved = localStorage.getItem('oki_total_budget');
    return saved ? parseFloat(saved) : 1800000; // Default 180만원
  });

  const [budgetList, setBudgetList] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem('oki_budget_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return DEFAULT_BUDGETS;
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('oki_checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return DEFAULT_CHECKLIST;
  });

  // Watch states to store in localStorage
  useEffect(() => {
    localStorage.setItem('oki_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('oki_departure_date', departureDate);
  }, [departureDate]);

  useEffect(() => {
    localStorage.setItem('oki_arrival_date', arrivalDate);
  }, [arrivalDate]);

  useEffect(() => {
    if (travelStyle) {
      localStorage.setItem('oki_travel_style', travelStyle);
    } else {
      localStorage.removeItem('oki_travel_style');
    }
  }, [travelStyle]);

  useEffect(() => {
    localStorage.setItem('oki_planner_data', JSON.stringify(plannerData));
  }, [plannerData]);

  useEffect(() => {
    localStorage.setItem('oki_total_budget', totalBudget.toString());
  }, [totalBudget]);

  useEffect(() => {
    localStorage.setItem('oki_budget_list', JSON.stringify(budgetList));
  }, [budgetList]);

  useEffect(() => {
    localStorage.setItem('oki_checklist', JSON.stringify(checklist));
  }, [checklist]);

  // Operations for Schedule Planner
  const handleAddPlace = (day: number, placeId: string) => {
    setPlannerData((prev) => {
      const currentList = prev[day] || [];
      if (currentList.includes(placeId)) return prev; // Avoid duplicated cards on the same day
      return {
        ...prev,
        [day]: [...currentList, placeId],
      };
    });
  };

  const handleRemovePlace = (day: number, index: number) => {
    setPlannerData((prev) => {
      const currentList = prev[day] || [];
      const updatedList = [...currentList];
      updatedList.splice(index, 1);
      return {
        ...prev,
        [day]: updatedList,
      };
    });
  };

  const handleReorderPlace = (day: number, index: number, direction: 'up' | 'down') => {
    setPlannerData((prev) => {
      const currentList = prev[day] || [];
      if (currentList.length <= 1) return prev;
      
      const updatedList = [...currentList];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex < 0 || targetIndex >= updatedList.length) return prev;
      
      // Swap places
      const temp = updatedList[index]!;
      updatedList[index] = updatedList[targetIndex]!;
      updatedList[targetIndex] = temp;
      
      return {
        ...prev,
        [day]: updatedList,
      };
    });
  };

  const handleMovePlaceToDay = (day: number, index: number, targetDay: number) => {
    setPlannerData((prev) => {
      const currentList = prev[day] || [];
      const targetList = prev[targetDay] || [];
      const placeId = currentList[index];
      
      if (!placeId) return prev;
      if (targetList.includes(placeId)) return prev; // Cannot double add moving places
      
      // Remove from source day
      const updatedSource = [...currentList];
      updatedSource.splice(index, 1);
      
      return {
        ...prev,
        [day]: updatedSource,
        [targetDay]: [...targetList, placeId],
      };
    });
  };

  // Add the 4 recommended places of a travel style to Day 1, Day 2, and Day 3 automatically!
  const handleAddRecommendedPlaces = (placeIds: string[]) => {
    setPlannerData(() => {
      // Clean previous layout or merge intelligently. To provide great experience, we spread the 4 places evenly.
      // E.g., Place 1 in Day 1, Place 2 & 3 in Day 2, Place 4 in Day 3
      return {
        1: [placeIds[0]].filter((id): id is string => id !== undefined),
        2: [placeIds[1], placeIds[2]].filter((id): id is string => id !== undefined),
        3: [placeIds[3]].filter((id): id is string => id !== undefined),
      };
    });
  };

  // Operations for Checklist
  const handleToggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddChecklistItem = (title: string, category: ChecklistItem['category']) => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      category,
      title,
      completed: false,
      isCustom: true,
    };
    setChecklist((prev) => [...prev, newItem]);
  };

  const handleDeleteChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  // Operations for Budget Wallet
  const handleAddBudgetItem = (title: string, category: BudgetItem['category'], amount: number) => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      category,
      title,
      amount,
    };
    setBudgetList((prev) => [...prev, newItem]);
  };

  const handleDeleteBudgetItem = (id: string) => {
    setBudgetList((prev) => prev.filter((item) => item.id !== id));
  };

  // Derivative metrics
  const totalScheduleCount = Object.keys(plannerData).reduce((count, key) => {
    const day = parseInt(key);
    return count + (plannerData[day] || []).length;
  }, 0);
  const spentBudget = budgetList.reduce((sum, item) => sum + item.amount, 0);
  const checklistCompleted = checklist.filter((item) => item.completed).length;
  const checklistTotal = checklist.length;
  const styleInfo = travelStyle ? TRAVEL_STYLES[travelStyle] : null;

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-0 sm:py-8 font-sans relative overflow-hidden bg-[#0093E9]"
      style={{ backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)' }}
    >
      {/* Background Decorative Shapes */}
      <div className="absolute -top-10 -left-10 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-10 w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md min-h-screen sm:min-h-[850px] bg-white/10 backdrop-blur-2xl sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col relative border border-white/20">
        
        {/* Safe Area Notch Top Header */}
        <header className="bg-white/10 backdrop-blur-md sticky top-0 left-0 right-0 z-40 border-b border-white/15 px-6 py-4 flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <span className="text-xl filter drop-shadow-sm">🌺</span>
            <div className="flex flex-col">
              <h1 className="font-display font-black text-white text-sm tracking-wider flex items-center gap-1.5">
                OKI PLAN
                <span className="text-[9px] text-cyan-200 bg-cyan-950/40 border border-cyan-400/20 px-1.5 py-0.5 rounded font-black uppercase tracking-widest scale-90">Pro</span>
              </h1>
              <p className="text-[9px] text-cyan-100/80 font-bold">나만의 오키나와 여행 조각들</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <span className="text-[10px] font-sans font-black text-white tracking-wider">
              {activeTab === 'home' && 'DASHBOARD'}
              {activeTab === 'planner' && 'PLANNER'}
              {activeTab === 'recommend' && 'EXPLORE'}
              {activeTab === 'budget' && 'BUDGET'}
              {activeTab === 'checklist' && 'CHECKLIST'}
            </span>
          </div>
        </header>

        {/* Scrollable Container Content */}
        <main className="flex-1 overflow-y-auto px-6 pt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'home' && (
                <HomeDashboard
                  departureDate={departureDate}
                  setDepartureDate={setDepartureDate}
                  arrivalDate={arrivalDate}
                  setArrivalDate={setArrivalDate}
                  travelStyleInfo={styleInfo}
                  totalScheduleCount={totalScheduleCount}
                  totalBudget={totalBudget}
                  spentBudget={spentBudget}
                  checklistTotal={checklistTotal}
                  checklistCompleted={checklistCompleted}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'planner' && (
                <SchedulePlanner
                  departureDate={departureDate}
                  arrivalDate={arrivalDate}
                  plannerData={plannerData}
                  onAddPlace={handleAddPlace}
                  onRemovePlace={handleRemovePlace}
                  onReorderPlace={handleReorderPlace}
                  onMovePlaceToDay={handleMovePlaceToDay}
                />
              )}

              {activeTab === 'recommend' && (
                <TravelStyleTest
                  currentStyle={travelStyle}
                  onStyleComplete={(style) => setTravelStyle(style)}
                  onResetStyle={() => setTravelStyle(null)}
                  onAddPlacesToSchedule={handleAddRecommendedPlaces}
                />
              )}

              {activeTab === 'budget' && (
                <BudgetCalculator
                  totalBudget={totalBudget}
                  setTotalBudget={setTotalBudget}
                  budgetList={budgetList}
                  onAddBudgetItem={handleAddBudgetItem}
                  onDeleteBudgetItem={handleDeleteBudgetItem}
                />
              )}

              {activeTab === 'checklist' && (
                <Checklist
                  checklist={checklist}
                  onToggleItem={handleToggleChecklistItem}
                  onAddItem={handleAddChecklistItem}
                  onDeleteItem={handleDeleteChecklistItem}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Persistent Bottom Bar navigation */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          completedChecklistCount={checklistCompleted}
          totalChecklistCount={checklistTotal}
        />
      </div>
    </div>
  );
}
