import React, { useState } from 'react';
import {
  FileText,
  Music,
  Calculator as CalcIcon,
  Palette,
  Clock,
  Sparkles,
  Gamepad2,
  Settings,
  HelpCircle,
  Search,
  Power,
  ChevronRight,
  Trophy,
  Users,
  Activity,
  LogOut,
  X,
  Compass,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { NavTab } from './RetroSidebar';
import { CharacterCustomization, getCharacterAvatarIcon } from '../../types/character';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectNav: (tab: NavTab) => void;
  onOpenSettings?: () => void;
  onOpenPowerDialog?: () => void;
  onOpenCalculator?: () => void;
  onOpenMusic?: () => void;
  onOpenNotepad?: () => void;
  onOpenClock?: () => void;
  onOpenPaint?: () => void;
  onOpenTaskManager?: () => void;
  onOpenLibrary?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenAchievements?: () => void;
  onOpenCredits?: () => void;
  onOpenProfile?: () => void;
  onLogOff?: () => void;
  playerName: string;
  character?: CharacterCustomization;
  activeSkinId?: string;
  lang?: 'en' | 'id';
}

export const RetroStartMenu: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectNav,
  onOpenSettings,
  onOpenPowerDialog,
  onOpenCalculator,
  onOpenMusic,
  onOpenNotepad,
  onOpenClock,
  onOpenPaint,
  onOpenTaskManager,
  onOpenLibrary,
  onOpenLeaderboard,
  onOpenAchievements,
  onOpenCredits,
  onOpenProfile,
  onLogOff,
  playerName,
  character,
  activeSkinId,
  lang = 'en',
}) => {
  const [showAllPrograms, setShowAllPrograms] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  if (!isOpen) return null;

  const avatarBg = character?.primaryColor || '#3b82f6';
  const avatarIcon = getCharacterAvatarIcon(character, activeSkinId);

  // Search catalog items
  const catalog = [
    { id: 'quiz', name: 'STEM Quiz Arena', desc: 'Arcade Quiz Engine (SD & SMP)', icon: <Gamepad2 className="w-4 h-4 text-amber-500" />, action: () => { onSelectNav('quiz'); onClose(); } },
    { id: 'music', name: 'Windows Media Player', desc: 'STEM Odyssey Audio Player', icon: <Music className="w-4 h-4 text-emerald-500" />, action: () => { onOpenMusic?.(); onClose(); } },
    { id: 'calculator', name: 'Kalkulator STEM', desc: 'Standard & Scientific Calculator', icon: <CalcIcon className="w-4 h-4 text-blue-500" />, action: () => { onOpenCalculator?.(); onClose(); } },
    { id: 'notepad', name: 'Notepad Kadet', desc: 'STEM Notes and formulas', icon: <FileText className="w-4 h-4 text-sky-500" />, action: () => { onOpenNotepad?.(); onClose(); } },
    { id: 'paint', name: 'Paint Studio', desc: 'Diagram & Sketch drawing', icon: <Palette className="w-4 h-4 text-pink-500" />, action: () => { onOpenPaint?.(); onClose(); } },
    { id: 'clock', name: 'Jam & Stopwatch', desc: 'Real-time clock, timer & alarm', icon: <Clock className="w-4 h-4 text-yellow-600" />, action: () => { onOpenClock?.(); onClose(); } },
    { id: 'taskmgr', name: 'Task Manager (Pengelola Tugas)', desc: 'CPU, RAM & Process manager', icon: <Activity className="w-4 h-4 text-emerald-600" />, action: () => { onOpenTaskManager?.(); onClose(); } },
    { id: 'library', name: 'Curriculum Library', desc: 'Materi Belajar SD & SMP', icon: <Sparkles className="w-4 h-4 text-purple-500" />, action: () => { onOpenLibrary?.(); onClose(); } },
    { id: 'leaderboard', name: 'Leaderboard', desc: 'Peringkat Kadet STEM Global', icon: <Users className="w-4 h-4 text-indigo-500" />, action: () => { onOpenLeaderboard?.(); onClose(); } },
    { id: 'badges', name: 'Achievements & Badges', desc: 'Pencapaian & Medali Belajar', icon: <Trophy className="w-4 h-4 text-amber-500" />, action: () => { onOpenAchievements?.(); onClose(); } },
    { id: 'settings', name: 'Control Panel', desc: 'Pengaturan OS & Karakter', icon: <Settings className="w-4 h-4 text-slate-600" />, action: () => { onOpenSettings?.(); onClose(); } },
    { id: 'profile', name: 'Kustomisasi Profil', desc: 'Ubah avatar, skin & nama kadet', icon: <Compass className="w-4 h-4 text-blue-600" />, action: () => { onOpenProfile?.(); onClose(); } },
  ];

  const filteredCatalog = catalog.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Start Menu Main Window */}
      <div className="fixed bottom-10 left-1 z-50 w-[430px] max-w-[95vw] rounded-t-lg overflow-hidden border-2 border-[#0055ea] shadow-[0_10px_40px_rgba(0,0,0,0.65)] bg-white select-none animate-in fade-in slide-in-from-bottom-2 duration-150 font-sans text-xs flex flex-col">
        {/* TOP BLUE HEADER */}
        <div className="h-16 px-4 bg-gradient-to-r from-[#185bd8] via-[#2478f2] to-[#185bd8] border-b-2 border-[#0055ea] flex items-center justify-between shadow-inner shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              if (onOpenProfile) onOpenProfile();
              onClose();
            }}
            className="flex items-center gap-3.5 text-left group cursor-pointer hover:opacity-95 transition-opacity"
            title="Klik untuk membuka kustomisasi karakter"
          >
            {/* Framed Avatar */}
            <div className="relative p-1 bg-white/90 rounded border-2 border-white shadow-md group-hover:scale-105 transition-transform">
              <div
                className="w-10 h-10 rounded flex items-center justify-center text-2xl shadow-inner overflow-hidden"
                style={{ backgroundColor: avatarBg }}
              >
                {avatarIcon}
              </div>
            </div>
            {/* User Name */}
            <div className="overflow-hidden">
              <div className="font-extrabold text-white text-base drop-shadow-md truncate">
                {playerName || 'Administrator'}
              </div>
              <div className="text-[11px] text-cyan-200 font-bold truncate">
                STEM Nexus Cadet • Level 24
              </div>
            </div>
          </button>

          {/* Quick Search toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsSearchActive(!isSearchActive);
            }}
            className={`px-2 py-1 rounded text-[11px] font-bold border flex items-center gap-1 transition-colors ${
              isSearchActive
                ? 'bg-amber-300 text-slate-900 border-amber-500 shadow'
                : 'bg-white/20 text-white border-white/40 hover:bg-white/30'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>

        {/* SEARCH BAR (Toggled or Always available) */}
        {isSearchActive && (
          <div className="bg-[#e8f1ff] p-2 border-b border-[#96b8e8] flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama aplikasi, materi, atau kuis..."
                className="w-full pl-7 pr-7 py-1 text-xs border border-blue-400 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* BODY AREA - If Search Active with Query, show search results; otherwise show 2-column menu */}
        {isSearchActive && searchQuery.trim() !== '' ? (
          <div className="p-2 min-h-[360px] max-h-[400px] overflow-y-auto bg-slate-50 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
              Hasil Pencarian ({filteredCatalog.length})
            </div>
            {filteredCatalog.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                Tidak ada aplikasi atau menu yang cocok dengan "{searchQuery}".
              </div>
            ) : (
              filteredCatalog.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    item.action();
                  }}
                  className="w-full p-2 rounded hover:bg-[#2f71cd] hover:text-white flex items-center gap-3 text-left cursor-pointer group transition-colors bg-white border border-slate-200"
                >
                  <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-white/20">
                    {item.icon}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 group-hover:text-white truncate">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-slate-500 group-hover:text-blue-100 truncate">
                      {item.desc}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          /* TWO-COLUMN BODY */
          <div className="flex flex-1 min-h-[380px]">
            {/* LEFT COLUMN (WHITE) - Pinned Apps */}
            <div className="w-[52%] bg-white p-2 flex flex-col justify-between border-r border-[#96b8e8]">
              <div className="space-y-1">
                {/* STEM Quiz Arena */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSelectNav('quiz');
                    onClose();
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#2f71cd] hover:text-white flex items-center gap-2.5 text-left cursor-pointer group transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xs shrink-0">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 group-hover:text-white truncate">
                      STEM Quiz Arena
                    </div>
                    <div className="text-[10px] text-slate-500 group-hover:text-blue-100 truncate">
                      {lang === 'id' ? 'Kuis Multi-Genre' : 'Arcade Quiz Engine'}
                    </div>
                  </div>
                </button>

                {/* Windows Media Player (Music App) */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onOpenMusic) onOpenMusic();
                    onClose();
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#2f71cd] hover:text-white flex items-center gap-2.5 text-left cursor-pointer group transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-cyan-500 flex items-center justify-center text-white shadow-xs shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 group-hover:text-white truncate">
                      Windows Media Player
                    </div>
                    <div className="text-[10px] text-slate-500 group-hover:text-blue-100 truncate">
                      STEM Odyssey Playlist
                    </div>
                  </div>
                </button>

                {/* Calculator App */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onOpenCalculator) onOpenCalculator();
                    onClose();
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#2f71cd] hover:text-white flex items-center gap-2.5 text-left cursor-pointer group transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-[#3b82f6] flex items-center justify-center text-white shadow-xs shrink-0">
                    <CalcIcon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 group-hover:text-white truncate">
                      Kalkulator
                    </div>
                    <div className="text-[10px] text-slate-500 group-hover:text-blue-100 truncate">
                      Standard & Sains
                    </div>
                  </div>
                </button>

                {/* Task Manager App */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onOpenTaskManager) onOpenTaskManager();
                    onClose();
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#2f71cd] hover:text-white flex items-center gap-2.5 text-left cursor-pointer group transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white shadow-xs shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 group-hover:text-white truncate">
                      Task Manager
                    </div>
                    <div className="text-[10px] text-slate-500 group-hover:text-blue-100 truncate">
                      CPU, RAM & Proses
                    </div>
                  </div>
                </button>

                {/* Notepad App */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onOpenNotepad) onOpenNotepad();
                    onClose();
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#2f71cd] hover:text-white flex items-center gap-2.5 text-left cursor-pointer group transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-sky-100 border border-sky-400 flex items-center justify-center text-blue-700 shadow-xs shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 group-hover:text-white truncate">
                      Notepad
                    </div>
                    <div className="text-[10px] text-slate-500 group-hover:text-blue-100 truncate">
                      Catatan Kadet
                    </div>
                  </div>
                </button>

                {/* Paint App */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onOpenPaint) onOpenPaint();
                    onClose();
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#2f71cd] hover:text-white flex items-center gap-2.5 text-left cursor-pointer group transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 group-hover:text-white truncate">
                      Paint
                    </div>
                    <div className="text-[10px] text-slate-500 group-hover:text-blue-100 truncate">
                      Studio Gambar Diagram
                    </div>
                  </div>
                </button>

                {/* Clock App */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onOpenClock) onOpenClock();
                    onClose();
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#2f71cd] hover:text-white flex items-center gap-2.5 text-left cursor-pointer group transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 group-hover:text-white truncate">
                      Jam & Pewaktu
                    </div>
                    <div className="text-[10px] text-slate-500 group-hover:text-blue-100 truncate">
                      Pewaktu Belajar
                    </div>
                  </div>
                </button>
              </div>

              {/* Bottom Separator & All Programs */}
              <div className="pt-2 border-t border-slate-200 relative">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowAllPrograms(!showAllPrograms);
                  }}
                  className="w-full py-2 px-3 rounded hover:bg-[#2f71cd] hover:text-white flex items-center justify-between font-extrabold text-slate-900 text-xs cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] font-black">
                      ▶
                    </div>
                    <span>All Programs</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </button>

                {/* Flyout Submenu for All Programs */}
                {showAllPrograms && (
                  <div className="absolute bottom-10 left-full ml-1 w-56 bg-white border-2 border-[#0055ea] rounded shadow-xl p-1 space-y-0.5 z-50">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onSelectNav('quiz');
                        onClose();
                      }}
                      className="w-full p-1.5 hover:bg-[#2f71cd] hover:text-white text-left font-bold rounded flex items-center gap-2 text-[11px]"
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Semua Kuis Minigame</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        if (onOpenTaskManager) onOpenTaskManager();
                        onClose();
                      }}
                      className="w-full p-1.5 hover:bg-[#2f71cd] hover:text-white text-left font-bold rounded flex items-center gap-2 text-[11px]"
                    >
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Task Manager (Windows XP)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        if (onOpenLibrary) onOpenLibrary();
                        onClose();
                      }}
                      className="w-full p-1.5 hover:bg-[#2f71cd] hover:text-white text-left font-bold rounded flex items-center gap-2 text-[11px]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      <span>Modul Belajar SD & SMP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        if (onOpenLeaderboard) onOpenLeaderboard();
                        onClose();
                      }}
                      className="w-full p-1.5 hover:bg-[#2f71cd] hover:text-white text-left font-bold rounded flex items-center gap-2 text-[11px]"
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Papan Peringkat Kelas</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        if (onOpenAchievements) onOpenAchievements();
                        onClose();
                      }}
                      className="w-full p-1.5 hover:bg-[#2f71cd] hover:text-white text-left font-bold rounded flex items-center gap-2 text-[11px]"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>STEM Badges & Medals</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN (PALE BLUE #d3e5fa) - System Folders */}
            <div className="w-[48%] bg-[#d3e5fa] p-2 flex flex-col justify-between text-[#0c327d] font-bold text-[11px]">
              <div className="space-y-0.5">
                {/* STEM Badges & Achievements */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onOpenAchievements) onOpenAchievements();
                    onClose();
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#316ac5] hover:text-white flex items-center gap-2 text-left cursor-pointer transition-colors"
                >
                  <Trophy className="w-4 h-4 text-amber-500 fill-amber-300" />
                  <span>STEM Badges & Medals</span>
                </button>

                {/* Class Rankings / Leaderboard */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onOpenLeaderboard) onOpenLeaderboard();
                    onClose();
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#316ac5] hover:text-white flex items-center gap-2 text-left cursor-pointer transition-colors"
                >
                  <Users className="w-4 h-4 text-yellow-600" />
                  <span>Leaderboard</span>
                </button>

                {/* Learning Library */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onOpenLibrary) onOpenLibrary();
                    onClose();
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#316ac5] hover:text-white flex items-center gap-2 text-left cursor-pointer transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-cyan-600" />
                  <span>{lang === 'id' ? 'Materi & Modul' : 'Curriculum Modules'}</span>
                </button>

                <div className="my-1.5 border-b border-[#a7c5ea]" />

                {/* Control Panel (Settings with Profile) */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onOpenSettings) onOpenSettings();
                    onClose();
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#316ac5] hover:text-white flex items-center gap-2 text-left cursor-pointer transition-colors"
                >
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span>Control Panel</span>
                </button>

                {/* Profile Customization */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onOpenProfile) onOpenProfile();
                    onClose();
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#316ac5] hover:text-white flex items-center gap-2 text-left cursor-pointer transition-colors"
                >
                  <Compass className="w-4 h-4 text-blue-700" />
                  <span>Profil & Avatar</span>
                </button>

                <div className="my-1.5 border-b border-[#a7c5ea]" />

                {/* Help & Support */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onOpenCredits) onOpenCredits();
                    else if (onOpenSettings) onOpenSettings();
                    onClose();
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#316ac5] hover:text-white flex items-center gap-2 text-left cursor-pointer transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-sky-600" />
                  <span>Help and Support</span>
                </button>

                {/* Search Menu Button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsSearchActive(true);
                  }}
                  className="w-full p-1.5 rounded hover:bg-[#316ac5] hover:text-white flex items-center gap-2 text-left cursor-pointer transition-colors"
                >
                  <Search className="w-4 h-4 text-blue-700" />
                  <span>Search Programs</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM TASKBAR STRIP WITH LOG OFF & TURN OFF COMPUTER */}
        <div className="h-12 bg-gradient-to-r from-[#1952be] via-[#2167e8] to-[#1952be] border-t-2 border-[#0055ea] px-3 flex items-center justify-between text-white shrink-0">
          {/* Log Off Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              if (onLogOff) onLogOff();
              onClose();
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-600/60 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border border-white flex items-center justify-center shadow">
              <LogOut className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-xs drop-shadow">
              Log Off
            </span>
          </button>

          {/* Turn Off Computer Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              if (onOpenPowerDialog) onOpenPowerDialog();
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-blue-600/60 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-b from-red-500 to-red-700 border border-white flex items-center justify-center shadow">
              <Power className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-xs drop-shadow">
              Turn Off Computer
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
