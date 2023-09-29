import { AdvancedDynamicTexture, Button, Control } from '@babylonjs/gui'
export class MainMenu {
  private advancedTexture: AdvancedDynamicTexture
  constructor() {
    this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI')
    const buttonsData = [
      {
        id: 'new_game_button',
        text: 'New Game',
        action: () => alert('New Game Started'),
      },
      {
        id: 'options_button',
        text: 'Options',
        action: () => alert('Options'),
      },
      {
        id: 'quit_game_button',
        text: 'Quit Game',
        action: () => alert('Quit the game'),
      },
    ]
    buttonsData.forEach((buttonData, index) => {
      const buttonHeight = 60
      const button = Button.CreateSimpleButton(buttonData.id, buttonData.text)
      button.width = '150px'
      button.height = `${buttonHeight}px`
      button.color = 'white'
      button.paddingTop = '10px'
      button.paddingBottom = '10px'
      // Evenly space buttons vertically based on index
      button.top = `${index * buttonHeight}px`
      button.onPointerUpObservable.add(buttonData.action)
      this.advancedTexture.addControl(button)
    })
  }
}
