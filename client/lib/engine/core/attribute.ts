enum ATTRIBUTE_NAMES {
  MIG = "MIGHT",
  CON = "CONSTITUTION",
  DEX = "DEXTERITY",
  PER = "PERCEPTION",
  INT = "INTELLECT",
  RES = "RESOLVE"
}

const MIN_VALUE = 3;
const MAX_VALUE = 18;

const ACTION_SPEED = 0.03;
const AREA_OF_EFFECT_MODIFIER = 0.06;
const DAMAGE_MODIFIER = 0.03;
const DEFLECTION_MODIFIER = 0.01;
const DURATION_MODIFIER = 0.05;
const ENDURANCE_MODIFIER = 0.03;
const FORTITUDE_MODIFIER = 0.02;
const HEALING_MODIFIER = 0.03;
const REFLEX_MODIFIER = 0.02;
const WILLPOWER_MODIFIER = 0.02;

abstract class Attribute {
  private _value: number
  constructor(_value: number) {
    this._value = _value;
  }
  get value() {
    return this._value;
  }
  set value(_value) {
    this._value = _value;
  }
}

class Might extends Attribute {
  constructor (_value: number) {
    super(_value)
  }
  

}

class Constitution extends Attribute {
  constructor (_value: number) {
    super(_value)
  }
}

class Dexterity extends Attribute {
  constructor (_value: number) {
    super(_value)
  }
}

class Perception extends Attribute {
  constructor (_value: number) {
    super(_value)
  }
}

class Intellect extends Attribute {
  constructor (_value: number) {
    super(_value)
  }
}

class Resolve extends Attribute {
  constructor (_value: number) {
    super(_value)
  }
}