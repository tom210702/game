import { 
  Unit, Projectile, Trap, GameState, ActionKey, UnitType, UnitConfig 
} from '../types';
import { 
  UNIT_PROPERTIES, STAGE_WIDTH, STAGE_HEIGHT, UNIT_SIZE, MOVE_SPEED, 
  SNIPER_STUN_FRAMES, PLAYER_TEAM_COLOR, OPPONENT_TEAM_COLOR, TEAM_MARKER_SIZE, 
  INITIAL_HP 
} from '../constants';
import { audioService } from './audioService';

// Helper to create units
export const createUnit = (
  id: string,
  type: UnitType,
  x: number,
  y: number,
  rotation: number,
  actions: ActionKey[],
  isPlayer: boolean
): Unit => {
  const properties = UNIT_PROPERTIES[type];
  return {
    id,
    type,
    name: properties.name,
    x,
    y,
    rotation,
    hp: INITIAL_HP,
    maxHp: INITIAL_HP,
    color: properties.color,
    actions: [...actions],
    currentActionIndex: 0,
    actionCooldown: 0,
    attackCooldown: 0,
    properties,
    isPlayer
  };
};

// Attack logic
const performAttack = (unit: Unit, projectiles: Projectile[]) => {
  const { properties } = unit;

  if (properties.attackType === 'straight') {
    projectiles.push({
      x: unit.x,
      y: unit.y,
      vx: properties.projectileSpeed * Math.cos(unit.rotation),
      vy: properties.projectileSpeed * Math.sin(unit.rotation),
      damage: properties.attackDamage,
      radius: 5,
      color: unit.color,
      owner: unit,
      initialX: unit.x,
      initialY: unit.y,
      maxTravelDistance: properties.attackRange
    });
    audioService.play('attack');

  } else if (properties.attackType === 'scatter') {
    const numProjectiles = 5;
    const spreadAngle = Math.PI / 4;
    for (let i = 0; i < numProjectiles; i++) {
      const angleOffset = (i - (numProjectiles - 1) / 2) * (spreadAngle / (numProjectiles - 1));
      const angle = unit.rotation + angleOffset;
      projectiles.push({
        x: unit.x,
        y: unit.y,
        vx: properties.projectileSpeed * Math.cos(angle),
        vy: properties.projectileSpeed * Math.sin(angle),
        damage: properties.attackDamage,
        radius: 3,
        color: unit.color,
        owner: unit,
        initialX: unit.x,
        initialY: unit.y,
        maxTravelDistance: properties.attackRange
      });
    }
    audioService.play('attack');

  } else if (properties.attackType === 'trap') {
    projectiles.push({
      x: unit.x,
      y: unit.y,
      vx: properties.projectileSpeed * Math.cos(unit.rotation),
      vy: properties.projectileSpeed * Math.sin(unit.rotation),
      damage: 0,
      radius: 5,
      color: unit.color,
      owner: unit,
      initialX: unit.x,
      initialY: unit.y,
      maxTravelDistance: properties.attackRange,
      isTrapProjectile: true,
      trapDamage: properties.attackDamage,
      trapRadius: 10,
      trapDuration: properties.trapDurationFrames
    });
    // Trap sound is played when placed

  } else if (properties.attackType === 'sniper_shot') {
    projectiles.push({
      x: unit.x,
      y: unit.y,
      vx: properties.projectileSpeed * Math.cos(unit.rotation),
      vy: properties.projectileSpeed * Math.sin(unit.rotation),
      damage: properties.attackDamage,
      radius: 4,
      color: unit.color,
      owner: unit,
      initialX: unit.x,
      initialY: unit.y,
      maxTravelDistance: properties.attackRange
    });
    audioService.play('sniper_shot');
  }
};

