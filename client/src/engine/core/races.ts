import { ATTRIBUTES, Attributes } from './attribute'
import { races } from '../../content/races'

export type RaceName = (typeof races)[number]['race']

export class Race {
  private _name: RaceName
  private _attributes: Attributes
  private _description: string
  constructor(name: RaceName, attributes: Attributes, description: string) {
    this._name = name
    this._attributes = attributes
    this._description = description
  }
  get name() {
    return this._name
  }
  get attributes() {
    return this._attributes
  }
  get description() {
    return this._description
  }
}

export class Races {
  private _races: Record<RaceName, Race>
  constructor() {
    this._races = races.reduce(
      (accumulator, { race, attributes: attributeValues, description }) => {
        accumulator[race as RaceName] = new Race(
          race,
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
      {} as Record<RaceName, Race>,
    )
  }
  race(race: RaceName) {
    return this._races[race]
  }
  attributes(race: RaceName) {
    return this._races[race].attributes
  }
  description(race: RaceName) {
    return this._races[race].description
  }
}
