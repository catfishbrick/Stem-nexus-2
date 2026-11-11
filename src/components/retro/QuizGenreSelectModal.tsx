import React from 'react';
import { GameGenre } from '../../types/game';
import { sound } from '../../utils/audio';
import { Gamepad2 } from 'lucide-react';
import { RetroAppWindow } from './RetroAppWindow';

interface Props {
  isOpen: boolean;
  isMinimized?: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onSelectGenre: (genre: GameGenre) => void;
  lang?: 'en' | 'id';
}

interface GenreOption {
  genre: GameGenre;
  title: string;
  titleId: string;
  desc: string;
  descId: string;
  icon: string;
  badge: string;
  badgeId: string;
  bgGrad: string;
  borderColor: string;
}

const GENRE_OPTIONS: GenreOption[] = [
  {
    genre: 'racing',
    title: '4-Lane Turbo Racing',
    titleId: 'Balapan Turbo 4-Jalur',
    desc: 'Stop at the checkpoint, choose the lane (A/B/C/D), and engage nitro boost!',
    descId: 'Berhenti di pos, kemudikan ke jalur jawaban A/B/C/D, lalu injak gas nitro!',
    icon: '🏎️',
    badge: '4-LANE DRIVING',
    badgeId: 'KUIS BALAP MOBIL',
    bgGrad: 'from-blue-950 via-cyan-950 to-slate-900',
    borderColor: 'border-cyan-400',
  },
  {
    genre: 'adventure',
    title: '4-Block Mystery Platformer',
    titleId: 'Petualangan Mario 4-Balok',
    desc: 'Jump underneath and hit the yellow [?] block (A, B, C, D) to submit answer!',
    descId: 'Lompat dan sundul balok kuning [?] bertanda A, B, C, atau D dari bawah!',
    icon: '🍄',
    badge: 'MARIO PLATFORMER',
    badgeId: 'PLATFORMER MARIO',
    bgGrad: 'from-amber-950 via-yellow-950 to-slate-900',
    borderColor: 'border-amber-400',
  },
  {
    genre: 'basketball',
    title: 'Precision Basketball Shootout',
    titleId: 'Tembakan Bola Basket STEM',
    desc: 'Aim and launch basketballs into the correct answer hoop!',
    descId: 'Arahkan dan tembakkan bola basket ke dalam ring jawaban yang tepat!',
    icon: '🏀',
    badge: 'BASKETBALL',
    badgeId: 'BOLA BASKET',
    bgGrad: 'from-orange-950 via-amber-950 to-slate-900',
    borderColor: 'border-orange-400',
  },
  {
    genre: 'soccer',
    title: 'Penalty Shootout Arena',
    titleId: 'Adu Penalti Sepak Bola',
    desc: 'Curl your free kick past the goalie into the correct top or bottom corner!',
    descId: 'Tendang bola melengkung ke sudut gawang jawaban yang benar melewati kiper!',
    icon: '⚽',
    badge: 'SOCCER STRIKE',
    badgeId: 'TENDANGAN PENALTI',
    bgGrad: 'from-emerald-950 via-teal-950 to-slate-900',
    borderColor: 'border-emerald-400',
  },
  {
    genre: 'shooter',
    title: 'Galactic Target Shooter',
    titleId: 'Penembak Sasaran Galaksi',
    desc: 'Aim your plasma blaster and lock on to correct target drones!',
    descId: 'Bidik blaster plasma dan tembak drone target berlabel jawaban yang tepat!',
    icon: '🎯',
    badge: 'TARGET SHOOTER',
    badgeId: 'PENEMBAK SASARAN',
    bgGrad: 'from-purple-950 via-indigo-950 to-slate-900',
    borderColor: 'border-purple-400',
  },
  {
    genre: 'rpg',
    title: 'Turn-Based Monster Battle',
    titleId: 'Pertarungan Monster Turn-Based',
    desc: 'Select your tactical spell attack (A, B, C, D) to deal super-effective damage!',
    descId: 'Pilih jurus serangan taktis A, B, C, D untuk mengalahkan monster penjaga!',
    icon: '⚔️',
    badge: 'RPG BATTLE',
    badgeId: 'PERTARUNGAN RPG',
    bgGrad: 'from-rose-950 via-red-950 to-slate-900',
    borderColor: 'border-rose-400',
  },
  {
    genre: 'puzzle',
    title: 'Pattern Match & Logic Gates',
    titleId: 'Teka-Teki Pola Logika',
    desc: 'Solve sequential pattern puzzles and logic gates to submit the correct answer!',
    descId: 'Pecahkan teka-teki logika sekuensial untuk mengunci jawaban yang benar!',
    icon: '🧩',
    badge: 'PUZZLE LOGIC',
    badgeId: 'LOGIKA PUZZLE',
    bgGrad: 'from-sky-950 via-blue-950 to-slate-900',
    borderColor: 'border-sky-400',
  },
  {
    genre: 'classic',
    title: 'Classic Normal Quiz (No Minigame)',
    titleId: 'Kuis Klasik Standar (Tanpa Minigame)',
    desc: 'Direct multiple-choice questions without minigames for focused study sessions.',
    descId: 'Format kuis pilihan ganda standar tanpa minigame untuk belajar fokus.',
    icon: '📝',
    badge: 'CLASSIC STUDY',
    badgeId: 'BELAJAR STANDAR',
    bgGrad: 'from-slate-900 via-blue-950 to-slate-900',
    borderColor: 'border-amber-300',
  },
];

