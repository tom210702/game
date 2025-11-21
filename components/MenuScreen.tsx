import React from 'react';
import { Button } from './Button';
import { audioService } from '../services/audioService';

interface MenuScreenProps {
  onStartSetup: () => void;
  onShowRules: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ onStartSetup, onShowRules }) => {
  const handleStart = () => {
    audioService.initialize();
    onStartSetup();
  };

  const handleRules = () => {
    audioService.initialize();
    onShowRules();
  };

  return (
    <div className="relative w-full max-w-lg flex flex-col items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.25),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.22),transparent_30%)] blur-md" />

      <div className="relative w-full overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl px-6 py-8">
        <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-slate-300/80">
          <span className="h-px w-10 bg-slate-500/60" />
          <span>Simulation Battle</span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-4xl font-black leading-tight bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_4px_18px_rgba(79,70,229,0.35)]">
              CODE THE WAR
            </div>
            <p className="mt-3 text-sm text-slate-300">
              3機の行動をプログラムして、AI たちの戦いを観戦しよう。
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-700/70 bg-black/40 shadow-inner shadow-indigo-500/20">
            <span className="text-lg font-semibold text-cyan-300">S/B</span>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Button className="w-full" onClick={handleStart}>バトル開始</Button>
          <Button className="w-full" variant="secondary" onClick={handleRules}>ルールを見る</Button>
        </div>
      </div>
    </div>
  );
};
