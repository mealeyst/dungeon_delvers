import { Color4, Engine, Scene, SceneLoader } from '@babylonjs/core'
import { FullScreenMenu } from './fullScreenMenu'
import { Button, TextBlock, InputText, InputPassword } from '@babylonjs/gui'
import dungeonEntrance from '../../../public/assets/models/Main_Menu_Background.glb'

type MainMenuActions = {
  onNewGame: () => void
  onOptions: () => void
  onQuitGame: () => void
}

export class MainMenu extends FullScreenMenu {
  constructor(canvas: HTMLCanvasElement, engine: Engine, scene: Scene, action: () => Promise<void>) {
    const menuId = 'main_menu'
    super(canvas, engine, menuId, new Color4(0.67, 0.47, 0.16), scene)
    const title = new TextBlock(`${menuId}__title`, 'Dungeon Delvers')
    title.fontSize = 48
    title.width = '500px'
    title.color = 'white'
    title.paddingBottom = '80px'
    const usernameLabel = new TextBlock(
      `${menuId}__username_label`,
      'Username:',
    )
    const username = new InputText()
    username.width = '500px'
    const passwordLabel = new TextBlock(
      `${menuId}__password_label`,
      'Password:',
    )
    const password = new InputPassword()
    password.width = '500px'
    const login = Button.CreateSimpleButton(`${menuId}__login`, 'Login')
    login.width = '500px'
    login.onPointerDownObservable.add(() => {
      action()
    })
    const controls = [
      title,
      usernameLabel,
      username,
      passwordLabel,
      password,
      login,
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
