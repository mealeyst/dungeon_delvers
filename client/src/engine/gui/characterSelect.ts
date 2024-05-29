import { Color4, Engine, Scene, SceneLoader } from '@babylonjs/core'
import { FullScreenMenu } from './fullScreenMenu'
import { Button, TextBlock } from '@babylonjs/gui'
import dungeonEntrance from '../../../public/assets/models/Main_Menu_Background.glb'

export class CharacterSelect extends FullScreenMenu {
  constructor(canvas: HTMLCanvasElement, engine: Engine, scene: Scene, action: () => Promise<void>){
    const menuId = 'character_select'
    super(canvas, engine, menuId, new Color4(0.67, 0.47, 0.16), scene)
    const title = new TextBlock(`${menuId}__title`, 'Character Select')
    title.fontSize = 48
    title.width = '500px'
    title.color = 'white'
    title.paddingBottom = '80px'
    const character1 = Button.CreateSimpleButton(`${menuId}__character1`, 'Create a New Character')
    character1.width = '500px'
    character1.onPointerDownObservable.add(() => {
      action()
    })
    const controls = [
      title,
      character1,
    ]
    const buttonHeight = 60
    controls.forEach((control, index) => {
      control.height = `${buttonHeight}px`
      control.color = 'white'
      control.paddingTop = '10px'
      control.paddingBottom = '10px'
      // Evenly space controls vertically based on index
      control.top = `${index * buttonHeight}px`
    })
    controls.forEach(control => {
      this.menu.addControl(control)
    })

    this._renderSceneBackground()
  }

  private async _renderSceneBackground() {
    const result = await SceneLoader.ImportMeshAsync(
      null,
      '',
      dungeonEntrance,
      this.scene,
    )
    const mesh = result.meshes[0]
    this.camera.lockedTarget = mesh
  }
}