// Main Update Loop
export const updateGameState = (state: GameState): void => {
  const { playerUnits, opponentUnits, projectiles, traps } = state;

  // Unit Logic
  [...playerUnits, ...opponentUnits].forEach(unit => {
    if (unit.hp <= 0) return;

    if (unit.actionCooldown > 0) unit.actionCooldown--;
    if (unit.attackCooldown > 0) unit.attackCooldown--;

    if (unit.actionCooldown === 0 && unit.actions.length > 0) {
      const actionKey = unit.actions[unit.currentActionIndex];
      let actionTaken = false;
      let dx = 0, dy = 0;
      const diagonalSpeed = MOVE_SPEED / Math.sqrt(2);

      switch (actionKey) {
        case 'MOVE_FORWARD':
          dx = MOVE_SPEED * Math.cos(unit.rotation);
          dy = MOVE_SPEED * Math.sin(unit.rotation);
          break;
        case 'MOVE_BACKWARD':
          dx = MOVE_SPEED * Math.cos(unit.rotation + Math.PI);
          dy = MOVE_SPEED * Math.sin(unit.rotation + Math.PI);
          break;
        case 'MOVE_RIGHT':
          dx = MOVE_SPEED * Math.cos(unit.rotation + Math.PI / 2);
          dy = MOVE_SPEED * Math.sin(unit.rotation + Math.PI / 2);
          break;
        case 'MOVE_LEFT':
          dx = MOVE_SPEED * Math.cos(unit.rotation - Math.PI / 2);
          dy = MOVE_SPEED * Math.sin(unit.rotation - Math.PI / 2);
          break;
        case 'MOVE_TOP_RIGHT': dx = diagonalSpeed; dy = -diagonalSpeed; break;
        case 'MOVE_TOP_LEFT': dx = -diagonalSpeed; dy = -diagonalSpeed; break;
        case 'MOVE_BOTTOM_RIGHT': dx = diagonalSpeed; dy = diagonalSpeed; break;
        case 'MOVE_BOTTOM_LEFT': dx = -diagonalSpeed; dy = diagonalSpeed; break;
        
        case 'SEARCH_ENEMY':
          const enemyTeam = unit.isPlayer ? opponentUnits : playerUnits;
          let closestEnemy: Unit | null = null;
          let minDistance = Infinity;

          enemyTeam.forEach(enemy => {
            if (enemy.hp > 0) {
              const dist = Math.hypot(unit.x - enemy.x, unit.y - enemy.y);
              if (dist < minDistance) {
                minDistance = dist;
                closestEnemy = enemy;
              }
            }
          });

          if (closestEnemy) {
            // @ts-ignore - closestEnemy is not null here
            unit.rotation = Math.atan2(closestEnemy.y - unit.y, closestEnemy.x - unit.x);
          }
          actionTaken = true;
          unit.actionCooldown = 15;
          break;

        case 'ATTACK':
          if (unit.attackCooldown === 0) {
            performAttack(unit, projectiles);
            unit.attackCooldown = unit.properties.cooldownFrames;
            actionTaken = true;
            unit.actionCooldown = (unit.type === UnitType.SNIPER) ? SNIPER_STUN_FRAMES : 10;
          }
          break;
      }

      if (dx !== 0 || dy !== 0) {
        unit.x += dx;
        unit.y += dy;
        audioService.play('move');
        actionTaken = true;
        unit.actionCooldown = 5;
      }

      if (actionTaken) {
        unit.x = Math.max(UNIT_SIZE / 2, Math.min(unit.x, STAGE_WIDTH - UNIT_SIZE / 2));
        unit.y = Math.max(UNIT_SIZE / 2, Math.min(unit.y, STAGE_HEIGHT - UNIT_SIZE / 2));
        unit.currentActionIndex = (unit.currentActionIndex + 1) % unit.actions.length;
      }
    }
  });

  // Projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.x += p.vx;
    p.y += p.vy;

    // Distance check
    if (p.maxTravelDistance !== undefined) {
      const dist = Math.hypot(p.x - p.initialX, p.y - p.initialY);
      if (dist > p.maxTravelDistance) {
        if (p.isTrapProjectile) {
          traps.push({
            x: p.x, y: p.y,
            damage: p.trapDamage!,
            radius: p.trapRadius!,
            color: p.color,
            owner: p.owner,
            duration: p.trapDuration!,
            damageCooldown: 0
          });
          audioService.play('trap');
        }
        projectiles.splice(i, 1);
        continue;
      }
    }

    // Boundaries
    if (p.x < 0 || p.x > STAGE_WIDTH || p.y < 0 || p.y > STAGE_HEIGHT) {
      projectiles.splice(i, 1);
      continue;
    }

    // Collision
    const targetUnits = p.owner.isPlayer ? opponentUnits : playerUnits;
    let hit = false;
    for (const targetUnit of targetUnits) {
      if (targetUnit.hp <= 0) continue;
      const dist = Math.hypot(p.x - targetUnit.x, p.y - targetUnit.y);
      if (dist < UNIT_SIZE / 2 + p.radius) {
        targetUnit.hp -= p.damage;
        audioService.play('damage');
        projectiles.splice(i, 1);
        hit = true;
        break;
      }
    }
    if (hit) continue;
  }

  // Traps
  for (let i = traps.length - 1; i >= 0; i--) {
    const t = traps[i];
    t.duration--;
    if (t.duration <= 0) {
      traps.splice(i, 1);
      continue;
    }

    const targetUnits = t.owner.isPlayer ? opponentUnits : playerUnits;
    for (const unit of targetUnits) {
      if (unit.hp <= 0) continue;
      const dist = Math.hypot(t.x - unit.x, t.y - unit.y);
      if (dist < UNIT_SIZE / 2 + t.radius) {
        if (t.damageCooldown === 0) {
          unit.hp -= t.damage;
          audioService.play('damage');
          t.damageCooldown = 30;
        }
      }
    }
    if (t.damageCooldown > 0) t.damageCooldown--;
  }

  // Win/Lose
  const playerDead = playerUnits.every(u => u.hp <= 0);
  const opponentDead = opponentUnits.every(u => u.hp <= 0);
  
  if (playerDead) {
    state.gameRunning = false;
    state.result = 'LOSE';
    audioService.play('lose');
  } else if (opponentDead) {
    state.gameRunning = false;
    state.result = 'WIN';
    audioService.play('win');
  }
};

