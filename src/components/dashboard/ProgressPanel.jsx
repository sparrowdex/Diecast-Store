'use client';

import ProgressRing from './ProgressRing';

const ProgressPanel = ({ categories, theme = 'dark' }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className={`p-8 border border-dashed text-center font-mono text-xs opacity-50 transition-colors ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
        [ NO_CATEGORY_DATA ]
      </div>
    );
  }

  return (
    <div className={`p-4 h-full border transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/10'}`}>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 mb-6 px-4">Series_Completion</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 py-4">
            {categories.map((cat) => (
                <ProgressRing
                    key={cat.name}
                    label={cat.name.replace(/_/g, ' ')}
                    percentage={cat.percentage}
                    theme={theme}
                    size={80}
                    strokeWidth={8}
                />
            ))}
        </div>
    </div>
  );
};

export default ProgressPanel;
