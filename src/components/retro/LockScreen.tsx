import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { Language, TRANSLATIONS } from '../../utils/i18n';
import { CharacterCustomization, getCharacterAvatarIcon } from '../../types/character';
import { GradeLevel } from '../../types/game';
import { ArrowRight, ShieldCheck, Sparkles, GraduationCap, ChevronUp, ChevronDown, Power, Moon, RotateCcw } from 'lucide-react';

interface Props {
  playerName: string;
  character: CharacterCustomization;
  activeSkinId?: string;
  language: Language;
  gradeLevel: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onSignIn: () => void;
  onSleep?: () => void;
  onRestart?: () => void;
  onShutdown?: () => void;
}

const GRADES: { id: GradeLevel; labelId: string; labelEn: string; category: 'sd' | 'smp' | 'all' }[] = [
  { id: 'sd-1', labelId: 'SD Kelas 1', labelEn: 'SD Grade 1', category: 'sd' },
  { id: 'sd-2', labelId: 'SD Kelas 2', labelEn: 'SD Grade 2', category: 'sd' },
  { id: 'sd-3', labelId: 'SD Kelas 3', labelEn: 'SD Grade 3', category: 'sd' },
  { id: 'sd-4', labelId: 'SD Kelas 4', labelEn: 'SD Grade 4', category: 'sd' },
  { id: 'sd-5', labelId: 'SD Kelas 5', labelEn: 'SD Grade 5', category: 'sd' },
  { id: 'sd-6', labelId: 'SD Kelas 6', labelEn: 'SD Grade 6', category: 'sd' },
  { id: 'smp-1', labelId: 'SMP Kelas 7 (1)', labelEn: 'SMP Class 7', category: 'smp' },
  { id: 'smp-2', labelId: 'SMP Kelas 8 (2)', labelEn: 'SMP Class 8', category: 'smp' },
  { id: 'smp-3', labelId: 'SMP Kelas 9 (3)', labelEn: 'SMP Class 9', category: 'smp' },
  { id: 'all', labelId: 'Semua Tingkat', labelEn: 'All Grades', category: 'all' },
];