export const QuizGenreSelectModal: React.FC<Props> = ({
  isOpen,
  isMinimized = false,
  onClose,
  onMinimize,
  onSelectGenre,
  lang = 'en',
}) => {
  if (!isOpen) return null;

  return (
    <RetroAppWindow
      appId="genre-select"
      title={lang === 'id' ? 'Pilih Genre Minigame Kuis' : 'Select Quiz Gameplay Genre'}
      icon={<Gamepad2 className="w-4 h-4 text-amber-300" />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      onClose={onClose}
      onMinimize={onMinimize}
      initialWidth={780}
      initialHeight={560}
      theme="aero"
    >
      <div className="flex flex-col flex-1 bg-slate-950/95 min-h-0 text-white font-game text-xs">
        {/* Header subtitle */}
        <div className="p-3 sm:p-4 bg-slate-900/90 border-b border-slate-800 text-center shrink-0">
          <h3 className="text-base sm:text-lg font-black text-amber-300">
            {lang === 'id' ? 'Bagaimana Anda ingin menjawab kuis ini?' : 'How would you like to play this quiz?'}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
            {lang === 'id'
              ? 'Pilihan mode ini akan berlaku untuk setiap nomor soal selama sesi kuis berlangsung.'
              : 'The selected gameplay genre will apply to all questions in this challenge session.'}
          </p>
        </div>

        {/* 8 Genres Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 bg-slate-950">
          {GENRE_OPTIONS.map((opt) => (
            <button
              key={opt.genre}
              type="button"
              onClick={() => {
                sound.playClick();
                sound.playSuccess();
                onSelectGenre(opt.genre);
              }}
              className={`p-3 rounded-2xl border-2 ${opt.borderColor} bg-gradient-to-b ${opt.bgGrad} hover:scale-102 hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] active:scale-98 transition-all flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl sm:text-3xl filter drop-shadow group-hover:scale-110 transition-transform">
                    {opt.icon}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 bg-black/40 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono">
                    {lang === 'id' ? opt.badgeId : opt.badge}
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {lang === 'id' ? opt.titleId : opt.title}
                </div>

                <div className="text-[10px] text-slate-300 mt-1 line-clamp-3 leading-relaxed">
                  {lang === 'id' ? opt.descId : opt.desc}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-cyan-300 font-bold">
                  {lang === 'id' ? 'MAIN SEKARANG' : 'PLAY NOW'}
                </span>
                <span className="text-xs text-amber-400 group-hover:translate-x-1 transition-transform">
                  ➔
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-900 border-t border-slate-800 p-2.5 px-4 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>
            {lang === 'id'
              ? 'Tips: Anda dapat mengganti genre kapan saja sebelum kuis dimulai.'
              : 'Tip: You can switch genres anytime before starting a quiz.'}
          </span>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
          >
            {lang === 'id' ? 'Batal' : 'Cancel'}
          </button>
        </div>
      </div>
    </RetroAppWindow>
  );
};
