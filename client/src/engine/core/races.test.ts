import { Race, Races } from './races'
import { races } from '../../content/races'
import { ATTRIBUTES, Attributes } from './attribute'

describe('Race class', () => {
  test.each(races)(
    '$race class has expected data',
    ({ race, attributes, description }) => {
      const raceAttributes = new Attributes({
        [ATTRIBUTES.CON]: attributes[ATTRIBUTES.CON],
        [ATTRIBUTES.DEX]: attributes[ATTRIBUTES.DEX],
        [ATTRIBUTES.INT]: attributes[ATTRIBUTES.INT],
        [ATTRIBUTES.MIG]: attributes[ATTRIBUTES.MIG],
        [ATTRIBUTES.PER]: attributes[ATTRIBUTES.PER],
        [ATTRIBUTES.RES]: attributes[ATTRIBUTES.RES],
      })
      const raceInstance = new Race(race, raceAttributes, description)
      expect(raceInstance.name).toEqual(race)
      expect(raceInstance.attributes).toEqual(raceAttributes)
      expect(raceInstance.description).toEqual(description)
    },
  )
})

describe('Races class', () => {
  it('instantiates with expected data', () => {
    const racesInstance = new Races()
    races.forEach(({ race, attributes, description }) => {
      const raceAttributes = new Attributes({
        [ATTRIBUTES.CON]: attributes[ATTRIBUTES.CON],
        [ATTRIBUTES.DEX]: attributes[ATTRIBUTES.DEX],
        [ATTRIBUTES.INT]: attributes[ATTRIBUTES.INT],
        [ATTRIBUTES.MIG]: attributes[ATTRIBUTES.MIG],
        [ATTRIBUTES.PER]: attributes[ATTRIBUTES.PER],
        [ATTRIBUTES.RES]: attributes[ATTRIBUTES.RES],
      })
      expect(racesInstance.attributes(race)).toEqual(raceAttributes)
      expect(racesInstance.description(race)).toEqual(description)
      expect(racesInstance.race(race).name).toEqual(race)
    })
  })
})
