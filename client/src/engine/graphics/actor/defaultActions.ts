import { Action } from "./action";

export class DefaultActions {
  public walk = new Action('walk', 3, 'w')
  public walkBack = new Action('walkBack', 1.5, 's')
  public walkBackFast = new Action('walkBackFast', 3, 'na')
  public idle = new Action('idle', 0, 'na')
  public idleJump = new Action('idleJump', 6, ' ')
  public run = new Action('run', 6, 'na')
  public runJump = new Action('runJump', 6, 'na')
  public fall = new Action('fall', 0, 'na')
  public turnLeft = new Action("turnLeft", Math.PI / 8, "a");
  public turnLeftFast = new Action("turnLeftFast", Math.PI / 4, "na");
  public turnRight = new Action("turnRight", Math.PI / 8, "d");
  public turnRightFast = new Action("turnRightFast", Math.PI / 4, "na");
  public strafeLeft = new Action("strafeLeft", 1.5, "q");
  public strafeLeftFast = new Action("strafeLeftFast", 3, "na");
  public strafeRight = new Action("strafeRight", 1.5, "e");
  public strafeRightFast = new Action("strafeRightFast", 3, "na");
  public slideBack = new Action("slideBack", 0, "na");

  public reset() {
    for (const key in this) {
      if (this[key] instanceof Action) {
        const action = this[key] as Action;
        action.reset();
      }
    }
  }
}