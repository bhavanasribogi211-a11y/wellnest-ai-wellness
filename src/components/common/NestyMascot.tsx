import React from 'react';

interface NestyMascotProps {
  mood?: 'happy' | 'wave' | 'doctor' | 'cheer' | 'sleepy';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  bubbleText?: string;
  onClick?: () => void;
  className?: string;
}

export const NestyMascot: React.FC<NestyMascotProps> = ({
  mood = 'happy',
  size = 'md',
  showSpeechBubble = false,
  bubbleText = 'Hello! I am Nesty 🐣',
  onClick,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech bubble if enabled */}
      {showSpeechBubble && bubbleText && (
        <div className="mb-2 px-3 py-1.5 bg-white text-slate-800 rounded-2xl shadow-md border border-purple-100 text-xs font-medium max-w-xs animate-bounce relative z-10 text-center">
          {bubbleText}
          <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-purple-100 rotate-45" />
        </div>
      )}

      {/* Mascot Graphic */}
      <div
        onClick={onClick}
        className={`${sizeMap[size]} relative cursor-pointer transform transition-all duration-300 hover:scale-110 active:scale-95 group`}
        title="Nesty 🐣 Your 24/7 Wellness Companion"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Subtle Glow Ring */}
          <circle cx="50" cy="50" r="46" fill="#FDF4FF" stroke="#F472B6" strokeWidth="1.5" strokeDasharray="3 3" />
          
          {/* Chick Body */}
          <circle cx="50" cy="56" r="34" fill="#FDE047" />
          
          {/* White Belly highlight */}
          <ellipse cx="50" cy="62" rx="22" ry="18" fill="#FEF08A" />

          {/* Cheeks */}
          <ellipse cx="32" cy="58" rx="5" ry="3.5" fill="#F472B6" opacity="0.8" />
          <ellipse cx="68" cy="58" rx="5" ry="3.5" fill="#F472B6" opacity="0.8" />

          {/* Eyes */}
          {mood === 'sleepy' ? (
            <>
              <path d="M28 50 Q34 54 40 50" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M60 50 Q66 54 72 50" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="34" cy="48" r="4.5" fill="#1E293B" />
              <circle cx="35.5" cy="46.5" r="1.5" fill="#FFFFFF" />
              <circle cx="66" cy="48" r="4.5" fill="#1E293B" />
              <circle cx="67.5" cy="46.5" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {/* Beak */}
          <path d="M46 54 L54 54 L50 61 Z" fill="#F97316" />

          {/* Cute Tuft of feathers / Flower */}
          {mood === 'doctor' ? (
            <g transform="translate(42, 14)">
              <rect x="0" y="4" width="16" height="10" rx="3" fill="#FFFFFF" stroke="#EF4444" strokeWidth="1.2" />
              <path d="M8 6 L8 12 M5 9 L11 9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              <ellipse cx="50" cy="22" rx="4" ry="7" fill="#FACC15" transform="rotate(-12 50 22)" />
              <ellipse cx="54" cy="23" rx="3.5" ry="6" fill="#FDE047" transform="rotate(18 54 23)" />
              {/* Little Flower */}
              <circle cx="58" cy="26" r="3" fill="#EC4899" />
              <circle cx="58" cy="26" r="1.2" fill="#FDE047" />
            </g>
          )}

          {/* Little Wings */}
          {mood === 'wave' ? (
            <>
              <ellipse cx="18" cy="50" rx="6" ry="12" fill="#FACC15" transform="rotate(-35 18 50)" />
              <ellipse cx="80" cy="58" rx="6" ry="10" fill="#FACC15" transform="rotate(25 80 58)" />
            </>
          ) : (
            <>
              <ellipse cx="18" cy="58" rx="5.5" ry="10" fill="#FACC15" transform="rotate(-15 18 58)" />
              <ellipse cx="82" cy="58" rx="5.5" ry="10" fill="#FACC15" transform="rotate(15 82 58)" />
            </>
          )}

          {/* Feet */}
          <path d="M42 88 L42 93 M40 93 L44 93" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M58 88 L58 93 M56 93 L60 93" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        {/* Floating Heart indicator on hover */}
        <div className="absolute -top-1 -right-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          💖
        </div>
      </div>
    </div>
  );
};
