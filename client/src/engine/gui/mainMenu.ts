import { Color3, Color4, Engine, Scene, SceneLoader, Animation } from '@babylonjs/core'
import { FullScreenMenu } from './fullScreenMenu'
import { Button, TextBlock, InputText, InputPassword } from '@babylonjs/gui'
import dungeonEntrance from '../../../public/assets/models/Main_Menu_Background.glb'

type MainMenuActions = {
  onNewGame: () => void
  onOptions: () => void
  onQuitGame: () => void
}

export class Login extends FullScreenMenu {
  constructor(canvas: HTMLCanvasElement, engine: Engine, scene: Scene, action: () => Promise<void>) {
    const menuId = 'main_menu'
    super(canvas, engine, menuId, new Color4(0.67, 0.47, 0.16), scene)
    const title = new TextBlock(`${menuId}__title`, 'Dungeon Delvers')
    const colors = {
      white: new Color3(1, 1, 1),
      red: new Color3(1, 0, 0)
    }
    title.fontSize = 48
    title.width = '500px'
    title.color = '#ffffff'
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
    login.onPointerDownObservable.add(async () => {
      const login = async () => {
        const response = await fetch('http://localhost:4000/login', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username.text,
            password: password.text
          })
        })
        if (response.status === 200) {
          return response.json()

        } else {
          controls.forEach((control) => {
            control.color = colors.red.toHexString()
          })
        }
      }
      login().then((data) => {
        if (data) {
          const { token } = data;
          localStorage.setItem('token', token);
          action()
        }
      })
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
      control.color = colors.white.toHexString()
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
