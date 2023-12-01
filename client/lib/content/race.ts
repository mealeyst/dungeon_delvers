import {
  ATTRIBUTES,
  Attributes,
  Constitution,
  Dexterity,
  Intellect,
  Might,
  Perception,
  Resolve,
} from '../engine/core/attribute'
import racesData from './race.json'

export type RaceType = 'dwarf' | 'goblin' | 'human' | 'orc' | 'elf' | 'half-orc'

export class Race {
  private _attributes: Attributes
  private _description: string
  constructor(attributes: Attributes, description: string) {
    this._attributes = attributes
    this._description = description
  }
  get attributes() {
    return this._attributes
  }
  get description() {
    return this._description
  }
}

export class Races {
  private _races: Record<RaceType, Race>
  constructor() {
    this._races = racesData.reduce(
      (accumulator, { race, attributes: attributeValues, description }) => {
        accumulator[race as RaceType] = new Race(
          {
            [ATTRIBUTES.CON]: new Constitution(attributeValues[ATTRIBUTES.CON]),
            [ATTRIBUTES.DEX]: new Dexterity(attributeValues[ATTRIBUTES.DEX]),
            [ATTRIBUTES.INT]: new Intellect(attributeValues[ATTRIBUTES.INT]),
            [ATTRIBUTES.MIG]: new Might(attributeValues[ATTRIBUTES.MIG]),
            [ATTRIBUTES.PER]: new Perception(attributeValues[ATTRIBUTES.PER]),
            [ATTRIBUTES.RES]: new Resolve(attributeValues[ATTRIBUTES.RES]),
          },
          description,
        )
        return accumulator
      },
      {} as Record<RaceType, Race>,
    )
  }
  attributes(race: RaceType) {
    return this._races[race].attributes
  }
  description(race: RaceType) {
    return this._races[race].description
  }
}
