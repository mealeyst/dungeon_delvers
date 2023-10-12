import * as GUI from '@babylonjs/gui'

type Character = {
  name: string
  health_max: number
  health_current: number
  image: string
}

const party = [
  {
    name: 'Jack Hooman',
    health_max: 20,
    health_current: 18,
    image: require('../../../public/images/portraits/male/male_human_b2_lg.png'),
  },
  {
    name: 'Jane Hooman',
    health_max: 16,
    health_current: 10,
    image: require('../../../public/images/portraits/female/female_human_04_ocean_deathplate_lg.png'),
  },
  {
    name: 'Orlan-do Bloom',
    health_max: 10,
    health_current: 3,
    image: require('../../../public/images/portraits/male/male_human_bjorn4_lg.png'),
  },
]

const characterButton = async (character: Character) => {
  const button = GUI.Button.CreateImageButton(
    'character_button',
    character.name,
    character.image,
  )
  button.width = '100px'
  button.height = '120px'
  button.paddingLeft = '10px'
  button.paddingRight = '10px'
  button.color = '#40bbc1'
  button.thickness = 2

  button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
  if (button.image) {
    button.image.width = '100%'
  }
  const healthBackground = new GUI.Rectangle('health_background')
  healthBackground.width = '8px'
  healthBackground.height = '100%'
  healthBackground.color = 'transparent'
  healthBackground.background = '#333333'
  healthBackground.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
  healthBackground.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
  button.addControl(healthBackground)
  const healthValue = new GUI.Rectangle('health_value')
  healthValue.width = '8px'
  healthValue.height = `${
    118 * (character.health_current / character.health_max)
  }px`
  healthValue.color = 'transparent'
  healthValue.background = `rgb(
      ${255 - 255 * (character.health_current / character.health_max)},
      ${255 * (character.health_current / character.health_max)},
      0
    )`
  healthValue.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
  healthValue.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
  button.addControl(healthValue)
  return button
}

export default () => {
  console.log('GUI')
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')
  const panel = new GUI.StackPanel()
  panel.isVertical = false
  panel.paddingLeft = '10px'
  panel.paddingRight = '10px'
  panel.paddingBottom = '10px'
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
