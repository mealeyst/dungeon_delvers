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

const party = [
  new Actor(
    'test',
    {
      [ATTRIBUTES.CON]: new Constitution(14),
      [ATTRIBUTES.DEX]: new Dexterity(16),
      [ATTRIBUTES.INT]: new Intellect(9),
      [ATTRIBUTES.MIG]: new Might(11),
      [ATTRIBUTES.PER]: new Perception(15),
      [ATTRIBUTES.RES]: new Resolve(10),
    },
    {
      accuracy: 46, // 47
      deflection: 37, // 37
      fortitude: 41, // 42
      health: 117, // 118
      reflex: 53, // 54
      willpower: 30, // 30
    },
    require('../../../public/assets/images/portraits/male/male_human_b2_lg.png'),
  ),
]

export default () => {
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
