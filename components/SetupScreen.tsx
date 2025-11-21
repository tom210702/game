import React, { useState } from 'react';
import { Button } from './Button';
import { UnitConfig, UnitType, ActionKey } from '../types';
import { ACTION_TYPES, UNIT_PROPERTIES, MAX_ACTIONS } from '../constants';

interface SetupScreenProps {
  configs: UnitConfig[];
  onUpdateConfig: (index: number, config: UnitConfig) => void;
  onStartBattle: () => void;
  onBack: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ 
  configs, onUpdateConfig, onStartBattle, onBack 
}) => {
  const [editingIndex, setEditingIndex] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const currentConfig = configs[editingIndex];

  const handleTypeChange = (index: number, type: UnitType) => {
    onUpdateConfig(index, { ...configs[index], type });
  };

  const addAction = (actionKey: ActionKey) => {
    if (currentConfig.actions.length >= MAX_ACTIONS) {
      setMessage(`行動は最大${MAX_ACTIONS}個までです。`);
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    const newActions = [...currentConfig.actions, actionKey];
    onUpdateConfig(editingIndex, { ...currentConfig, actions: newActions });
  };

  const removeAction = (actionIndex: number) => {
    const newActions = currentConfig.actions.filter((_, i) => i !== actionIndex);
    onUpdateConfig(editingIndex, { ...currentConfig, actions: newActions });
  };

  const handleStart = () => {
    const hasActions = configs.some(c => c.actions.length > 0);
    if (!hasActions) {
      setMessage('行動を設定してください！');
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    onStartBattle();
  };

  return (
    <div className="w-full max-w-md animate-fade-in pb-8">
      <h2 className="text-xl font-bold mb-4 text-blue-200">自機選択</h2>
      <div className="bg-slate-800 p-4 rounded-xl mb-6 space-y-3 shadow-lg">
        {configs.map((config, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className={`font-semibold ${editingIndex === idx ? 'text-blue-300' : 'text-slate-400'}`}>
              自機{idx + 1}:
            </span>
            <select 
              value={config.type}
              onChange={(e) => handleTypeChange(idx, e.target.value as UnitType)}
              className="bg-slate-700 text-white p-2 rounded w-48 border border-slate-600 focus:border-blue-500 outline-none"
            >
              {Object.values(UnitType).map(t => (
                <option key={t} value={t}>{UNIT_PROPERTIES[t].name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4 text-blue-200">行動設定</h2>
      <div className="flex gap-2 mb-4 justify-center">
        {configs.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setEditingIndex(idx)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              editingIndex === idx 
                ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            自機{idx + 1}
          </button>
        ))}
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-3 gap-2 mb-6 p-2 bg-slate-800 rounded-xl shadow-inner">
        <Button variant="secondary" onClick={() => addAction('MOVE_TOP_LEFT')} className="text-xs py-2 px-1">↖️ 左上</Button>
        <Button variant="secondary" onClick={() => addAction('MOVE_FORWARD')} className="text-xs py-2 px-1">⬆️ 進む</Button>
        <Button variant="secondary" onClick={() => addAction('MOVE_TOP_RIGHT')} className="text-xs py-2 px-1">↗️ 右上</Button>
        
        <Button variant="secondary" onClick={() => addAction('MOVE_LEFT')} className="text-xs py-2 px-1">◀️ 左</Button>
        <Button variant="secondary" onClick={() => addAction('SEARCH_ENEMY')} className="text-xs py-2 px-1">🔁 索敵</Button>
        <Button variant="secondary" onClick={() => addAction('MOVE_RIGHT')} className="text-xs py-2 px-1">▶️ 右</Button>
        
        <Button variant="secondary" onClick={() => addAction('MOVE_BOTTOM_LEFT')} className="text-xs py-2 px-1">↙️ 左下</Button>
        <Button variant="secondary" onClick={() => addAction('MOVE_BACKWARD')} className="text-xs py-2 px-1">⬇️ 後ろ</Button>
        <Button variant="secondary" onClick={() => addAction('MOVE_BOTTOM_RIGHT')} className="text-xs py-2 px-1">↘️ 右下</Button>
        
        <Button variant="secondary" onClick={() => addAction('ATTACK')} className="col-span-3 text-sm py-3 mt-1 bg-red-500 hover:bg-red-600 shadow-red-500/20">
          💥 攻撃
        </Button>
      </div>

      {/* Action List */}
      <div className="mb-6 bg-slate-800 rounded-xl p-4 max-h-48 overflow-y-auto shadow-lg border border-slate-700">
        <h4 className="text-sm text-slate-400 mb-2 font-semibold sticky top-0 bg-slate-800">
          設定済みアクション ({currentConfig.actions.length}/{MAX_ACTIONS})
        </h4>
        {currentConfig.actions.length === 0 ? (
          <div className="text-slate-500 text-center py-4">アクションが設定されていません</div>
        ) : (
          currentConfig.actions.map((key, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-700 mb-2 p-2 rounded border border-slate-600">
              <span className="text-sm">
                <span className="text-slate-400 font-mono mr-2">{i + 1}.</span>
                {ACTION_TYPES[key].mark} {ACTION_TYPES[key].text}
              </span>
              <button 
                onClick={() => removeAction(i)}
                className="bg-red-500/80 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition-colors"
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>

      {message && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-xl animate-bounce">
          {message}
        </div>
      )}

      <div className="flex justify-center gap-4 sticky bottom-0 pt-4 bg-gradient-to-t from-[#1a202c] via-[#1a202c] to-transparent pb-4">
        <Button onClick={handleStart} className="w-40 shadow-lg shadow-blue-500/20">開始</Button>
        <Button variant="secondary" onClick={onBack} className="bg-slate-600 hover:bg-slate-700 shadow-none">戻る</Button>
      </div>
    </div>
  );
};
