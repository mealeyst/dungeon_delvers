import { ATTRIBUTES, Attributes } from './attribute'
import { MonsterType } from '../../content/monsters'

const MOD_ACCURACY = 0.01
const MOD_ACTION_SPEED = 0.03
const MOD_AREA_OF_EFFECT = 0.06
const MOD_CONCENTRATION = 0.03
const MOD_DAMAGE = 0.03
const MOD_DEFLECTION = 0.01
const MOD_DURATION = 0.05
const MOD_FORTITUDE = 0.02
const MOD_HEALING = 0.03
const MOD_HEALTH = 0.05
const MOD_REFLEX = 0.02
const MOD_WILLPOWER = 0.02

export enum ATTACK_RESULT {
  CRITICAL = 'CRITICAL',
  HIT = 'HIT',
  MISS = 'MISS',
  GRAZE = 'GRAZE',
}

export type DefenseStats = {
  deflection: number
  fortitude: number
  reflex: number
  willpower: number
}

export type BaseStats = DefenseStats & {
  accuracy: number
  health: number
}

export class Actor {
  private _id: string
  private _attributes: Attributes
  private currentHealth: number
  private _name: string
  // Action stats are calculated based on actor's action/weapon
  private _actionStats: {
    accuracy: number
    actionSpeed: number
    areaOfEffect: number
    damageMod: number
    duration: number
    healing: number
  }

  // Defense stats are calculated based on actor's level and class
  private _defenseStats: {
    deflection: number
    fortitude: number
    reflex: number
    willpower: number
  }
  // Passive stats are calculated based on actor's level and class
  private _passiveStats: {
    concentration: number
    maxHealth: number
  }

  constructor(
    id: string,
    attributes: Attributes,
    baseStats: BaseStats,
    type: MonsterType,
  ) {
    this._id = id
    this._attributes = attributes
    this._actionStats = {
      accuracy: this.calculateStat(
        baseStats.accuracy,
        this._attributes
          .getAttribute(ATTRIBUTES.PER)
          .calculateModifier(MOD_ACCURACY),
      ),
      actionSpeed: Math.ceil(
        this._attributes
          .getAttribute(ATTRIBUTES.DEX)
          .calculateModifier(MOD_ACTION_SPEED),
      ),
      areaOfEffect: Math.ceil(
        this._attributes
          .getAttribute(ATTRIBUTES.INT)
          .calculateModifier(MOD_AREA_OF_EFFECT),
      ),
      damageMod: this._attributes
        .getAttribute(ATTRIBUTES.MIG)
        .calculateModifier(MOD_DAMAGE),
      duration: Math.ceil(
        this._attributes
          .getAttribute(ATTRIBUTES.INT)
          .calculateModifier(MOD_DURATION),
      ),
      healing: Math.ceil(
        this._attributes
          .getAttribute(ATTRIBUTES.MIG)
          .calculateModifier(MOD_HEALING),
      ),
    }
    this._defenseStats = {
      deflection: this.calculateStat(
        baseStats.deflection,
        this._attributes
          .getAttribute(ATTRIBUTES.RES)
          .calculateModifier(MOD_DEFLECTION),
      ),
      fortitude: this.calculateStat(
        baseStats.fortitude,
        this._attributes
          .getAttribute(ATTRIBUTES.CON)
          .calculateModifier(MOD_FORTITUDE) +
          this._attributes
            .getAttribute(ATTRIBUTES.MIG)
            .calculateModifier(MOD_FORTITUDE),
      ),
      reflex: this.calculateStat(
        baseStats.reflex,
        this._attributes
          .getAttribute(ATTRIBUTES.DEX)
          .calculateModifier(MOD_REFLEX) +
          this._attributes
            .getAttribute(ATTRIBUTES.PER)
            .calculateModifier(MOD_REFLEX),
      ),
      willpower: this.calculateStat(
        baseStats.willpower,
        this._attributes
          .getAttribute(ATTRIBUTES.INT)
          .calculateModifier(MOD_WILLPOWER) +
          this._attributes
            .getAttribute(ATTRIBUTES.RES)
            .calculateModifier(MOD_WILLPOWER),
      ),
    }
    this._passiveStats = {
      concentration: Math.ceil(
        this._attributes
          .getAttribute(ATTRIBUTES.RES)
          .calculateModifier(MOD_CONCENTRATION) + 0,
      ),
      maxHealth: this.calculateStat(
        baseStats.health,
        this._attributes
          .getAttribute(ATTRIBUTES.CON)
          .calculateModifier(MOD_HEALTH),
      ),
    }
    // On creation, set current health to max health
    this.currentHealth = this._passiveStats.maxHealth
  }
  calculateStat(base: number, modifiers: number) {
    return Math.ceil(base * 1 + modifiers)
  }
  get stats() {
    return {
      ...this._actionStats,
      ...this._defenseStats,
      ...this._passiveStats,
    }
  }
  get isAlive() {
    return this.currentHealth > 0
  }
  get health() {
    return this.currentHealth
  }

  set health(value: number) {
    this.currentHealth = value
  }

  get maxHealth() {
    return this._passiveStats.maxHealth
  }

  set maxHealth(value: number) {
    this._passiveStats.maxHealth = value
  }

  get name() {
    return this._name
  }

  attackResolution = (target: Actor, defenseStat: keyof DefenseStats) => {
    const hitChance =
      Math.floor(Math.random() * 100) +
      Math.floor(this.stats.accuracy - target.stats[defenseStat])
    if (hitChance >= 101) {
      return ATTACK_RESULT.CRITICAL
    } else if (hitChance >= 50) {
      return ATTACK_RESULT.HIT
    } else if (hitChance >= 16) {
      return ATTACK_RESULT.GRAZE
    } else {
      return ATTACK_RESULT.MISS
    }
  }

  calculateDamage = (
    target: Actor,
    defenseStat: keyof DefenseStats,
    minDamage: number,
    maxDamage: number,
  ) => {
    const attackResult = this.attackResolution(target, defenseStat)
    const damage = () =>
      Math.floor(
        (Math.random() * (maxDamage - minDamage + 1) + minDamage) *
          (1 + this.stats.damageMod),
      )
    switch (attackResult) {
      case ATTACK_RESULT.CRITICAL:
        return Math.floor(damage() * 1.5)
      case ATTACK_RESULT.HIT:
        return damage()
      case ATTACK_RESULT.GRAZE:
        return Math.floor(damage() * 0.5)
      case ATTACK_RESULT.MISS:
        return 'miss'
    }
  }
}
