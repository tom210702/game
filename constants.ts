import { UnitType, ActionKey, ActionDef, UnitProperty } from './types';

export const CANVAS_VIEWPORT_WIDTH = 360;
export const CANVAS_VIEWPORT_HEIGHT = 480;
export const STAGE_WIDTH = CANVAS_VIEWPORT_WIDTH;
export const STAGE_HEIGHT = CANVAS_VIEWPORT_HEIGHT;

export const UNIT_SIZE = 30;
export const MOVE_SPEED = 25;
export const INITIAL_HP = 100;
export const SNIPER_STUN_FRAMES = 120;
export const TRAP_DURATION_SECONDS = 10;
export const TRAP_DURATION_FRAMES = TRAP_DURATION_SECONDS * 60;
export const MAX_ACTIONS = 10;

export const PLAYER_TEAM_COLOR = '#48bb78';
export const OPPONENT_TEAM_COLOR = '#e53e3e';
export const TEAM_MARKER_SIZE = 8;

export const ACTION_TYPES: Record<ActionKey, ActionDef> = {
  MOVE_FORWARD: { text: '進む', mark: '⬆️' },
  MOVE_BACKWARD: { text: '後ろに移動', mark: '⬇️' },
  MOVE_RIGHT: { text: '右に移動', mark: '▶️' },
  MOVE_LEFT: { text: '左に移動', mark: '◀️' },
  MOVE_TOP_RIGHT: { text: '右上', mark: '↗️' },
  MOVE_TOP_LEFT: { text: '左上', mark: '↖️' },
  MOVE_BOTTOM_RIGHT: { text: '右下', mark: '↘️' },
  MOVE_BOTTOM_LEFT: { text: '左下', mark: '↙️' },
  SEARCH_ENEMY: { text: '索敵', mark: '🔁' },
  ATTACK: { text: '攻撃', mark: '💥' }
};

export const UNIT_PROPERTIES: Record<UnitType, UnitProperty> = {
  [UnitType.GATLING]: {
    name: 'ガトリング',
    color: '#f6e05e',
    attackRange: 100,
    attackDamage: 8,
    attackType: 'scatter',
    projectileSpeed: 5,
    cooldownFrames: 30
  },
  [UnitType.CANNON]: {
    name: '大砲',
    color: '#fc8181',
    attackRange: 200,
    attackDamage: 40,
    attackType: 'straight',
    projectileSpeed: 10,
    cooldownFrames: 60
  },
  [UnitType.TRAP_CANNON]: {
    name: 'トラップ砲',
    color: '#63b3ed',
    attackRange: 100,
    attackDamage: 20,
    attackType: 'trap',
    projectileSpeed: 7,
    trapDurationFrames: TRAP_DURATION_FRAMES,
    cooldownFrames: 90
  },
  [UnitType.SNIPER]: {
    name: 'スナイパー',
    color: '#805ad5',
    attackRange: 300,
    attackDamage: 30,
    attackType: 'sniper_shot',
    projectileSpeed: 20,
    cooldownFrames: 150
  }
};

export const OPPONENT_UNIT_ACTIONS: Record<UnitType, ActionKey[]> = {
  [UnitType.GATLING]: ['MOVE_FORWARD', 'MOVE_FORWARD', 'SEARCH_ENEMY', 'ATTACK', 'MOVE_TOP_LEFT'],
  [UnitType.CANNON]: ['MOVE_FORWARD', 'SEARCH_ENEMY', 'ATTACK', 'MOVE_LEFT', 'SEARCH_ENEMY', 'ATTACK', 'MOVE_FORWARD'],
  [UnitType.TRAP_CANNON]: ['MOVE_FORWARD', 'SEARCH_ENEMY', 'ATTACK', 'MOVE_LEFT', 'SEARCH_ENEMY', 'ATTACK', 'SEARCH_ENEMY', 'ATTACK'],
  [UnitType.SNIPER]: ['SEARCH_ENEMY', 'ATTACK', 'MOVE_BACKWARD', 'MOVE_RIGHT', 'MOVE_RIGHT', 'MOVE_LEFT', 'MOVE_LEFT', 'MOVE_RIGHT', 'MOVE_LEFT']
};
