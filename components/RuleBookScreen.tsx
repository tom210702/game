import React from 'react';
import { Button } from './Button';

interface RuleBookScreenProps {
  onBack: () => void;
}

export const RuleBookScreen: React.FC<RuleBookScreenProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-md bg-slate-800 p-6 rounded-xl shadow-lg animate-fade-in">
      <h3 className="text-xl font-bold mb-4 text-blue-200 border-b border-slate-600 pb-2">ゲームのルール</h3>
      <ul className="list-disc pl-5 space-y-3 text-slate-300 text-sm leading-relaxed">
        <li><strong className="text-white">目的:</strong> 相手の自機を全て破壊すると勝利、自分の自機が全て破壊されると敗北です。</li>
        <li><strong className="text-white">流れ:</strong> バトル前に3機の自機を選択し、行動を設定します。バトルは自動進行です。</li>
        <li><strong className="text-white">行動:</strong> 「進む」「索敵」「攻撃」などを組み合わせます。</li>
        <li><strong className="text-white">特徴:</strong> 各自機は異なる攻撃方法や弾速を持っています。</li>
        <li><strong className="text-white">操作:</strong> スワイプでカメラを移動できます。</li>
      </ul>
      <Button className="w-full mt-6" onClick={onBack}>メニューに戻る</Button>
    </div>
  );
};
