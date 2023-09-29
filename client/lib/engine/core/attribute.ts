export enum ATTRIBUTES {
  CON = 'CONSTITUTION',
  DEX = 'DEXTERITY',
  INT = 'INTELLECT',
  MIG = 'MIGHT',
  PER = 'PERCEPTION',
  RES = 'RESOLVE',
}

export type Attributes = {
  [ATTRIBUTES.CON]: Constitution
  [ATTRIBUTES.DEX]: Dexterity
  [ATTRIBUTES.INT]: Intellect
  [ATTRIBUTES.MIG]: Might
  [ATTRIBUTES.PER]: Perception
  [ATTRIBUTES.RES]: Resolve
}

export const ATTRIBUTE_MAX_VALUE = 18
export const ATTRIBUTE_MIN_VALUE = 3

class Attribute {
  private _value: number
  constructor(_value: number) {
    if (!this.attributeWithinBounds(_value)) {
      throw new Error(
        `Attribute value ${_value} is not within the bounds of ${ATTRIBUTE_MIN_VALUE} and ${ATTRIBUTE_MAX_VALUE}`,
      )
    }
    this._value = _value
  }
  get value() {
    return this._value
  }
  set value(_value) {
    this._value = _value
  }
  attributeWithinBounds(value: number) {
    return value >= ATTRIBUTE_MIN_VALUE && value <= ATTRIBUTE_MAX_VALUE
      ? true
      : false
  }
  calculateModifier(modifier: number) {
    return (this._value - 10) * modifier
  }
}

export class Constitution extends Attribute {
  constructor(_value: number) {
    super(_value)
  }
}

export class Dexterity extends Attribute {
  constructor(_value: number) {
    super(_value)
  }
}

export class Intellect extends Attribute {
  constructor(_value: number) {
    super(_value)
  }
}

export class Might extends Attribute {
  constructor(_value: number) {
    super(_value)
  }
}

export class Perception extends Attribute {
  constructor(_value: number) {
    super(_value)
  }
}

export class Resolve extends Attribute {
  constructor(_value: number) {
    super(_value)
  }
}