// Render Function
export const renderGame = (
  ctx: CanvasRenderingContext2D, 
  state: GameState, 
  cameraOffset: { x: number, y: number },
  canvasWidth: number,
  canvasHeight: number
) => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Camera Logic
  let activePlayerUnits = state.playerUnits.filter(u => u.hp > 0);
  if (activePlayerUnits.length === 0) {
    activePlayerUnits = [{ x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 } as Unit];
  }

  let minPx = Infinity, maxPx = -Infinity, minPy = Infinity, maxPy = -Infinity;
  activePlayerUnits.forEach(u => {
    minPx = Math.min(minPx, u.x); maxPx = Math.max(maxPx, u.x);
    minPy = Math.min(minPy, u.y); maxPy = Math.max(maxPy, u.y);
  });

  const center = { x: (minPx + maxPx) / 2, y: (minPy + maxPy) / 2 };
  let camX = center.x - canvasWidth / 2 + cameraOffset.x;
  let camY = center.y - canvasHeight / 2 + cameraOffset.y;

  camX = Math.max(0, Math.min(camX, STAGE_WIDTH - canvasWidth));
  camY = Math.max(0, Math.min(camY, STAGE_HEIGHT - canvasHeight));

  ctx.save();
  ctx.translate(-camX, -camY);

  // Draw Units
  [...state.playerUnits, ...state.opponentUnits].forEach(unit => {
    if (unit.hp <= 0) return;

    ctx.save();
    ctx.translate(unit.x, unit.y);
    ctx.rotate(unit.rotation);

    // Body
    ctx.fillStyle = unit.color;
    ctx.beginPath();
    ctx.arc(0, 0, UNIT_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    // Direction Line
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(UNIT_SIZE / 2, 0);
    ctx.stroke();

    // Decorations
    ctx.lineWidth = 1;
    const offset = UNIT_SIZE / 4;
    const len = UNIT_SIZE * 0.8;
    ctx.beginPath(); ctx.moveTo(0, -offset); ctx.lineTo(len, -offset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, offset); ctx.lineTo(len, offset); ctx.stroke();

    ctx.restore();

    // Team Marker
    ctx.beginPath();
    ctx.arc(unit.x, unit.y - UNIT_SIZE / 2 - TEAM_MARKER_SIZE, TEAM_MARKER_SIZE / 2, 0, Math.PI * 2);
    ctx.fillStyle = unit.isPlayer ? PLAYER_TEAM_COLOR : OPPONENT_TEAM_COLOR;
    ctx.fill();
  });

  // Draw Projectiles
  state.projectiles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });

  // Draw Traps
  state.traps.forEach(t => {
    ctx.fillStyle = t.color;
    ctx.fillRect(t.x - t.radius, t.y - t.radius, t.radius * 2, t.radius * 2);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(t.x - t.radius, t.y - t.radius, t.radius * 2, t.radius * 2);
  });

  ctx.restore();
};
