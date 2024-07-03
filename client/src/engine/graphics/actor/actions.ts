import { Action } from "./action";

export type DefaultActions = {
  walk: Action;
  walkBack: Action;
  walkBackFast: Action;
  idle: Action;
  idleJump: Action;
  run: Action;
  runJump: Action;
  fall: Action;
  turnLeft: Action;
  turnLeftFast: Action;
  turnRight: Action;
  turnRightFast: Action;
  strafeLeft: Action;
  strafeLeftFast: Action;
  strafeRight: Action;
  strafeRightFast: Action;
  slideBack: Action;
}

export class Actions {
  public _actions: DefaultActions;

  constructor(actions?: DefaultActions) {
    if (actions) {
      this._actions = actions;
    } else {
      this._actions = {
        walk: new Action('walk', 3, 'w'),
        walkBack: new Action('walkBack', 1.5, 's'),
        walkBackFast: new Action('walkBackFast', 3, 'na'),
        idle: new Action('idle', 0, 'na'),
        idleJump: new Action('idleJump', 6, ' '),
        run: new Action('run', 6, 'na'),
        runJump: new Action('runJump', 6, 'na'),
        fall: new Action('fall', 0, 'na'),
        turnLeft: new Action("turnLeft", Math.PI / 8, "a"),
        turnLeftFast: new Action("turnLeftFast", Math.PI / 4, "na"),
        turnRight: new Action("turnRight", Math.PI / 8, "d"),
        turnRightFast: new Action("turnRightFast", Math.PI / 4, "na"),
        strafeLeft: new Action("strafeLeft", 1.5, "q"),
        strafeLeftFast: new Action("strafeLeftFast", 3, "na"),
        strafeRight: new Action("strafeRight", 1.5, "e"),
        strafeRightFast: new Action("strafeRightFast", 3, "na"),
        slideBack: new Action("slideBack", 0, "na"),
      }
    }
  }

  public reset() {
    for (const key in this._actions) {
      this._actions[key as keyof typeof this._actions].reset();
    }
  }
}