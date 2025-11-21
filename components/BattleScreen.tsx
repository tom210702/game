import React, { useEffect, useRef, useState } from 'react';
import { GameState, UnitConfig, Unit, UnitType, ActionKey } from '../types';
import { Button } from './Button';
import { 
  CANVAS_VIEWPORT_WIDTH, CANVAS_VIEWPORT_HEIGHT, STAGE_WIDTH, STAGE_HEIGHT,
  INITIAL_HP, OPPONENT_UNIT_ACTIONS
} from '../constants';
import { updateGameState, renderGame, createUnit } from '../services/gameEngine';

// Helper to shuffle array
function shuffle<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

interface BattleScreenProps {
  playerConfigs: UnitConfig[];
  onReset: () => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({ playerConfigs, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // State for UI Overlay
  const [uiState, setUiState] = useState<{
    playerHp: number[];
    opponentHp: number[];
    result: 'WIN' | 'LOSE' | null;
  }>({ playerHp: [], opponentHp: [], result: null });

  // Mutable Game State
  const gameState = useRef<GameState>({
    playerUnits: [],
    opponentUnits: [],
    projectiles: [],
    traps: [],
    gameRunning: false,
    result: null
  });

  // Camera State
  const cameraOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Initialize Game
  useEffect(() => {
    // Initialize Units
    const pUnits = playerConfigs.map((cfg, i) => 
      createUnit(
        `p${i}`, cfg.type, 
        STAGE_WIDTH / 4 * (i + 1), STAGE_HEIGHT - 50, 
        -Math.PI / 2, cfg.actions, true
      )
    );

    const opponentTypes = shuffle(Object.values(UnitType)).slice(0, 3);
    const oUnits = opponentTypes.map((type, i) => 
      createUnit(
        `o${i}`, type,
        STAGE_WIDTH / 4 * (i + 1), 50,
        Math.PI / 2, OPPONENT_UNIT_ACTIONS[type], false
      )
    );

    gameState.current = {
      playerUnits: pUnits,
      opponentUnits: oUnits,
      projectiles: [],
      traps: [],
      gameRunning: true,
      result: null
    };

    const loop = () => {
      if (gameState.current.gameRunning) {
        updateGameState(gameState.current);
      }

      // Update UI state occasionally or every frame? 
      // Doing every frame for smooth HP bars.
      setUiState({
        playerHp: gameState.current.playerUnits.map(u => u.hp),
        opponentHp: gameState.current.opponentUnits.map(u => u.hp),
        result: gameState.current.result
      });

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          renderGame(
            ctx, 
            gameState.current, 
            cameraOffset.current,
            CANVAS_VIEWPORT_WIDTH,
            CANVAS_VIEWPORT_HEIGHT
          );
        }
      }

      if (gameState.current.gameRunning || gameState.current.result) {
         // Continue loop even if finished to draw final state, 
         // but stop update logic (handled inside updateGameState)
         requestRef.current = requestAnimationFrame(loop);
      }
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [playerConfigs]);

  // Touch/Mouse Handlers for Camera
  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastPointer.current = { x: clientX, y: clientY };
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const dx = clientX - lastPointer.current.x;
    const dy = clientY - lastPointer.current.y;

    cameraOffset.current.x -= dx;
    cameraOffset.current.y -= dy;

    lastPointer.current = { x: clientX, y: clientY };
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  const HpBar = ({ hp }: { hp: number }) => (
    <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden mt-1">
      <div 
        className={`h-full transition-all duration-300 ${hp > 50 ? 'bg-green-500' : hp > 20 ? 'bg-yellow-400' : 'bg-red-500'}`}
        style={{ width: `${Math.max(0, hp)}%` }}
      />
    </div>
  );

  return (
    <div className="relative w-full max-w-[360px] flex flex-col items-center">
      {/* HUD */}
      <div className="w-full flex justify-between mb-2 px-1">
        <div className="w-[45%] space-y-1">
          {uiState.playerHp.map((hp, i) => (
            <div key={`p-hp-${i}`}>
              <div className="flex justify-between text-xs text-green-300"><span>自機{i+1}</span><span>{Math.ceil(Math.max(0,hp))}</span></div>
              <HpBar hp={(hp/INITIAL_HP)*100} />
            </div>
          ))}
        </div>
        <div className="w-[45%] space-y-1">
          {uiState.opponentHp.map((hp, i) => (
            <div key={`o-hp-${i}`}>
              <div className="flex justify-between text-xs text-red-300"><span>敵機{i+1}</span><span>{Math.ceil(Math.max(0,hp))}</span></div>
              <HpBar hp={(hp/INITIAL_HP)*100} />
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_VIEWPORT_WIDTH}
        height={CANVAS_VIEWPORT_HEIGHT}
        className="bg-slate-800 rounded-xl shadow-2xl cursor-move touch-none ring-4 ring-slate-700"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />

      {/* Result Overlay */}
      {uiState.result && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-xl z-10 backdrop-blur-sm animate-fade-in">
          <div className={`text-4xl font-black mb-6 transform scale-110 ${uiState.result === 'WIN' ? 'text-green-400 drop-shadow-glow-green' : 'text-red-400 drop-shadow-glow-red'}`}>
            {uiState.result === 'WIN' ? '勝利！' : '敗北...'}
          </div>
          <Button variant={uiState.result === 'WIN' ? 'primary' : 'danger'} onClick={onReset} className="animate-bounce">
            再設定へ
          </Button>
        </div>
      )}

      {!uiState.result && (
        <div className="mt-4 w-full flex justify-center">
           <Button variant="warning" onClick={onReset} className="text-sm py-2">中断して戻る</Button>
        </div>
      )}
    </div>
  );
};
