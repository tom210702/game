import React from 'react';
import { Button } from './Button';
import { audioService } from '../services/audioService';

interface MenuScreenProps {
  onStartSetup: () => void;
  onShowRules: () => void;
}

const EnemyIcon: React.FC = () => (
  <svg
    viewBox="0 0 120 120"
    className="h-16 w-16 drop-shadow-[0_0_16px_rgba(248,113,113,0.35)]"
  >
    <defs>
      <linearGradient id="enemyGradient" x1="0%" y1="0%" x2="100%" y2="120%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="50%" stopColor="#fb7185" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>

    <path
      d="M60 10 L80 35 L110 45 L88 60 L95 80 L72 70 L60 105 L48 70 L25 80 L32 60 L10 45 L40 35 Z"
      fill="url(#enemyGradient)"
      stroke="#fecaca"
      strokeWidth="4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <circle cx="60" cy="55" r="10" fill="#0f172a" stroke="#fda4af" strokeWidth="4" />
    <line x1="35" y1="50" x2="15" y2="40" stroke="#fda4af" strokeWidth="4" strokeLinecap="round" />
    <line x1="85" y1="50" x2="105" y2="40" stroke="#fda4af" strokeWidth="4" strokeLinecap="round" />
    <line x1="52" y1="82" x2="35" y2="95" stroke="#fb7185" strokeWidth="5" strokeLinecap="round" />
    <line x1="68" y1="82" x2="85" y2="95" stroke="#fb7185" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

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
          <div className="flex items-center gap-4 rounded-2xl border border-rose-200/40 bg-gradient-to-br from-slate-900/70 via-slate-900 to-slate-900/20 px-4 py-3 shadow-[0_10px_40px_rgba(244,114,182,0.25)]">
            <EnemyIcon />
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.3em] text-rose-200/80">Enemy Fleet</p>
              <p className="text-sm font-semibold text-white">Phantom Unit beta</p>
              <div className="text-[0.65rem] text-rose-200/70">Enemy silhouette feed</div>
            </div>
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
