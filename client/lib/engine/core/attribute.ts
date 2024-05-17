export enum ATTRIBUTES {
  CON = 'CONSTITUTION',
  DEX = 'DEXTERITY',
  INT = 'INTELLECT',
  MIG = 'MIGHT',
  PER = 'PERCEPTION',
  RES = 'RESOLVE',
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

export type attributeProps = {
  [ATTRIBUTES.CON]: number
  [ATTRIBUTES.DEX]: number
  [ATTRIBUTES.INT]: number
  [ATTRIBUTES.MIG]: number
  [ATTRIBUTES.PER]: number
  [ATTRIBUTES.RES]: number
}

export class Attributes {
  private _attributes = {
    [ATTRIBUTES.CON]: new Constitution(10),
    [ATTRIBUTES.DEX]: new Dexterity(10),
    [ATTRIBUTES.INT]: new Intellect(10),
    [ATTRIBUTES.MIG]: new Might(10),
    [ATTRIBUTES.PER]: new Perception(10),
    [ATTRIBUTES.RES]: new Resolve(10),
  }
  constructor({
    [ATTRIBUTES.CON]: constitution,
    [ATTRIBUTES.DEX]: dexterity,
    [ATTRIBUTES.INT]: intellect,
    [ATTRIBUTES.MIG]: might,
    [ATTRIBUTES.PER]: perception,
    [ATTRIBUTES.RES]: resolve,
  }: attributeProps) {
    this._attributes[ATTRIBUTES.CON] = new Constitution(constitution)
    this._attributes[ATTRIBUTES.DEX] = new Dexterity(dexterity)
    this._attributes[ATTRIBUTES.INT] = new Intellect(intellect)
    this._attributes[ATTRIBUTES.MIG] = new Might(might)
    this._attributes[ATTRIBUTES.PER] = new Perception(perception)
    this._attributes[ATTRIBUTES.RES] = new Resolve(resolve)
  }

  setAttributes({
    [ATTRIBUTES.CON]: constitution,
    [ATTRIBUTES.DEX]: dexterity,
    [ATTRIBUTES.INT]: intellect,
    [ATTRIBUTES.MIG]: might,
    [ATTRIBUTES.PER]: perception,
    [ATTRIBUTES.RES]: resolve,
  }: attributeProps) {
    this._attributes[ATTRIBUTES.CON] = new Constitution(constitution)
    this._attributes[ATTRIBUTES.DEX] = new Dexterity(dexterity)
    this._attributes[ATTRIBUTES.INT] = new Intellect(intellect)
    this._attributes[ATTRIBUTES.MIG] = new Might(might)
    this._attributes[ATTRIBUTES.PER] = new Perception(perception)
    this._attributes[ATTRIBUTES.RES] = new Resolve(resolve)
  }

  getAttributes() {
    return this._attributes
  }

  setAttribute(attribute: ATTRIBUTES, value: number) {
    this._attributes[attribute].value = value
  }

  getAttribute(attribute: ATTRIBUTES) {
    return this._attributes[attribute]
  }
}
