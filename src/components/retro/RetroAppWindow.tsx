import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, Copy, AlertTriangle } from 'lucide-react';
import { sound } from '../../utils/audio';

export interface RetroAppWindowProps {
  appId: string;
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  isMinimized?: boolean;
  isFullscreen?: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onToggleFullscreen?: () => void;
  initialWidth?: number;
  initialHeight?: number;
  initialX?: number;
  initialY?: number;
  confirmCloseWarning?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  theme?: 'xp' | 'aero';
  zIndex?: number;
  onFocus?: () => void;
}

export const RetroAppWindow: React.FC<RetroAppWindowProps> = ({
  appId,
  title,
  icon,
  isOpen,
  isMinimized = false,
  isFullscreen: controlledFullscreen,
  onClose,
  onMinimize,
  onToggleFullscreen,
  initialWidth = 680,
  initialHeight = 480,
  initialX,
  initialY,
  confirmCloseWarning,
  children,
  className = '',
  bodyClassName = '',
  theme = 'xp',
  zIndex = 40,
  onFocus,
}) => {
  const [internalFullscreen, setInternalFullscreen] = useState<boolean>(false);
  const isFullscreen = controlledFullscreen !== undefined ? controlledFullscreen : internalFullscreen;

  const [showConfirmClose, setShowConfirmClose] = useState<boolean>(false);

  // Position for windowed dragging
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window === 'undefined') return { x: 80, y: 50 };
    const w = Math.min(initialWidth, window.innerWidth - 40);
    const h = Math.min(initialHeight, window.innerHeight - 100);
    const defaultX = initialX ?? Math.max(10, Math.round((window.innerWidth - w) / 2));
    const defaultY = initialY ?? Math.max(10, Math.round((window.innerHeight - h - 60) / 2));
    return { x: defaultX, y: defaultY };
  });

  const draggingRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);

  // Re-center on first open
  useEffect(() => {
    if (isOpen && !isFullscreen) {
      const w = Math.min(initialWidth, window.innerWidth - 40);
      const h = Math.min(initialHeight, window.innerHeight - 100);
      setPos((prev) => {
        // Keep previous if on-screen, else center
        if (prev.x >= 0 && prev.x < window.innerWidth - 100 && prev.y >= 0 && prev.y < window.innerHeight - 100) {
          return prev;
        }
        return {
          x: Math.max(10, Math.round((window.innerWidth - w) / 2)),
          y: Math.max(10, Math.round((window.innerHeight - h - 60) / 2)),
        };
      });
    }
  }, [isOpen, initialWidth, initialHeight]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isFullscreen) return;
    // Don't drag if clicked on window buttons
    if ((e.target as HTMLElement).closest('button')) return;

    onFocus?.();
    draggingRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: pos.x,
      initY: pos.y,
    };

    const handlePointerMove = (moveEv: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = moveEv.clientX - draggingRef.current.startX;
      const dy = moveEv.clientY - draggingRef.current.startY;
      const newX = Math.max(-50, Math.min(window.innerWidth - 120, draggingRef.current.initX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, draggingRef.current.initY + dy));
      setPos({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      draggingRef.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleToggleMax = () => {
    sound.playClick();
    if (onToggleFullscreen) {
      onToggleFullscreen();
    } else {
      setInternalFullscreen((prev) => !prev);
    }
  };

  const handleCloseClick = () => {
    sound.playClick();
    if (confirmCloseWarning) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const handleConfirmExit = () => {
    setShowConfirmClose(false);
    onClose();
  };

  if (!isOpen) return null;

  const isAero = theme === 'aero';

  return (
    <>
      {/* Draggable or Fullscreen Window */}
      <div
        onPointerDown={() => onFocus?.()}
        style={
          isFullscreen
            ? {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: '40px', // stays above taskbar (height 40px)
                width: '100vw',
                height: 'calc(100vh - 40px)',
                zIndex,
                display: isMinimized ? 'none' : 'flex',
              }
            : {
                position: 'fixed',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: `${Math.min(initialWidth, window.innerWidth - 20)}px`,
                height: `${Math.min(initialHeight, window.innerHeight - 60)}px`,
                maxWidth: '98vw',
                maxHeight: 'calc(100vh - 50px)',
                zIndex,
                display: isMinimized ? 'none' : 'flex',
              }
        }
        className={`flex flex-col overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150 ${
          isAero
            ? 'aero-window rounded-2xl border-2 border-[#6ec3ff] shadow-[0_12px_40px_rgba(0,0,0,0.6)] bg-[#103577]/95 backdrop-blur-md'
            : 'bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-lg shadow-[0_10px_35px_rgba(0,0,0,0.55)]'
        } ${className}`}
      >
        {/* Title Bar (Draggable) */}
        <div
          onPointerDown={handlePointerDown}
          className={`px-3 py-1.5 flex items-center justify-between text-white shrink-0 select-none ${
            isFullscreen ? 'cursor-default' : 'cursor-move'
          } ${
            isAero
              ? 'bg-gradient-to-r from-[#174899] via-[#2060c5] to-[#3a8ef5] border-b border-white/40'
              : 'bg-gradient-to-r from-[#0058e6] via-[#2484f2] to-[#0058e6] border-b border-[#0047ca]'
          }`}
        >
          {/* Left Title & Icon */}
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm tracking-wide truncate pr-2">
            {icon && <span className="shrink-0">{icon}</span>}
            <span className="truncate drop-shadow">{title}</span>
          </div>

          {/* Right Window Control Buttons (Minimize, Maximize/Restore, Close) */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Minimize */}
            {onMinimize && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  onMinimize();
                }}
                className={`w-5 h-5 rounded flex items-center justify-center text-[10px] transition-all cursor-pointer ${
                  isAero
                    ? 'bg-blue-800/80 hover:bg-blue-700 text-white border border-white/50 shadow-xs'
                    : 'bg-[#0055ea] hover:bg-blue-400 text-white border border-white/60 shadow-xs'
                }`}
                title="Minimize"
              >
                <Minus className="w-3 h-3" />
              </button>
            )}

            {/* Maximize / Restore */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleMax();
              }}
              className={`w-5 h-5 rounded flex items-center justify-center text-[10px] transition-all cursor-pointer ${
                isAero
                  ? 'bg-blue-800/80 hover:bg-blue-700 text-white border border-white/50 shadow-xs'
                  : 'bg-[#0055ea] hover:bg-blue-400 text-white border border-white/60 shadow-xs'
              }`}
              title={isFullscreen ? 'Restore Down' : 'Maximize'}
            >
              {isFullscreen ? <Copy className="w-2.5 h-2.5" /> : <Square className="w-2.5 h-2.5" />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseClick();
              }}
              className={`w-5 h-5 rounded flex items-center justify-center text-[10px] transition-all cursor-pointer ${
                isAero
                  ? 'bg-red-600/90 hover:bg-red-500 text-white border border-white/60 shadow-xs'
                  : 'bg-[#e81123] hover:bg-red-600 text-white border border-white/60 shadow-xs'
              }`}
              title="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className={`flex-1 overflow-auto flex flex-col ${bodyClassName}`}>
          {children}
        </div>
      </div>

      {/* Confirmation Dialog for Quizzes in progress */}
      {showConfirmClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
          <div className="w-full max-w-sm bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-lg shadow-2xl p-4 font-sans text-xs space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-amber-400 text-slate-950 shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-950" />
              </div>
              <div className="space-y-1">
                <div className="font-extrabold text-sm text-slate-900">Warning: Quiz in Progress</div>
                <div className="text-slate-700 leading-relaxed">
                  {confirmCloseWarning || 'Your answers will not be saved. Please finish the quiz, or click Yes to exit anyway.'}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-300 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmClose(false)}
                className="px-4 py-1.5 rounded bg-slate-200 hover:bg-slate-300 border border-slate-400 font-bold text-slate-800 transition-colors cursor-pointer"
              >
                No, Continue Quiz
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold transition-colors cursor-pointer shadow"
              >
                Yes, Exit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
