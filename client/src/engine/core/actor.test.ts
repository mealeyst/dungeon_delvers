import { MonsterType } from '../../content/monsters'
import { ATTACK_RESULT, Actor, DefenseStats } from './actor'
import { ATTRIBUTES, Attributes } from './attribute'

const actor = new Actor(
  'test',
  new Attributes({
    [ATTRIBUTES.CON]: 14,
    [ATTRIBUTES.DEX]: 16,
    [ATTRIBUTES.INT]: 9,
    [ATTRIBUTES.MIG]: 11,
    [ATTRIBUTES.PER]: 15,
    [ATTRIBUTES.RES]: 10,
  }),
  {
    accuracy: 46, // 47
    deflection: 37, // 37
    fortitude: 41, // 42
    health: 117, // 118
    reflex: 53, // 54
    willpower: 30, // 30
  },
  MonsterType.Humanoid,
)

afterEach(() => {
  jest.restoreAllMocks()
})
test('Actor constructor', () => {
  expect(actor.stats).toEqual({
    accuracy: 47,
    actionSpeed: 1,
    areaOfEffect: -0,
    concentration: 0,
    damageMod: 0.03,
    deflection: 37,
    duration: -0,
    fortitude: 42,
    healing: 1,
    maxHealth: 118,
    reflex: 54,
    willpower: 30,
  })
})
test('Actor.attackResolution should return MISS if the hitChance is below 16', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0.05)
  const result = actor.attackResolution(actor, 'deflection')
  expect(result).toEqual(ATTACK_RESULT.MISS)
})

test('Actor.attackResolution should return GRAZE if the hitChance is above 16', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0.15)
  const result = actor.attackResolution(actor, 'deflection')
  expect(result).toEqual(ATTACK_RESULT.GRAZE)
})

test('Actor.attackResolution should return HIT if the hitChance is above 50', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0.5)
  const result = actor.attackResolution(actor, 'deflection')
  expect(result).toEqual(ATTACK_RESULT.HIT)
})

test('Actor.attackResolution should return CRITICAL if the hitChance is above 100', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0.99)
  const result = actor.attackResolution(actor, 'deflection')
  expect(result).toEqual(ATTACK_RESULT.CRITICAL)
})

test('Actor.calculateDamage should return no damage if the attack is a miss', () => {
  jest.spyOn(actor, 'attackResolution').mockReturnValue(ATTACK_RESULT.MISS)
  const result = actor.calculateDamage(actor, 'deflection', 1, 2)
  expect(result).toEqual('miss')
})

test('Actor.calculateDamage should return half damage if the attack is a graze', () => {
  jest.spyOn(actor, 'attackResolution').mockReturnValue(ATTACK_RESULT.GRAZE)
  jest.spyOn(Math, 'random').mockReturnValue(0.5)
  const result = actor.calculateDamage(actor, 'deflection', 10, 15)
  expect(result).toEqual(6)
})

test('Actor.calculateDamage should return full damage if the attack is a hit', () => {
  jest.spyOn(actor, 'attackResolution').mockReturnValue(ATTACK_RESULT.HIT)
  jest.spyOn(Math, 'random').mockReturnValue(0.5)
  const result = actor.calculateDamage(actor, 'deflection', 10, 15)
  expect(result).toEqual(13)
})

test('Actor.calculateDamage should return 1.5x damage if the attack is a critical', () => {
  jest.spyOn(actor, 'attackResolution').mockReturnValue(ATTACK_RESULT.CRITICAL)
  jest.spyOn(Math, 'random').mockReturnValue(0.5)
  const result = actor.calculateDamage(actor, 'deflection', 10, 15)
  expect(result).toEqual(19)
})
