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
    <div className="flex flex-col items-center justify-center w-full animate-fade-in">
      <h2 className="text-2xl font-bold mb-8 text-blue-200">ようこそ！</h2>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button onClick={handleStart}>バトル開始</Button>
        <Button variant="secondary" onClick={handleRules}>ルールを見る</Button>
      </div>
    </div>
  );
};
