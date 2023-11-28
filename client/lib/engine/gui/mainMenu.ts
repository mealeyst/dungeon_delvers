import { Color4, Engine, Scene, SceneLoader } from '@babylonjs/core'
import { FullScreenMenu } from './fullScreenMenu'
import { Button, TextBlock } from '@babylonjs/gui'
import dungeonEntrance from '../../../public/assets/models/Main_Menu_Background.glb'

type MainMenuActions = {
  onNewGame: () => void
  onOptions: () => void
  onQuitGame: () => void
}

export class MainMenu extends FullScreenMenu {
  constructor(canvas: HTMLCanvasElement, engine: Engine, scene: Scene) {
    const menuId = 'main_menu'
    const title = new TextBlock(`${menuId}__title`, 'Dungeon Delvers')
    title.fontSize = 48
    title.width = '500px'
    title.color = 'white'
    title.paddingBottom = '80px'
    const newGame = Button.CreateSimpleButton(`${menuId}__new_game`, 'New Game')
    const options = Button.CreateSimpleButton(
      `${menuId}__game_options`,
      'Options',
    )
    const logout = Button.CreateSimpleButton(`${menuId}__logout`, 'Logout')

    const buttons = [newGame, options, logout]
    const controls = [title, ...buttons]
    super(canvas, engine, controls, menuId, new Color4(0.67, 0.47, 0.16), scene)
    newGame.onPointerDownObservable.add(() => {
      alert('New Game')
    })
    options.onPointerDownObservable.add(() => {
      alert('Options')
    })
    logout.onPointerDownObservable.add(() => {
      alert('Logout')
    })
    const buttonHeight = 60
    controls.forEach((control, index) => {
      control.height = `${buttonHeight}px`
      control.color = 'white'
      control.paddingTop = '10px'
      control.paddingBottom = '10px'
      // Evenly space controls vertically based on index
      control.top = `${index * buttonHeight}px`
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
