import { Actor } from '../actor'
import { ATTRIBUTES, Attributes } from '../attribute'
import { Action, ActionResult, SUCCEEDED, FAILED, NOT_DONE } from './action'

const actor = new Actor(
  'hero',
  new Attributes({
    [ATTRIBUTES.CON]: 14,
    [ATTRIBUTES.DEX]: 16,
    [ATTRIBUTES.INT]: 9,
    [ATTRIBUTES.MIG]: 11,
    [ATTRIBUTES.PER]: 15,
    [ATTRIBUTES.RES]: 10,
  }),
  {
    accuracy: 46, // 47
    deflection: 37, // 37
    fortitude: 41, // 42
    health: 117, // 118
    reflex: 53, // 54
    willpower: 30, // 30
  },
)

const idle = new Action({
  name: 'Idle',
  actor,
  description: '%t does nothing.',
  cost: 0,
  cooldown: 0,
  onPerform: () => {
    return new ActionResult({ done: false, succeeded: false })
  },
})

const firebolt = new Action({
  name: 'Firebolt',
  actor,
  description: '%t hurls a mote of fire!',
  cost: 1,
  cooldown: 2,
  range: 3,
  onPerform: () => {
    return new ActionResult({ succeeded: true, done: true })
  },
})

describe('Action', () => {
  it('should create an instance', () => {
    expect(firebolt).toBeTruthy()
  })
  it('should allow for the action to be performed', () => {
    expect(firebolt.perform()).toEqual(SUCCEEDED)
  })
})

describe('ActionResult', () => {
  it('should create an instance', () => {
    expect(
      new ActionResult({
        alternative: idle,
        done: true,
        succeeded: true,
      }),
    ).toBeTruthy()
  })
})

describe('SUCCEEDED', () => {
  it('should create a new ActionResult that has succeeded and is done', () => {
    expect(SUCCEEDED).toEqual(
      new ActionResult({
        done: true,
        succeeded: true,
      }),
    )
  })
})

describe('FAILED', () => {
  it('should create a new ActionResult that has not succeeded and is done', () => {
    expect(FAILED).toEqual(
      new ActionResult({
        done: true,
        succeeded: false,
      }),
    )
  })
})

describe('NOT_DONE', () => {
  it('should create a new ActionResult that has not succeeded, is not done, and has an alternative action to perform', () => {
    expect(NOT_DONE(idle)).toEqual(
      new ActionResult({
        alternative: idle,
        done: false,
        succeeded: false,
      }),
    )
  })
})
