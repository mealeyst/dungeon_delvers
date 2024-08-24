import { Action, ActionResult } from '../engine/core/action'
import { Actor } from '../engine/core/actor'

export const actions = {
  autoAttack: (actor: Actor, target: Actor) => {
    return new Action({
      actor,
      name: 'Auto Attack',
      target,
      description: '%me attacks %t!',
      onPerform: () => {
        if (target.isAlive) {
          return new ActionResult({ done: false, succeeded: false })
        }
        return new ActionResult({ done: true, succeeded: true })
      },
    })
  },
  firebolt: (actor: Actor, target: Actor) => {
    return new Action({
      actor,
      name: 'Firebolt',
      target,
      description: '%t hurls a mote of fire!',
      cost: 1,
      cooldown: 2,
      range: 3,
      onPerform: () => {
        return new ActionResult({ succeeded: true, done: true })
      },
    })
  },
}
