import React, { useState, useEffect, useRef } from 'react';
import { RetroAppWindow } from '../retro/RetroAppWindow';
import { Activity, Cpu, HardDrive, Play, X, RefreshCw, Layers } from 'lucide-react';
import { sound } from '../../utils/audio';

export interface OpenAppItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  cpu: number;
  mem: number; // in MB
}

interface Props {
  isOpen: boolean;
  isMinimized?: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  openApps: OpenAppItem[];
  onCloseApp: (appId: string) => void;
  onFocusApp?: (appId: string) => void;
  lang?: 'en' | 'id';
}

export const TaskManagerAppModal: React.FC<Props> = ({
  isOpen,
  isMinimized = false,
  onClose,
  onMinimize,
  openApps,
  onCloseApp,
  onFocusApp,
  lang = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'processes' | 'performance' | 'details'>('applications');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedProcessName, setSelectedProcessName] = useState<string | null>(null);

  // Performance simulation
  const [cpuUsage, setCpuUsage] = useState<number>(18);
  const [memUsageMb, setMemUsageMb] = useState<number>(412);
  const historyRef = useRef<number[]>(new Array(40).fill(15));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // System processes list
  const systemProcesses = [
    { name: 'System.exe', pid: 4, cpu: 1, mem: 12.4, user: 'SYSTEM' },
    { name: 'smss.exe', pid: 284, cpu: 0, mem: 4.2, user: 'SYSTEM' },
    { name: 'csrss.exe', pid: 340, cpu: 1, mem: 18.6, user: 'SYSTEM' },
    { name: 'winlogon.exe', pid: 364, cpu: 0, mem: 8.9, user: 'SYSTEM' },
    { name: 'services.exe', pid: 412, cpu: 0, mem: 14.1, user: 'SYSTEM' },
    { name: 'lsass.exe', pid: 424, cpu: 1, mem: 9.8, user: 'SYSTEM' },
    { name: 'svchost.exe', pid: 688, cpu: 2, mem: 28.5, user: 'SYSTEM' },
    { name: 'explorer.exe', pid: 1450, cpu: 3, mem: 64.2, user: 'Cadet_01' },
    { name: 'stem_engine.exe', pid: 1820, cpu: 4, mem: 48.0, user: 'Cadet_01' },
    { name: 'taskmgr.exe', pid: 2190, cpu: 2, mem: 16.4, user: 'Cadet_01' },
  ];

  // Combined processes list
  const allProcesses = [
    ...openApps.map((a, idx) => ({
      name: `${a.id}.exe`,
      pid: 3000 + idx * 112,
      cpu: a.cpu,
      mem: a.mem,
      user: 'Cadet_01',
      appId: a.id,
    })),
    ...systemProcesses,
  ];

  // Animate CPU and Memory
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    const interval = setInterval(() => {
      // Fluctuate CPU slightly based on open apps count
      const baseCpu = 12 + openApps.length * 4;
      const jitter = Math.floor(Math.random() * 9) - 4;
      const nextCpu = Math.max(5, Math.min(95, baseCpu + jitter));
      setCpuUsage(nextCpu);

      const baseMem = 380 + openApps.length * 42;
      setMemUsageMb(baseMem + Math.floor(Math.random() * 8));

      historyRef.current.push(nextCpu);
      if (historyRef.current.length > 40) {
        historyRef.current.shift();
      }

      // Draw canvas performance graph
      const canvas = canvasRef.current;
      if (canvas && activeTab === 'performance') {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.fillStyle = '#0a190a';
          ctx.fillRect(0, 0, w, h);

          // Grid lines
          ctx.strokeStyle = '#0f380f';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 15) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += 15) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          // Performance line
          ctx.strokeStyle = '#00ff41';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          const step = w / (historyRef.current.length - 1);
          historyRef.current.forEach((val, i) => {
            const x = i * step;
            const y = h - (val / 100) * (h - 8) - 4;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();

          // Glow fill under graph
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.fillStyle = 'rgba(0, 255, 65, 0.08)';
          ctx.fill();
        }
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isOpen, isMinimized, openApps.length, activeTab]);

  const handleEndTask = () => {
    if (!selectedAppId) return;
    sound.playClick();
    onCloseApp(selectedAppId);
    setSelectedAppId(null);
  };

  const handleEndProcess = () => {
    if (!selectedProcessName) return;
    sound.playClick();
    const matched = openApps.find((a) => `${a.id}.exe` === selectedProcessName);
    if (matched) {
      onCloseApp(matched.id);
    }
    setSelectedProcessName(null);
  };

  return (
    <RetroAppWindow
      appId="taskmanager"
      title={lang === 'id' ? 'Pengelola Tugas Windows (Task Manager)' : 'Windows Task Manager'}
      icon={<Activity className="w-4 h-4 text-emerald-400" />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      onClose={onClose}
      onMinimize={onMinimize}
      initialWidth={520}
      initialHeight={460}
      theme="xp"
      className="text-xs"
    >
      {/* Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#aca899] px-2 py-0.5 text-slate-800 flex gap-3 text-[11px] shrink-0 font-sans">
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">File</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Options</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">View</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Shut Down</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Help</span>
      </div>

      {/* Tabs */}
      <div className="bg-[#ece9d8] px-2 pt-1 border-b border-[#aca899] flex gap-1 font-sans text-xs shrink-0">
        {(
          [
            { id: 'applications', label: lang === 'id' ? 'Aplikasi' : 'Applications' },
            { id: 'processes', label: lang === 'id' ? 'Proses' : 'Processes' },
            { id: 'performance', label: lang === 'id' ? 'Performa' : 'Performance' },
            { id: 'details', label: lang === 'id' ? 'Rincian' : 'Details' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab(t.id);
            }}
            className={`px-3 py-1 rounded-t border-t border-x cursor-pointer transition-colors ${
              activeTab === t.id
                ? 'bg-white border-[#aca899] font-bold text-slate-900 border-b-2 border-b-white -mb-[1px]'
                : 'bg-[#e0ded0] border-transparent text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 bg-white p-3 flex flex-col overflow-hidden font-sans">
        {/* 1. APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 border border-[#aca899] rounded bg-white overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f0ede0] border-b border-[#aca899] text-slate-700 font-bold sticky top-0">
                    <th className="py-1 px-3">Task</th>
                    <th className="py-1 px-3 w-28">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {openApps.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-slate-400 italic">
                        {lang === 'id'
                          ? 'Tidak ada program yang sedang berjalan.'
                          : 'No active applications running.'}
                      </td>
                    </tr>
                  ) : (
                    openApps.map((app) => {
                      const isSelected = selectedAppId === app.id;
                      return (
                        <tr
                          key={app.id}
                          onClick={() => {
                            sound.playClick();
                            setSelectedAppId(app.id);
                          }}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#316ac5] text-white font-bold' : 'hover:bg-blue-50 text-slate-800'
                          }`}
                        >
                          <td className="py-1.5 px-3 flex items-center gap-2">
                            <span className="w-4 h-4 flex items-center justify-center shrink-0">
                              {app.icon}
                            </span>
                            <span className="truncate">{app.name}</span>
                          </td>
                          <td className="py-1.5 px-3">
                            <span className={`text-[11px] ${isSelected ? 'text-emerald-200' : 'text-emerald-600'}`}>
                              Running
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Buttons */}
            <div className="pt-3 flex items-center justify-between shrink-0">
              <div className="text-[11px] text-slate-600 font-mono">
                {lang === 'id' ? 'Jumlah Tugas Aktif:' : 'Active Tasks:'} {openApps.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!selectedAppId}
                  onClick={() => {
                    if (selectedAppId && onFocusApp) {
                      sound.playClick();
                      onFocusApp(selectedAppId);
                    }
                  }}
                  className="px-3 py-1 rounded bg-[#ece9d8] hover:bg-slate-200 border border-[#aca899] font-bold text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Switch To
                </button>
                <button
                  type="button"
                  disabled={!selectedAppId}
                  onClick={handleEndTask}
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                >
                  End Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. PROCESSES TAB */}
        {activeTab === 'processes' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 border border-[#aca899] rounded bg-white overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-[#f0ede0] border-b border-[#aca899] text-slate-700 font-bold sticky top-0 text-[11px]">
                    <th className="py-1 px-2">Image Name</th>
                    <th className="py-1 px-2 text-right">PID</th>
                    <th className="py-1 px-2 text-right">CPU</th>
                    <th className="py-1 px-2 text-right">Mem (MB)</th>
                    <th className="py-1 px-2">User Name</th>
                  </tr>
                </thead>
                <tbody>
                  {allProcesses.map((proc, idx) => {
                    const isSelected = selectedProcessName === proc.name;
                    return (
                      <tr
                        key={idx}
                        onClick={() => {
                          sound.playClick();
                          setSelectedProcessName(proc.name);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#316ac5] text-white font-bold' : 'hover:bg-blue-50 text-slate-800'
                        }`}
                      >
                        <td className="py-1 px-2 font-sans font-bold">{proc.name}</td>
                        <td className="py-1 px-2 text-right">{proc.pid}</td>
                        <td className="py-1 px-2 text-right">{proc.cpu}%</td>
                        <td className="py-1 px-2 text-right">{proc.mem.toFixed(1)} MB</td>
                        <td className="py-1 px-2 font-sans text-slate-500">{proc.user}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-3 flex items-center justify-between shrink-0 font-sans">
              <div className="text-[11px] text-slate-600 font-mono">
                Processes: {allProcesses.length} | CPU Usage: {cpuUsage}%
              </div>
              <button
                type="button"
                disabled={!selectedProcessName}
                onClick={handleEndProcess}
                className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                End Process
              </button>
            </div>
          </div>
        )}

        {/* 3. PERFORMANCE TAB */}
        {activeTab === 'performance' && (
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
            {/* CPU Usage Graph */}
            <div className="border border-[#aca899] rounded p-2.5 bg-[#f5f4ed] space-y-1.5">
              <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  CPU Usage History ({cpuUsage}%)
                </span>
                <span className="font-mono text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-400">
                  {cpuUsage}%
                </span>
              </div>
              <canvas
                ref={canvasRef}
                width={450}
                height={100}
                className="w-full h-24 rounded border border-emerald-950 block shadow-inner"
              />
            </div>

            {/* Memory / PF Usage */}
            <div className="border border-[#aca899] rounded p-2.5 bg-[#f5f4ed] space-y-1.5">
              <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                <span className="flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-blue-600" />
                  Memory Usage ({memUsageMb} MB / 2048 MB)
                </span>
                <span className="font-mono text-blue-700 font-bold bg-white px-2 py-0.5 rounded border border-blue-400">
                  {Math.round((memUsageMb / 2048) * 100)}%
                </span>
              </div>
              <div className="w-full h-4 rounded bg-slate-900 overflow-hidden border border-slate-700 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 rounded transition-all duration-500"
                  style={{ width: `${Math.min(100, (memUsageMb / 2048) * 100)}%` }}
                />
              </div>
            </div>

            {/* System Info Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 border border-[#aca899] rounded bg-white space-y-1">
                <div className="font-bold text-slate-800 font-sans border-b border-slate-200 pb-0.5">
                  Totals
                </div>
                <div className="flex justify-between">
                  <span>Handles:</span> <span className="font-bold">6420</span>
                </div>
                <div className="flex justify-between">
                  <span>Threads:</span> <span className="font-bold">348</span>
                </div>
                <div className="flex justify-between">
                  <span>Processes:</span> <span className="font-bold">{allProcesses.length}</span>
                </div>
              </div>

              <div className="p-2 border border-[#aca899] rounded bg-white space-y-1">
                <div className="font-bold text-slate-800 font-sans border-b border-slate-200 pb-0.5">
                  Physical Memory (K)
                </div>
                <div className="flex justify-between">
                  <span>Total:</span> <span className="font-bold">2,097,152</span>
                </div>
                <div className="flex justify-between">
                  <span>Available:</span> <span className="font-bold">1,684,752</span>
                </div>
                <div className="flex justify-between">
                  <span>System Cache:</span> <span className="font-bold">428,190</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. DETAILS TAB */}
        {activeTab === 'details' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 border border-[#aca899] rounded bg-white overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-[#f0ede0] border-b border-[#aca899] text-slate-700 font-bold sticky top-0 text-[11px]">
                    <th className="py-1 px-2">PID</th>
                    <th className="py-1 px-2">Executable</th>
                    <th className="py-1 px-2 text-right">Priority</th>
                    <th className="py-1 px-2 text-right">Threads</th>
                    <th className="py-1 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allProcesses.map((p, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 text-slate-800 border-b border-slate-100">
                      <td className="py-1 px-2">{p.pid}</td>
                      <td className="py-1 px-2 font-sans font-bold text-blue-900">{p.name}</td>
                      <td className="py-1 px-2 text-right">Normal</td>
                      <td className="py-1 px-2 text-right">{idx % 3 === 0 ? 8 : 4}</td>
                      <td className="py-1 px-2 text-emerald-600 font-sans">Active</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pt-2 text-[11px] text-slate-500 font-sans text-right">
              Task Manager System Monitor v2.4
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#aca899] px-3 py-1 flex items-center justify-between text-[11px] text-slate-700 font-mono shrink-0">
        <div>Processes: {allProcesses.length}</div>
        <div>CPU Usage: {cpuUsage}%</div>
        <div>Commit Charge: {memUsageMb}M / 2048M</div>
      </div>
    </RetroAppWindow>
  );
};
