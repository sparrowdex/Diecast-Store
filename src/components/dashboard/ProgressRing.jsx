'use client';

const ProgressRing = ({ percentage, label, size = 100, strokeWidth = 10, theme = 'dark', color }) => {
  const visualPercentage = Math.max(0, Math.min(percentage, 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (visualPercentage / 100) * circumference;

  const textColor = theme === 'dark' ? 'text-white' : 'text-black';
  const trackColor = theme === 'dark' ? 'stroke-white/10' : 'stroke-black/10';
  const progressColor = color || 'stroke-orange-500';

  return (
    <div className="flex flex-col items-center justify-center group">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transition-transform duration-500 group-hover:scale-110">
        {/* Background Track */}
        <circle
          className={`transition-colors ${trackColor}`}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Fill */}
        <circle
          className={`transition-all duration-1000 ease-out -rotate-90 origin-center ${progressColor}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xl font-black italic tracking-tighter ${textColor}`}>{visualPercentage}%</span>
      </div>
      </div>
      <p className={`mt-4 text-[9px] font-black uppercase tracking-widest text-center ${textColor} opacity-40 group-hover:opacity-100 transition-opacity`}>
        {label}
      </p>
    </div>
  );
};

export default ProgressRing;
