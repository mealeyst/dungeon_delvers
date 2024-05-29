import {
  ATTRIBUTE_MAX_VALUE,
  ATTRIBUTE_MIN_VALUE,
  Constitution,
  Dexterity,
  Intellect,
  Might,
  Perception,
  Resolve,
} from './attribute'
import { random, randomChoice } from './random'

const attributes = [
  Constitution,
  Dexterity,
  Intellect,
  Might,
  Perception,
  Resolve,
]

describe('Attributes', () => {
  test.each(attributes)(
    `Construction will not error if value is between ${ATTRIBUTE_MIN_VALUE} and ${ATTRIBUTE_MAX_VALUE}`,
    Attribute => {
      expect(
        () => new Attribute(random(ATTRIBUTE_MIN_VALUE, ATTRIBUTE_MAX_VALUE)),
      ).not.toThrow()
    },
  )
  test.each(attributes)(
    `Construction will error if value is between ${ATTRIBUTE_MIN_VALUE} and ${ATTRIBUTE_MAX_VALUE}`,
    Attribute => {
      const value = randomChoice([
        random(0, ATTRIBUTE_MIN_VALUE - 1),
        random(ATTRIBUTE_MAX_VALUE + 1, 20),
      ])
      expect(() => new Attribute(value)).toThrow()
    },
  )
  test('Calculate modifier', () => {
    const Attribute = randomChoice(attributes)
    expect(new Attribute(6).calculateModifier(0.05)).toBe(-0.2)
    expect(new Attribute(8).calculateModifier(0.05)).toBe(-0.1)
    expect(new Attribute(10).calculateModifier(0.05)).toBe(0)
    expect(new Attribute(12).calculateModifier(0.05)).toBe(0.1)
    expect(new Attribute(14).calculateModifier(0.05)).toBe(0.2)
  })
})