export const LockScreen: React.FC<Props> = ({
  playerName,
  character,
  activeSkinId,
  language,
  gradeLevel,
  onSelectGrade,
  onSignIn,
  onSleep,
  onRestart,
  onShutdown,
}) => {
  const [timeStr, setTimeStr] = useState<string>('08:45 AM');
  const [dateStr, setDateStr] = useState<string>('Sunday, November 10');
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isGradeMenuOpen, setIsGradeMenuOpen] = useState<boolean>(false);
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState<boolean>(false);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const handleSignInClick = () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    // Explicit user action: Transitioning from Lock Screen to Desktop triggers authentic Windows startup sound!
    sound.playStartupSound();
    setTimeout(() => {
      onSignIn();
    }, 450);
  };

  const currentGradeObj = GRADES.find((g) => g.id === gradeLevel) || GRADES[4];
  const currentGradeLabel = language === 'id' ? currentGradeObj.labelId : currentGradeObj.labelEn;

  return (
    <div className="fixed inset-0 z-50 select-none flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0a235c] via-[#103a8a] to-[#041334] animate-in fade-in duration-300">
      {/* Bliss Horizon Atmosphere Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_40%,#38bdf8_0%,transparent_65%)]" />

      {/* Top Header Strip with Windows XP Branding */}
      <div className="relative z-10 px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-cyan-400/20 bg-blue-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg border border-white">
            <span className="text-white text-sm font-black">SN</span>
          </div>
          <div>
            <span className="text-white font-extrabold tracking-wide text-sm font-game">
              STEM NEXUS WORKSTATION
            </span>
            <span className="text-[10px] text-cyan-300 block font-mono">
              Windows XP Arcade Edition
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-base sm:text-lg font-bold text-white font-mono">{timeStr}</div>
          <div className="text-xs text-blue-200">{dateStr}</div>
        </div>
      </div>

      {/* Center Sign-In Box */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4 my-auto">
        <div className="w-full max-w-sm rounded-3xl p-6 sm:p-7 aero-window border-2 border-[#6ec3ff] bg-[#103577]/90 shadow-[0_0_50px_rgba(56,189,248,0.4)] backdrop-blur-xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
          {/* User Avatar Circle */}
          <div className="relative mb-3">
            <div
              className="w-20 h-20 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-4xl overflow-hidden transition-all"
              style={{ backgroundColor: character.primaryColor || '#3b82f6' }}
            >
              {getCharacterAvatarIcon(character, activeSkinId)}
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 border-2 border-white shadow">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white font-game drop-shadow">
            {playerName}
          </h2>
          <div className="text-xs text-cyan-200 font-bold mb-5 font-mono">
            STEM Cadet · Level 24
          </div>

          {/* Sign In Button */}
          <button
            type="button"
            onClick={handleSignInClick}
            disabled={isSigningIn}
            className="w-full py-3.5 px-6 rounded-2xl aero-button text-white font-game font-extrabold text-base shadow-xl border-2 border-white flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600"
          >
            <span>{isSigningIn ? t.signingIn : t.signIn}</span>
            <ArrowRight className="w-5 h-5 text-yellow-300 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Bottom Bar with Grade Selector on Left Down Side & Power Options on Right Down Side */}
      <div className="relative z-20 px-6 sm:px-8 py-3.5 flex items-center justify-between text-xs text-blue-200 border-t border-cyan-400/20 bg-blue-950/70 backdrop-blur-md">
        {/* Left Down Side: Single Grade Button with Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsGradeMenuOpen(!isGradeMenuOpen);
              setIsPowerMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border-2 border-amber-400/70 text-amber-300 hover:text-white hover:bg-slate-800 font-bold shadow-lg cursor-pointer transition-all active:scale-95"
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>{currentGradeLabel}</span>
            {isGradeMenuOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {/* Floating Grade Selector Popup */}
          {isGradeMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsGradeMenuOpen(false)}
              />
              <div className="absolute bottom-12 left-0 z-40 w-72 bg-[#0d2757] border-2 border-cyan-400 rounded-2xl p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>{language === 'id' ? 'Pilih Jenjang Kelas Siswa:' : 'Select Student Grade Level:'}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {GRADES.map((g) => {
                    const isSelected = gradeLevel === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          onSelectGrade(g.id);
                          setIsGradeMenuOpen(false);
                        }}
                        className={`px-2.5 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 font-black shadow ring-2 ring-yellow-200'
                            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {language === 'id' ? g.labelId : g.labelEn}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Center Info */}
        <div className="hidden sm:flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>
            {language === 'id' ? 'Kurikulum SD & SMP Terintegrasi' : 'Elementary & Junior High Curriculum Active'}
          </span>
          <span className="font-mono text-cyan-300 text-[11px]">Build v2.4</span>
        </div>

        {/* Right Down Side: Single Power Options Button with Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsPowerMenuOpen(!isPowerMenuOpen);
              setIsGradeMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border-2 border-red-500/80 text-white font-extrabold shadow-lg cursor-pointer transition-all active:scale-95"
            title="Power Options (Sleep, Restart, Turn Off)"
          >
            <div className="w-4 h-4 rounded-full bg-red-600 border border-white flex items-center justify-center">
              <Power className="w-2.5 h-2.5 text-white" />
            </div>
            <span>{language === 'id' ? 'Daya' : 'Power'}</span>
            {isPowerMenuOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {/* Floating Power Options Popup (appears near up of that button) */}
          {isPowerMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsPowerMenuOpen(false)}
              />
              <div className="absolute bottom-12 right-0 z-40 w-52 bg-[#0c224e] border-2 border-[#ef4444] rounded-2xl p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-150 space-y-1">
                <div className="text-[10px] font-black text-rose-300 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5 border-b border-red-500/30">
                  <Power className="w-3.5 h-3.5 text-rose-400" />
                  <span>{language === 'id' ? 'Opsi Daya Komputer' : 'Power Options'}</span>
                </div>

                {/* Sleep Option */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsPowerMenuOpen(false);
                    onSleep?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-100 hover:text-white hover:bg-amber-600/30 border border-transparent hover:border-amber-400/50 transition-all text-left cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shrink-0 shadow">
                    <Moon className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                  <div>
                    <div className="font-extrabold text-white">{language === 'id' ? 'Tidur (Sleep)' : 'Sleep'}</div>
                    <div className="text-[10px] text-amber-200">{language === 'id' ? 'Mode hemat daya' : 'Low power mode'}</div>
                  </div>
                </button>

                {/* Restart Option */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsPowerMenuOpen(false);
                    onRestart?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-100 hover:text-white hover:bg-emerald-600/30 border border-transparent hover:border-emerald-400/50 transition-all text-left cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow">
                    <RotateCcw className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <div className="font-extrabold text-white">{language === 'id' ? 'Mulai Ulang' : 'Restart'}</div>
                    <div className="text-[10px] text-emerald-200">{language === 'id' ? 'Boot ulang sistem' : 'Reboot workstation'}</div>
                  </div>
                </button>

                {/* Turn Off Option */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsPowerMenuOpen(false);
                    onShutdown?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-100 hover:text-white hover:bg-red-600/30 border border-transparent hover:border-red-400/50 transition-all text-left cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shrink-0 shadow">
                    <Power className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <div className="font-extrabold text-white">{language === 'id' ? 'Matikan' : 'Turn Off'}</div>
                    <div className="text-[10px] text-rose-200">{language === 'id' ? 'Matikan daya PC' : 'Shut down PC'}</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
