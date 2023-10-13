import * as GUI from '@babylonjs/gui'
import { Actor } from '../../core/actor'

const healthBar = (character: Actor) => {
  const healthBackground = new GUI.Rectangle('health_background')
  healthBackground.width = '8px'
  healthBackground.height = '100%'
  healthBackground.color = 'transparent'
  healthBackground.background = '#333333'
  healthBackground.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
  healthBackground.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
  const healthValue = new GUI.Rectangle('health_value')
  healthValue.width = '8px'
  healthValue.height = `${
    100 * Math.floor(character.health.current / character.health.max)
  }%`
  healthValue.color = 'transparent'
  healthValue.background = `rgb(
    ${255 - 255 * Math.floor(character.health.current / character.health.max)},
    ${255 * Math.floor(character.health.current / character.health.max)},
    0
  )`
  healthValue.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
  healthValue.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
  healthBackground.addControl(healthValue)
  return healthBackground
}

const healthText = (character: Actor) => {
  const healthText = new GUI.TextBlock(
    'health_text',
    `${character.health.current}/${character.health.max}`,
  )
  healthText.color = '#ffffff'
  healthText.fontSize = 12
  healthText.shadowBlur = 1
  healthText.shadowColor = '#000000'
  healthText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
  healthText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
  healthText.paddingRight = '10px'
  return healthText
}

export const characterPortrait = (character: Actor) => {
  const button = GUI.Button.CreateImageOnlyButton(
    'character_button',
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
  button.addControl(healthBar(character))
  button.addControl(healthText(character))
  return button
}
