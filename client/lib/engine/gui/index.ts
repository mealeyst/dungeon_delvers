import * as GUI from '@babylonjs/gui'
import { Actor } from '../core/actor'
import {
  ATTRIBUTES,
  Constitution,
  Dexterity,
  Intellect,
  Might,
  Perception,
  Resolve,
} from '../core/attribute'
import { characterPortrait } from './character/characterPortrait'

export default (party: Actor[]) => {
  console.log('GUI')
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')
  const panel = new GUI.StackPanel()
  panel.isVertical = false
  panel.paddingLeft = '10px'
  panel.paddingRight = '10px'
  panel.paddingBottom = '10px'
  panel.adaptHeightToChildren = true
  panel.adaptWidthToChildren = true
  panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
  panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
  party.forEach(character => {
    const portrait = characterPortrait(character)
    panel.addControl(portrait)
  })
  advancedTexture.addControl(panel)
}
