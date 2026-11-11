import React from 'react';

const categoryStyles = {
  Technical: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Cultural: 'bg-pink-50 text-pink-700 border-pink-200',
  Sports: 'bg-amber-50 text-amber-700 border-amber-200',
  Workshop: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Academic: 'bg-blue-50 text-blue-700 border-blue-200',
  Gaming: 'bg-purple-50 text-purple-700 border-purple-200',
  default: 'bg-slate-100 text-slate-700 border-slate-200'
};

export function Badge({ children, variant = 'default', category, className = '' }) {
  let style = categoryStyles.default;
  if (category && categoryStyles[category]) {
    style = categoryStyles[category];
  } else if (categoryStyles[variant]) {
    style = categoryStyles[variant];
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style} ${className}`}
    >
      {children}
    </span>
  );
}
