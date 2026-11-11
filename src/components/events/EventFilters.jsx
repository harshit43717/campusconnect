import React from 'react';
import { Sparkles, Code, Palette, Trophy, Wrench, GraduationCap, Gamepad2 } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { useEvents } from '../../context/EventContext';

const iconMap = {
  Sparkles,
  Code,
  Palette,
  Trophy,
  Wrench,
  GraduationCap,
  Gamepad2
};

export function EventFilters() {
  const { selectedCategory, setSelectedCategory, events } = useEvents();

  const getCategoryCount = (catId) => {
    if (catId === 'all') return events.length;
    return events.filter(e => e.category === catId).length;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
      {CATEGORIES.map((cat) => {
        const Icon = iconMap[cat.icon] || Sparkles;
        const isSelected = selectedCategory === cat.id;
        const count = getCategoryCount(cat.id);

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 border shrink-0 ${
              isSelected
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
            <span>{cat.label}</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                isSelected
                  ? 'bg-indigo-700/80 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
