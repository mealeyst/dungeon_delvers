export class PlayerClass {
  private _description: string
  private _name: string
  constructor(name: string, description: string) {
    this._name = name
    this._description = description
  }
  get description() {
    return this._description
  }
  get name() {
    return this._name
  }
}

export class PlayerClasses {}
