import * as GUI from '@babylonjs/gui'

type Character = {
  name: string
  health_max: number
  health_current: number
  image: string
}

const characterButton = (character: Character) => {
  const button = GUI.Button.CreateSimpleButton(
    'character_button',
    character.name,
  )
  button.width = '100px'
  button.height = '120px'
  button.image
}

export default () => {
  console.log('GUI')
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')
  const panel = new GUI.StackPanel()
  panel.paddingLeft = '10px'
  panel.paddingRight = '10px'
}
