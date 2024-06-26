import { Scene, SceneLoader, Vector3, Animation } from '@babylonjs/core'
import { ATTRIBUTES, Attributes } from './attribute'

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

export type BaseStats = {
  accuracy: number
  deflection: number
  fortitude: number
  health: number
  reflex: number
  willpower: number
}

export class Actor {
  private id: string
  private _attributes: Attributes
  private currentHealth: number
  // Action stats are calculated based on actor's action/weapon
  private _actionStats: {
    accuracy: number
    actionSpeed: number
    areaOfEffect: number
    damage: number
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

  constructor(id: string, attributes: Attributes, baseStats: BaseStats) {
    this.id = id
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
          .calculateModifier(MOD_ACTION_SPEED) + 0,
      ),
      areaOfEffect: Math.ceil(
        this._attributes
          .getAttribute(ATTRIBUTES.INT)
          .calculateModifier(MOD_AREA_OF_EFFECT) + 0,
      ),
      damage: Math.ceil(
        this._attributes
          .getAttribute(ATTRIBUTES.MIG)
          .calculateModifier(MOD_DAMAGE) + 0,
      ),
      duration: Math.ceil(
        this._attributes
          .getAttribute(ATTRIBUTES.INT)
          .calculateModifier(MOD_DURATION) + 0,
      ),
      healing: Math.ceil(
        this._attributes
          .getAttribute(ATTRIBUTES.MIG)
          .calculateModifier(MOD_HEALING + 0),
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
  get health() {
    return {
      current: this.currentHealth,
      max: this._passiveStats.maxHealth,
    }
  }
}
