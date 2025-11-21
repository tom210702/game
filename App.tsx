import React, { useState } from 'react';
import { UnitConfig, UnitType } from './types';
import { MenuScreen } from './components/MenuScreen';
import { RuleBookScreen } from './components/RuleBookScreen';
import { SetupScreen } from './components/SetupScreen';
import { BattleScreen } from './components/BattleScreen';

enum Screen { MENU, RULES, SETUP, BATTLE }

const initialConfigs: UnitConfig[] = [
  { type: UnitType.GATLING, actions: [] },
  { type: UnitType.GATLING, actions: [] },
  { type: UnitType.GATLING, actions: [] },
];

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.MENU);
  const [playerConfigs, setPlayerConfigs] = useState<UnitConfig[]>(initialConfigs);

  const handleUpdateConfig = (index: number, newConfig: UnitConfig) => {
    const newConfigs = [...playerConfigs];
    newConfigs[index] = newConfig;
    setPlayerConfigs(newConfigs);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-8 px-4 bg-gray-900 text-slate-100 font-sans">
      <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        シミュレーション対戦
      </h1>

      <div className="w-full max-w-md flex flex-col items-center transition-all duration-300">
        {currentScreen === Screen.MENU && (
          <MenuScreen 
            onStartSetup={() => setCurrentScreen(Screen.SETUP)}
            onShowRules={() => setCurrentScreen(Screen.RULES)}
          />
        )}

        {currentScreen === Screen.RULES && (
          <RuleBookScreen onBack={() => setCurrentScreen(Screen.MENU)} />
        )}

        {currentScreen === Screen.SETUP && (
          <SetupScreen 
            configs={playerConfigs}
            onUpdateConfig={handleUpdateConfig}
            onStartBattle={() => setCurrentScreen(Screen.BATTLE)}
            onBack={() => setCurrentScreen(Screen.MENU)}
          />
        )}

        {currentScreen === Screen.BATTLE && (
          <BattleScreen 
            playerConfigs={playerConfigs}
            onReset={() => setCurrentScreen(Screen.SETUP)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
