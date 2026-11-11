import React from 'react';
import { RotateCcw, Moon, Power, LogOut } from 'lucide-react';

export type PowerActionType = 'restart' | 'sleep' | 'turn_off' | 'log_off';

interface Props {
  action: PowerActionType | null;
  lang?: 'en' | 'id';
}

export const PowerTransitionDialog: React.FC<Props> = ({ action, lang = 'en' }) => {
  if (!action) return null;

  const getActionConfig = () => {
    switch (action) {
      case 'restart':
        return {
          title: lang === 'id' ? 'Memulai Ulang...' : 'Restarting...',
          subtitle: lang === 'id' ? 'Windows sedang memulai ulang sistem' : 'Windows is rebooting workstation',
          icon: <RotateCcw className="w-6 h-6 text-emerald-400 animate-spin" />,
          bgColor: 'from-blue-900 to-indigo-950',
          borderColor: 'border-emerald-400',
        };
      case 'sleep':
        return {
          title: lang === 'id' ? 'Masuk Mode Tidur...' : 'Entering Sleep Mode...',
          subtitle: lang === 'id' ? 'Menyimpan sesi dan masuk mode hemat daya' : 'Saving state and transitioning to Stand By',
          icon: <Moon className="w-6 h-6 text-amber-400 fill-amber-300 animate-pulse" />,
          bgColor: 'from-slate-900 to-blue-950',
          borderColor: 'border-amber-400',
        };
      case 'turn_off':
        return {
          title: lang === 'id' ? 'Mematikan Komputer...' : 'Shutting down...',
          subtitle: lang === 'id' ? 'Menutup semua aplikasi dan mematikan daya' : 'Windows is shutting down',
          icon: <Power className="w-6 h-6 text-rose-500 animate-pulse" />,
          bgColor: 'from-slate-950 to-red-950',
          borderColor: 'border-rose-500',
        };
      case 'log_off':
        return {
          title: lang === 'id' ? 'Keluar Sesi...' : 'Logging off...',
          subtitle: lang === 'id' ? 'Menyimpan pengaturan pengguna' : 'Saving user profile and logging off',
          icon: <LogOut className="w-6 h-6 text-cyan-400 animate-bounce" />,
          bgColor: 'from-blue-950 to-slate-950',
          borderColor: 'border-cyan-400',
        };
    }
  };

  const config = getActionConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className={`w-full max-w-sm rounded-2xl p-6 bg-gradient-to-b ${config.bgColor} border-2 ${config.borderColor} shadow-[0_0_50px_rgba(0,0,0,0.8)] text-white text-center flex flex-col items-center space-y-4 font-game`}>
        {/* Animated Icon Circle */}
        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
          {config.icon}
        </div>

        {/* Text */}
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-black drop-shadow tracking-wide">
            {config.title}
          </h3>
          <p className="text-xs text-slate-300 font-sans">
            {config.subtitle}
          </p>
        </div>

        {/* Windows XP Bouncing Progress Blocks */}
        <div className="w-48 h-5 bg-slate-950 rounded-md border border-slate-700 p-0.5 overflow-hidden relative shadow-inner">
          <div className="h-full flex gap-1 w-20 animate-[shimmerSweep_1.6s_infinite_linear]">
            <span className="w-3 h-full bg-gradient-to-b from-sky-400 to-blue-600 rounded-xs" />
            <span className="w-3 h-full bg-gradient-to-b from-sky-400 to-blue-600 rounded-xs" />
            <span className="w-3 h-full bg-gradient-to-b from-sky-400 to-blue-600 rounded-xs" />
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-mono">
          Please wait...
        </div>
      </div>
    </div>
  );
};
