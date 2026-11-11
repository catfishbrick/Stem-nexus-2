import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, Palette, Download, Trash2, Edit3, Eraser } from 'lucide-react';
import { sound } from '../../utils/audio';

import { RetroAppWindow } from '../retro/RetroAppWindow';

interface Props {
  isOpen: boolean;
  isMinimized?: boolean;
  onClose: () => void;
  onMinimize?: () => void;
}

const XP_PALETTE = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000', '#ffffff', '#c0c0c0',
  '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80',
  '#80ffff', '#0080ff', '#ff80ff', '#ff8040',
];

export const PaintAppModal: React.FC<Props> = ({ isOpen, isMinimized, onClose, onMinimize }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const savedImageDataRef = useRef<ImageData | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  const [color, setColor] = useState<string>('#000000');
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!isInitializedRef.current) {
      // Fill white background initially
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      savedImageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      isInitializedRef.current = true;
    } else if (savedImageDataRef.current) {
      // Restore user's drawing if it was restored
      ctx.putImageData(savedImageDataRef.current, 0, 0);
    }
  }, [isOpen, isMinimized]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 3 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);
    // Persist drawing snapshot so minimizing/restoring keeps painting
    savedImageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  const handleClear = () => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    savedImageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'stem_nexus_drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <RetroAppWindow
      appId="paint"
      title="Paint - STEM Nexus Drawing Studio"
      icon={<Palette className="w-4 h-4 text-yellow-300" />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      onClose={onClose}
      onMinimize={onMinimize}
      initialWidth={680}
      initialHeight={520}
      theme="xp"
    >
      <div className="flex flex-col flex-1 bg-[#ece9d8] min-h-0">
        {/* Menu Bar */}
        <div className="bg-[#ece9d8] border-b border-[#aca899] px-2 py-0.5 text-slate-800 flex items-center justify-between text-[11px] shrink-0">
          <div className="flex gap-3">
            <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">File</span>
            <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Edit</span>
            <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Image</span>
            <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Colors</span>
            <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Help</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-2 py-0.5 bg-[#f0ede4] hover:bg-white border border-[#7f9db9] rounded-xs flex items-center gap-1 text-[10px] text-red-700 font-bold"
            >
              <Trash2 className="w-3 h-3" />
              <span>Bersihkan</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xs flex items-center gap-1 text-[10px] font-bold shadow-xs"
            >
              <Download className="w-3 h-3" />
              <span>Simpan Gambar</span>
            </button>
          </div>
        </div>

        {/* Work Area */}
        <div className="flex p-2 gap-2 bg-[#d4d0c8]">
          {/* Left Toolbar */}
          <div className="w-16 bg-[#ece9d8] border-2 border-r-[#ffffff] border-b-[#ffffff] border-l-[#808080] border-t-[#808080] p-1 flex flex-col gap-1 items-center shrink-0">
            <button
              type="button"
              onClick={() => { setTool('brush'); sound.playClick(); }}
              className={`w-10 h-8 flex items-center justify-center border ${
                tool === 'brush'
                  ? 'bg-white border-[#7f9db9] shadow-inner'
                  : 'bg-[#ece9d8] border-[#aca899] hover:bg-white'
              }`}
              title="Kuas / Pensil"
            >
              <Edit3 className="w-4 h-4 text-slate-800" />
            </button>
            <button
              type="button"
              onClick={() => { setTool('eraser'); sound.playClick(); }}
              className={`w-10 h-8 flex items-center justify-center border ${
                tool === 'eraser'
                  ? 'bg-white border-[#7f9db9] shadow-inner'
                  : 'bg-[#ece9d8] border-[#aca899] hover:bg-white'
              }`}
              title="Penghapus"
            >
              <Eraser className="w-4 h-4 text-slate-800" />
            </button>

            {/* Brush sizes */}
            <div className="mt-2 w-full border-t border-[#808080] pt-2 flex flex-col items-center gap-1">
              {[2, 4, 8, 12].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setLineWidth(sz)}
                  className={`w-8 h-4 flex items-center justify-center ${
                    lineWidth === sz ? 'bg-blue-200' : 'hover:bg-slate-200'
                  }`}
                >
                  <div
                    className="rounded-full bg-black"
                    style={{ width: `${sz}px`, height: `${sz}px` }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="flex-1 overflow-auto bg-[#808080] p-2 flex items-center justify-center border border-[#404040]">
            <canvas
              ref={canvasRef}
              width={560}
              height={340}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="bg-white shadow-xl cursor-crosshair max-w-full"
            />
          </div>
        </div>

        {/* Bottom Palette */}
        <div className="bg-[#ece9d8] border-t border-[#aca899] p-2 flex items-center gap-3 shrink-0">
          {/* Active color preview */}
          <div className="flex items-center gap-1.5 border border-[#808080] p-1 bg-white">
            <div
              className="w-6 h-6 border border-black shadow-inner"
              style={{ backgroundColor: color }}
            />
            <span className="text-[10px] font-mono text-slate-700">{color}</span>
          </div>

          {/* Color swatches */}
          <div className="grid grid-cols-14 gap-1 flex-1">
            {XP_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { setColor(c); setTool('brush'); sound.playClick(); }}
                className={`w-4 h-4 border transition-transform ${
                  color === c ? 'border-2 border-black scale-110 shadow' : 'border-slate-400'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </RetroAppWindow>
  );
};
