import { Actor } from './actor'
import {
  ATTRIBUTES,
  Constitution,
  Dexterity,
  Intellect,
  Might,
  Perception,
  Resolve,
} from './attribute'

test('Actor', () => {
  const actor = new Actor(
    'test',
    {
      [ATTRIBUTES.CON]: new Constitution(14),
      [ATTRIBUTES.DEX]: new Dexterity(16),
      [ATTRIBUTES.INT]: new Intellect(9),
      [ATTRIBUTES.MIG]: new Might(11),
      [ATTRIBUTES.PER]: new Perception(15),
      [ATTRIBUTES.RES]: new Resolve(10),
    },
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
    health: 118,
    reflex: 54,
    willpower: 30,
  })
})
