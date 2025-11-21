export enum UnitType {
  GATLING = 'GATLING',
  CANNON = 'CANNON',
  TRAP_CANNON = 'TRAP_CANNON',
  SNIPER = 'SNIPER'
}

export type ActionKey = 
  | 'MOVE_FORWARD' | 'MOVE_BACKWARD' | 'MOVE_RIGHT' | 'MOVE_LEFT'
  | 'MOVE_TOP_RIGHT' | 'MOVE_TOP_LEFT' | 'MOVE_BOTTOM_RIGHT' | 'MOVE_BOTTOM_LEFT'
  | 'SEARCH_ENEMY' | 'ATTACK';

export interface ActionDef {
  text: string;
  mark: string;
}

export interface UnitProperty {
  name: string;
  color: string;
  attackRange: number;
  attackDamage: number;
  attackType: 'scatter' | 'straight' | 'trap' | 'sniper_shot';
  projectileSpeed: number;
  cooldownFrames: number;
  trapDurationFrames?: number;
}

export interface UnitConfig {
  type: UnitType;
  actions: ActionKey[];
}

export interface Unit {
  id: string;
  type: UnitType;
  name: string;
  x: number;
  y: number;
  rotation: number;
  hp: number;
  maxHp: number;
  color: string;
  actions: ActionKey[];
  currentActionIndex: number;
  actionCooldown: number;
  attackCooldown: number;
  properties: UnitProperty;
  isPlayer: boolean;
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  radius: number;
  color: string;
  owner: Unit;
  initialX: number;
  initialY: number;
  maxTravelDistance?: number;
  isTrapProjectile?: boolean;
  trapDamage?: number;
  trapRadius?: number;
  trapDuration?: number;
}

export interface Trap {
  x: number;
  y: number;
  damage: number;
  radius: number;
  color: string;
  owner: Unit;
  duration: number;
  damageCooldown: number;
}

export interface TeleportTrap {
  x: number;
  y: number;
  radius: number;
}

export interface GameState {
  playerUnits: Unit[];
  opponentUnits: Unit[];
  projectiles: Projectile[];
  traps: Trap[];
  gameRunning: boolean;
  result: 'WIN' | 'LOSE' | null;
}
