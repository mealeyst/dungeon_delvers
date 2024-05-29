import { ATTRIBUTES, Attributes } from './attribute'
import racesData from '../../content/race.json'
import data from '../../content/race.json' with { type: "json", const: true };

//export type RaceType = 'dwarf' | 'goblin' | 'human' | 'orc' | 'elf' | 'half-orc'
export type RaceType = (typeof data)[number]['race']

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
          new Attributes({
            [ATTRIBUTES.CON]: attributeValues[ATTRIBUTES.CON],
            [ATTRIBUTES.DEX]: attributeValues[ATTRIBUTES.DEX],
            [ATTRIBUTES.INT]: attributeValues[ATTRIBUTES.INT],
            [ATTRIBUTES.MIG]: attributeValues[ATTRIBUTES.MIG],
            [ATTRIBUTES.PER]: attributeValues[ATTRIBUTES.PER],
            [ATTRIBUTES.RES]: attributeValues[ATTRIBUTES.RES],
          }),
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
