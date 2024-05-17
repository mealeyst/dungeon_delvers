import { Actor } from './actor'
import { ATTRIBUTES, Attributes } from './attribute'

test('Actor', () => {
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
  )
  expect(actor.stats).toEqual({
    accuracy: 47,
    actionSpeed: 1,
    areaOfEffect: -0,
    concentration: 0,
    damage: 1,
    deflection: 37,
    duration: -0,
    fortitude: 42,
    healing: 1,
    maxHealth: 118,
    reflex: 54,
    willpower: 30,
  })
})
