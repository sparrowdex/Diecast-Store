'use client';

const ProgressRing = ({ percentage, label, size = 100, strokeWidth = 10, theme = 'dark' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const textColor = theme === 'dark' ? 'text-white' : 'text-black';
  const trackColor = theme === 'dark' ? 'stroke-white/10' : 'stroke-black/10';
  const progressColor = 'stroke-yellow-500';

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
      <div className="flex flex-col items-center -mt-14">
        <span className={`text-2xl font-black italic ${textColor}`}>{percentage}%</span>
      </div>
      <p className={`mt-10 text-[10px] font-mono uppercase tracking-widest text-center ${textColor} opacity-50`}>
        {label}
      </p>
    </div>
  );
};

export default ProgressRing;
