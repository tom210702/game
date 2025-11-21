import * as Tone from 'tone';

export type SoundType = 'move' | 'attack' | 'sniper_shot' | 'hit' | 'trap' | 'damage' | 'win' | 'lose';

class AudioService {
  private masterVolume: Tone.Volume;
  private generalSynth: Tone.PolySynth;
  private attackSynth: Tone.PolySynth;
  private sniperSynth: Tone.PolySynth;
  private trapSynth: Tone.MembraneSynth;
  private damageSynth: Tone.PolySynth;
  private fanfareSynth: Tone.PolySynth;
  private isReady: boolean = false;

  private lastSoundPlayedTime: Record<SoundType, number> = {
    move: 0, attack: 0, sniper_shot: 0, hit: 0, trap: 0, damage: 0, win: 0, lose: 0
  };

  private cooldowns: Record<SoundType, number> = {
    move: 50, attack: 100, sniper_shot: 100, hit: 0, trap: 150, damage: 80, win: 0, lose: 0
  };

  constructor() {
    this.masterVolume = new Tone.Volume(-10).toDestination();

    this.generalSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.5 }
    }).connect(this.masterVolume);

    this.attackSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.05, sustain: 0.1, release: 0.2 }
    }).connect(this.masterVolume);

    this.sniperSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "square" },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 0.2 }
    }).connect(this.masterVolume);

    this.trapSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 8,
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: "exponential" },
      oscillator: { type: "sine" } // noise type is handled internally by MembraneSynth options usually
    }).connect(this.masterVolume);

    this.damageSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 }
    }).connect(this.masterVolume);

    this.fanfareSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "square" },
      envelope: { attack: 0.05, decay: 0.5, sustain: 0.8, release: 1 }
    }).connect(this.masterVolume);
  }

  public async initialize() {
    if (!this.isReady) {
      try {
        if (Tone.context.state !== 'running') {
          await Tone.start();
        }
        this.isReady = true;
        console.log("Audio Initialized");
      } catch (e) {
        console.error("Failed to initialize audio", e);
      }
    }
  }

  public play(type: SoundType) {
    if (!this.isReady || Tone.context.state !== 'running') return;

    const now = performance.now();
    if (now - this.lastSoundPlayedTime[type] < this.cooldowns[type]) return;

    try {
      switch (type) {
        case 'move':
          this.generalSynth.triggerAttackRelease("C4", "8n");
          break;
        case 'attack':
          this.attackSynth.triggerAttackRelease("G4", "16n");
          break;
        case 'sniper_shot':
          this.sniperSynth.triggerAttackRelease("A5", "32n");
          break;
        case 'hit':
          this.generalSynth.triggerAttackRelease("D3", "32n");
          break;
        case 'trap':
          this.trapSynth.triggerAttackRelease("C2", "8n");
          break;
        case 'damage':
          this.damageSynth.triggerAttackRelease("F3", "16n");
          break;
        case 'win':
          this.fanfareSynth.triggerAttackRelease(["C5", "E5", "G5"], "2n");
          break;
        case 'lose':
          this.fanfareSynth.triggerAttackRelease(["C4", "G3", "C3"], "2n");
          break;
      }
      this.lastSoundPlayedTime[type] = now;
    } catch (e) {
      console.error(`Error playing sound ${type}`, e);
    }
  }
}

export const audioService = new AudioService();
