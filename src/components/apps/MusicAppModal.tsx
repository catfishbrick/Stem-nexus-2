import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Square as StopIcon,
  Volume2,
  VolumeX,
  Music,
  SkipBack,
  SkipForward,
  ListMusic,
  Disc3,
  Plus,
  FolderOpen,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { RetroAppWindow } from '../retro/RetroAppWindow';

interface Props {
  isOpen: boolean;
  isMinimized?: boolean;
  onClose: () => void;
  onMinimize?: () => void;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  bitrate: string;
}

const DEFAULT_PLAYLIST: Track[] = [
  {
    id: 'live-and-learn',
    title: 'Live & Learn',
    artist: 'Crush 40',
    src: '/assets/aistudio/Live___Learn_f7b8feda.mp3',
    bitrate: '320 Kbps / 44.1 kHz',
  },
  {
    id: 'stand-by-me',
    title: 'Stand By Me',
    artist: 'Ben E. King',
    src: '/assets/aistudio/Stand_By_Me_26e96c12.mp3',
    bitrate: '256 Kbps / 44.1 kHz',
  },
  {
    id: 'vrijeman',
    title: 'Vrijeman',
    artist: 'STEM Nexus Audio & Cadet Band',
    src: '/assets/aistudio/Vrijeman_e998d029.mp3',
    bitrate: '256 Kbps / 44.1 kHz',
  },
  {
    id: 'bye-bye-bye',
    title: 'Bye Bye Bye',
    artist: '*NSYNC',
    src: '/assets/aistudio/Bye_Bye_Byes_80441e02.mp3',
    bitrate: '320 Kbps / 44.1 kHz',
  },
  {
    id: 'jamrud',
    title: 'Selamat Ulang Tahun',
    artist: 'Jamrud',
    src: '/assets/aistudio/Jamrud_2f45f4e0.mp3',
    bitrate: '256 Kbps / 44.1 kHz',
  },
  {
    id: 'night-changes',
    title: 'Night Changes',
    artist: 'One Direction',
    src: '/assets/aistudio/Night_Changes_105aeb84.mp3',
    bitrate: '320 Kbps / 44.1 kHz',
  },
  {
    id: 'problematic',
    title: 'Problematic',
    artist: 'BoyWithUke',
    src: '/assets/aistudio/Problematic_6febc8de.mp3',
    bitrate: '320 Kbps / 44.1 kHz',
  },
  {
    id: 'the-stone-roses',
    title: 'Sally Cinnamon',
    artist: 'The Stone Roses',
    src: '/assets/aistudio/The_Stone_Roses_21b888ba.mp3',
    bitrate: '320 Kbps / 44.1 kHz',
  },
];

