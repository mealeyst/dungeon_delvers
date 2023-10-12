import * as GUI from '@babylonjs/gui'
import male_portraits from '../../../public/images/portraits/male/*.png'
import female_portraits from '../../../public/images/portraits/female/*.png'

const portraits = { ...male_portraits, ...female_portraits }

type Character = {
  name: string
  health_max: number
  health_current: number
  image: string
}

const party = [
  {
    name: 'Elfman',
    health_max: 10,
    health_current: 10,
    image: 'male_elf_jn_lg.png',
  },
]

const characterButton = async (character: Character) => {
  const button = GUI.Button.CreateImageButton(
    'character_button',
    character.name,
    portraits[character.image],
  )
  button.width = '100px'
  button.height = '120px'
  button.paddingLeft = '10px'
  button.paddingRight = '10px'
  if (button.image) {
    button.image.width = '80px'
  }
  return button
}

export default () => {
  console.log('GUI')
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')
  const panel = new GUI.StackPanel()
  panel.isVertical = false
  panel.paddingLeft = '10px'
  panel.paddingRight = '10px'
  party.forEach(async character => {
    const button = await characterButton(character)
    panel.addControl(button)
  })
  panel.adaptHeightToChildren = true
  panel.adaptWidthToChildren = true
  panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
  panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
  advancedTexture.addControl(panel)
}
