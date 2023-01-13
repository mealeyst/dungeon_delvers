import { ActionManager, ExecuteCodeAction, Scene } from "@babylonjs/core";
import { Assets } from "../Assets";

export type InputMap = Record<string, boolean>;

export class InputManager {
  public inputMap: InputMap;
  constructor(scene: Scene, assets: Assets) {
    this.inputMap = {};
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (event) => {
        this.inputMap[event.sourceEvent.key] =
          event.sourceEvent.type == "keydown";
      })
    );
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (event) => {
        this.inputMap[event.sourceEvent.key] =
          event.sourceEvent.type == "keydown";
      })
    );
  }
}
