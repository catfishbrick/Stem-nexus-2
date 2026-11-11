import React, { useState } from 'react';
import { User, Check, Edit2, Sparkles, Award } from 'lucide-react';
import { sound } from '../../utils/audio';
import { CharacterCustomization, getCharacterAvatarIcon } from '../../types/character';
import { RetroAppWindow } from './RetroAppWindow';

interface Props {
  isOpen: boolean;
  isMinimized?: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  playerName: string;
  onUpdateName: (name: string) => void;
  totalScore: number;
  maxScore: number;
  coins: number;
  gems: number;
  character?: CharacterCustomization;
  activeSkinId?: string;
  onOpenCustomization?: () => void;
}

export const PlayerProfileModal: React.FC<Props> = ({
  isOpen,
  isMinimized = false,
  onClose,
  onMinimize,
  playerName,
  onUpdateName,
  totalScore,
  maxScore,
  coins,
  gems,
  character,
  activeSkinId,
  onOpenCustomization,
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(playerName);

  if (!isOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      setEditing(false);
      sound.playSuccess();
    }
  };

  const level = 24 + Math.floor(totalScore / 100);

  return (
    <RetroAppWindow
      appId="profile"
      title="Cadet ID & Profile Card"
      icon={<User className="w-4 h-4 text-cyan-200" />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      onClose={onClose}
      onMinimize={onMinimize}
      initialWidth={460}
      initialHeight={460}
      theme="aero"
    >
      <div className="p-4 sm:p-5 space-y-4 font-game text-xs flex-1 flex flex-col justify-between">
        {/* Avatar & Header */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-950/80 border border-blue-400/40 shadow-inner">
          <div
            className="relative w-16 h-16 rounded-full border-3 border-white/90 shadow-xl shrink-0 flex items-center justify-center text-3xl overflow-hidden transition-all"
            style={{ backgroundColor: character?.primaryColor || '#3b82f6' }}
          >
            {getCharacterAvatarIcon(character, activeSkinId)}
          </div>

          <div className="space-y-1 flex-1">
            {editing ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={20}
                  className="w-full bg-blue-900 border border-cyan-400 rounded-lg px-2 py-1 text-white font-bold text-sm focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 rounded bg-emerald-500 hover:bg-emerald-400 text-white shadow"
                >
                  <Check className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm drop-shadow">{playerName}</span>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="p-1 rounded hover:bg-white/10 text-cyan-300"
                    title="Edit Name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {onOpenCustomization && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onClose();
                      onOpenCustomization();
                    }}
                    className="px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold border border-cyan-300 shadow cursor-pointer"
                  >
                    Customize Character
                  </button>
                )}
              </div>
            )}

            <div className="text-[11px] text-cyan-200">
              Rank Level: <strong className="text-yellow-300 font-mono">Lv. {level}</strong>
            </div>
            <div className="text-[10px] text-slate-300">
              School Project Class 10A • STEM Explorer
            </div>
          </div>
        </div>

        {/* Career Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-400/30">
            <span className="text-[10px] text-blue-300 block">Total Curriculum Score</span>
            <span className="font-mono text-base font-bold text-yellow-300">
              {totalScore} / {maxScore} pts
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-400/30">
            <span className="text-[10px] text-blue-300 block">Cadet Treasury</span>
            <span className="font-mono text-sm font-bold text-amber-300">
              {coins} 🪙 · {gems} 💎
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-2.5 rounded-2xl aero-button text-white font-bold border border-white/80 shadow"
        >
          Done
        </button>
      </div>
    </RetroAppWindow>
  );
};
