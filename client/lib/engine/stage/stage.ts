import {
  FreeCamera,
  Scene,
  Vector3,
  HemisphericLight,
  Engine,
} from '@babylonjs/core'
import '@babylonjs/core/Debug/debugLayer'
import '@babylonjs/inspector'
import { Entry } from '../../content/stage/entry'
import { Exit } from '../../content/stage/exit'
import { Monster } from '../../content/stage/monster'
import { DungeonGenerator } from './dungeon_generator'

export class Stage {
  public canvas: HTMLCanvasElement
  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'renderCanvas'
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.display = 'block'
    this.canvas.oncontextmenu = () => false
    document.body.appendChild(this.canvas)
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    const engine = new Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
    })

    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine)

    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera('camera1', new Vector3(0, 200, -100), scene)

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero())

    // This attaches the camera to the canvas
    camera.attachControl(this.canvas, true)

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight(
      'light',
      new Vector3(0.25, 0.25, 0.25),
      scene,
    )

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7

    // new Entry({ x: -5, z: -5 }, scene)
    // new Exit({ x: 5, z: 5 }, scene)
    // new Monster({ x: -5, z: 5 }, scene)

    new DungeonGenerator('dungeon', scene)

    // Our built-in 'ground' shape.
    scene.debugLayer.show()
    engine.runRenderLoop(function () {
      if (scene && scene.activeCamera) {
        scene.render()
      }
    })
    // return scene;
  }
}
