import { Actor } from '../actor'

export type ActionResultArgs = {
  succeeded: boolean
  done: boolean
  alternative?: Action
}

export type ActionArgs = {
  actor: Actor
  cooldown?: number
  cost?: number
  description: string
  name: string
  range?: number
  onPerform: () => ActionResult
}

export class ActionResult {
  private _succeeded: boolean
  private _done: boolean
  private _alternative?: Action

  constructor({ succeeded, done, alternative }: ActionResultArgs) {
    this._succeeded = succeeded
    this._done = done
    this._alternative = alternative
  }

  get succeeded() {
    return this._succeeded
  }

  get done() {
    return this._done
  }

  get alternative() {
    return this._alternative
  }
}

export const SUCCEEDED = new ActionResult({
  done: true,
  succeeded: true,
})
export const FAILED = new ActionResult({
  done: true,
  succeeded: false,
})
export const NOT_DONE = (alternative: Action) =>
  new ActionResult({
    alternative,
    done: false,
    succeeded: false,
  })

export class Action {
  private _actor: Actor
  private _cooldown: number
  private _cost: number
  private _description: string
  private _name: string
  private _range: number
  private _onPerform: () => ActionResult

  constructor({
    name,
    actor,
    description,
    cost = 0,
    cooldown = 0,
    range = 0,
    onPerform,
  }: ActionArgs) {
    this._actor = actor
    this._name = name
    this._description = description
    this._cost = cost
    this._cooldown = cooldown
    this._range = range
    this._onPerform = onPerform
  }

  perform(): ActionResult {
    return this._onPerform()
  }

  get actor() {
    return this._actor
  }

  get cooldown() {
    return this._cooldown
  }

  get cost() {
    return this._cost
  }

  get description() {
    return this._description
  }

  get name() {
    return this._name
  }

  get range() {
    return this._range
  }
}
