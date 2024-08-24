import { Actor } from './actor'
import { ATTRIBUTES, Attributes } from './attribute'
import { Action, ActionResult, SUCCEEDED, FAILED, NOT_DONE } from './action'
import { MonsterType } from '../../content/monsters'
import { actions } from '../../content/actions'
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
    accuracy: 46,
    deflection: 37,
    fortitude: 41,
    health: 117,
    reflex: 53,
    willpower: 30,
  },
  MonsterType.Humanoid,
)

const target = new Actor(
  'bat',
  new Attributes({
    [ATTRIBUTES.CON]: 10,
    [ATTRIBUTES.DEX]: 10,
    [ATTRIBUTES.INT]: 4,
    [ATTRIBUTES.MIG]: 10,
    [ATTRIBUTES.PER]: 15,
    [ATTRIBUTES.RES]: 10,
  }),
  {
    accuracy: 47,
    deflection: 37,
    fortitude: 42,
    health: 118,
    reflex: 54,
    willpower: 30,
  },
  MonsterType.Beast,
)

const idle = new Action({
  actor,
  target: actor,
  name: 'idle',
  description: 'Do nothing',
  onPerform: () => SUCCEEDED,
})

describe('Action', () => {
  it('should create an instance', () => {
    expect(actions.firebolt).toBeTruthy()
  })
  it('should allow for the action to be performed', () => {
    expect(actions.firebolt(actor, target).perform()).toEqual(SUCCEEDED)
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