export const MusicAppModal: React.FC<Props> = ({
  isOpen,
  isMinimized = false,
  onClose,
  onMinimize,
}) => {
  const [playlist, setPlaylist] = useState<Track[]>(DEFAULT_PLAYLIST);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  // Initialize and load track
  const loadTrack = (trackIndex: number, shouldPlay: boolean = false) => {
    const track = playlist[trackIndex];
    if (!track) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(track.src);
    audio.volume = isMuted ? 0 : volume;

    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 180);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      handleNextTrack();
    };

    audioRef.current = audio;
    setCurrentTrackIndex(trackIndex);
    setCurrentTime(0);

    if (shouldPlay) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(true);
      });
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadTrack(currentTrackIndex, false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isOpen]);

  // Audio Visualizer effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bars = Array(24).fill(10);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
      grad.addColorStop(0, '#00d2ff');
      grad.addColorStop(0.5, '#00f2fe');
      grad.addColorStop(1, '#ff007f');

      const barWidth = canvas.width / bars.length;

      bars = bars.map((height) => {
        if (isPlaying) {
          const target = Math.random() * (canvas.height - 6) + 6;
          return height + (target - height) * 0.3;
        } else {
          return height + (4 - height) * 0.1;
        }
      });

      bars.forEach((h, i) => {
        ctx.fillStyle = grad;
        ctx.fillRect(i * barWidth + 1.5, canvas.height - h, barWidth - 3, h);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(i * barWidth + 1.5, canvas.height - h - 2, barWidth - 3, 1.5);
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, isMinimized]);

  // Volume update
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    sound.playClick();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(true);
      });
    }
  };

  const handleStop = () => {
    sound.playClick();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const handleNextTrack = () => {
    sound.playClick();
    const nextIdx = (currentTrackIndex + 1) % playlist.length;
    loadTrack(nextIdx, isPlaying);
  };

  const handlePrevTrack = () => {
    sound.playClick();
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(prevIdx, isPlaying);
  };

  const handleSelectTrack = (idx: number) => {
    sound.playClick();
    loadTrack(idx, true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');

    const newTrack: Track = {
      id: `custom_${Date.now()}`,
      title: cleanTitle,
      artist: 'Custom Uploaded Audio',
      src: fileUrl,
      bitrate: 'Custom Local MP3',
    };

    setPlaylist((prev) => [newTrack, ...prev]);
    sound.playSuccess();
    // Load and play immediately
    setTimeout(() => {
      loadTrack(0, true);
    }, 100);

    // Reset input
    e.target.value = '';
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <RetroAppWindow
      appId="music"
      title="Windows Media Player 9 - STEM Nexus Audio"
      icon={<Music className="w-4 h-4 text-cyan-300" />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      onClose={onClose}
      onMinimize={onMinimize}
      initialWidth={500}
      initialHeight={560}
      theme="xp"
      className="text-xs"
    >
      {/* Hidden File Picker Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.m4a"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Media Player Skin Body */}
      <div className="flex-1 bg-gradient-to-b from-[#1b3d75] via-[#10274f] to-[#0d1d3d] p-3.5 space-y-3.5 text-white overflow-y-auto">
        {/* Visualizer Display Box */}
        <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/50 bg-slate-950 shadow-inner flex flex-col items-center justify-center p-3">
          <canvas
            ref={canvasRef}
            width={400}
            height={90}
            className="w-full h-24 block"
          />

          {/* Vinyl / CD Overlay Spinner when Playing */}
          <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/60 px-2 py-1 rounded-md border border-cyan-400/30">
            <Disc3 className={`w-4 h-4 text-cyan-400 ${isPlaying ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-mono text-cyan-200">
              {isPlaying ? 'PLAYING' : 'STOPPED'}
            </span>
          </div>

          <div className="absolute top-2 right-2 text-[10px] font-mono text-amber-300 bg-black/60 px-2 py-1 rounded-md border border-amber-400/30">
            {currentTrack.bitrate}
          </div>
        </div>

        {/* Track Title & Artist */}
        <div className="text-center space-y-0.5">
          <div className="text-base sm:text-lg font-black tracking-wide text-white drop-shadow truncate">
            {currentTrack.title}
          </div>
          <div className="text-xs text-cyan-300 font-bold truncate">
            {currentTrack.artist}
          </div>
        </div>

        {/* Timeline Slider & Time Stamps */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-cyan-200 px-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Add Music Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-xs border border-emerald-400 shadow cursor-pointer transition-all active:scale-95"
            title="Select audio file (.mp3) from your browser"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add MP3</span>
          </button>

          {/* Transport Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handlePrevTrack}
              title="Previous Track"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 cursor-pointer active:scale-95 transition-all"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleStop}
              title="Stop"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 cursor-pointer active:scale-95 transition-all"
            >
              <StopIcon className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:scale-105 active:scale-95 border-2 border-white shadow-[0_0_15px_rgba(56,189,248,0.6)] flex items-center justify-center text-white cursor-pointer transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={handleNextTrack}
              title="Next Track"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 cursor-pointer active:scale-95 transition-all"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-300 hover:text-white cursor-pointer"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-14 sm:w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* Playlist Drawer */}
        <div className="pt-2 border-t border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
            <div className="flex items-center gap-1.5 text-cyan-300">
              <ListMusic className="w-3.5 h-3.5" />
              <span>Playlist ({playlist.length} Tracks)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
            >
              {showPlaylist ? 'Hide' : 'Show'}
            </button>
          </div>

          {showPlaylist && (
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {playlist.map((t, idx) => {
                const isActive = idx === currentTrackIndex;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTrack(idx)}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold border border-cyan-400 shadow-xs'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] text-cyan-300 w-4">
                        {isActive && isPlaying ? '▶' : `${idx + 1}.`}
                      </span>
                      <div className="truncate">
                        <div className="truncate leading-tight">{t.title}</div>
                        <div className="text-[10px] text-slate-400 truncate">{t.artist}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono shrink-0 ml-2">MP3</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </RetroAppWindow>
  );
};
