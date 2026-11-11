import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, Clock, Power } from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  onWake: () => void;
  lang?: 'en' | 'id';
}

export const ScreenSaver: React.FC<Props> = ({ onWake, lang = 'en' }) => {
  const [timeStr, setTimeStr] = useState<string>('00:00:00');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
      setDateStr(
        now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWake = () => {
    sound.playClick();
    onWake();
  };

  useEffect(() => {
    const handleKeyDown = () => {
      handleWake();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      onClick={handleWake}
      className="fixed inset-0 z-50 bg-[#020617] text-white flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden animate-in fade-in duration-700"
    >
      {/* Floating Starfield / Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(circle_at_50%_50%,#1e3a8a_0%,transparent_75%)]" />

      {/* Floating Animated Sleep Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/20 blur-xs animate-pulse"
            style={{
              width: `${12 + (i % 5) * 8}px`,
              height: `${12 + (i % 5) * 8}px`,
              left: `${(i * 19) % 95}%`,
              top: `${(i * 27) % 85}%`,
              animationDuration: `${3 + (i % 4) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Center ScreenSaver Card */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 space-y-4 max-w-lg">
        {/* Pulsing Moon Icon with Zzz */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-sky-500 to-amber-300 flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.5)] border-2 border-white/80 animate-bounce">
            <Moon className="w-12 h-12 text-white fill-white" />
          </div>
          <span className="absolute -top-3 -right-2 text-2xl font-black text-amber-300 animate-pulse font-game">
            Zzz...
          </span>
        </div>

        {/* Big Glow Digital Clock */}
        <div className="space-y-1">
          <div className="text-4xl sm:text-6xl font-black font-mono tracking-widest text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            {timeStr}
          </div>
          <div className="text-sm sm:text-base text-slate-400 font-bold tracking-wide">
            {dateStr}
          </div>
        </div>

        {/* Sleep Mode Banner */}
        <div className="px-5 py-2 rounded-full bg-blue-950/80 border border-cyan-400/50 shadow-lg text-cyan-200 font-bold text-xs sm:text-sm font-game flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>{lang === 'id' ? 'Mode Tidur Aktif (Sleep Mode)' : 'Sleep Mode Active (Stand By)'}</span>
        </div>

        {/* Wake instruction */}
        <p className="text-xs sm:text-sm text-slate-400 animate-pulse font-mono pt-4">
          {lang === 'id'
            ? '✦ Klik di mana saja atau tekan tombol untuk kembali ke layar kunci ✦'
            : '✦ Click anywhere or press any key to return to Lock Screen ✦'}
        </p>
      </div>
    </div>
  );
};
