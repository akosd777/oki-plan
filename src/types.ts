/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Place {
  id: string;
  name: string;
  category: '관광지' | '음식점' | '카페' | '레저';
  region: '북부' | '중부' | '남부';
  description: string;
  image: string;
  recommendedDuration: string;
  averageCost: number; // in KRW
  tags: string[];
}

export type TravelStyle = 'healing' | 'foodie' | 'explorer' | 'activity';

export interface TravelStyleInfo {
  type: TravelStyle;
  name: string;
  slogan: string;
  description: string;
  recommendedPlaces: string[]; // place IDs
  keyEmoji: string;
  colorClass: string;
  bgHex: string;
  textHex: string;
  courseSummary: string;
}

export interface BudgetItem {
  id: string;
  category: '항공' | '숙박' | '교통' | '식비' | '쇼핑' | '액티비티' | '기타';
  title: string;
  amount: number;
}

export interface BudgetLimit {
  category: '항공' | '숙박' | '교통' | '식비' | '쇼핑' | '액티비티' | '기타';
  amount: number;
}

export interface ChecklistItem {
  id: string;
  category: '필수' | '의류' | '세면도구' | '전자기기' | '비상약' | '기타';
  title: string;
  completed: boolean;
  isCustom?: boolean;
}

export interface StyleTestQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    type: TravelStyle;
  }[];
}
