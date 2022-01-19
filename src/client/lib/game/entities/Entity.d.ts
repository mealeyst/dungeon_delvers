import { Scene } from '@babylonjs/core';
import { GUI } from 'dat.gui';

export interface Entity {
  scene: Scene
  gui: GUI
}
