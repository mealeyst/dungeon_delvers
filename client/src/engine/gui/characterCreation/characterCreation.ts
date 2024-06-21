import {
  AbstractMesh,
  AnimationGroup,
  Color4,
  Engine,
  Scene,
  SceneLoader,
  Vector3,
} from '@babylonjs/core'
import { FullScreenMenu } from '../fullScreenMenu'
import { Control, InputText, StackPanel, TextBlock } from '@babylonjs/gui'
import CharacterCreateScene from '../../../../public/assets/models/character_create_scene.glb'
import { RaceName, Races } from '../../core/races'
import { Attributes } from '../../core/attribute'
import { CharacterModels, CharacterProps } from '../../graphics/race/race'
import { raceSelect } from './raceSelect'
import { genderSelect } from './genderSelect'
import { AttributeSelect } from './attributeSelect'
import { uiButton } from './uiButton'

type CharacterCreationSettings = CharacterProps & {
  cameraRadius: number
  cameraHeightOffset: number
}

type CharactersCreationSettings = {
  f_dwarf: CharacterCreationSettings
  f_goblin: CharacterCreationSettings
  f_human: CharacterCreationSettings
  f_orc: CharacterCreationSettings
  m_dwarf: CharacterCreationSettings
  m_goblin: CharacterCreationSettings
  m_human: CharacterCreationSettings
  m_orc: CharacterCreationSettings
}

export class CharacterCreation extends FullScreenMenu {
  private _characters: CharactersCreationSettings
  private _selectedRace: RaceName
  private _selectedGender: 'm' | 'f'
  private _races = new Races()
  private _descriptionText: TextBlock
  private _attributes: Attributes
  private _attributesPanel?: AttributeSelect
  private _menuId: string
  private _autoRotate: boolean = false
  constructor(canvas: HTMLCanvasElement, engine: Engine, scene: Scene) {
    const menuId = 'character_select'
    super(canvas, engine, menuId, new Color4(0.18, 0.09, 0.2), scene)
    this._menuId = menuId
    const characterNameLabel = new TextBlock(
      `${this._menuId}__character_name`,
      'Character Name:',
    )
    characterNameLabel.color = 'white'
    characterNameLabel.height = '40px'

    const characterNameInput = new InputText(
      `${this._menuId}__character_name_input`,
    )
    characterNameInput.width = '400px'
    characterNameInput.height = '40px'
    characterNameInput.color = 'white'
    const raceGrid = raceSelect(this._menuId, (race: RaceName) =>
      this._setRace(race),
    )
    const genderGrid = genderSelect(this._menuId, (gender: 'm' | 'f') =>
      this._setGender(gender),
    )
    const characterPanel = new StackPanel(`${this._menuId}__character_stack`)
    characterPanel.adaptWidthToChildren = true
    this._descriptionText = new TextBlock(
      `${this._menuId}__race_description`,
      '',
    )
    this._descriptionText.color = 'white'
    this._descriptionText.width = '400px'
    this._descriptionText.height = '400px'
    this._descriptionText.fontSize = 16
    this._descriptionText.textWrapping = true
    this._descriptionText.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
    characterPanel.addControl(characterNameLabel)
    characterPanel.addControl(characterNameInput)
    characterPanel.addControl(raceGrid)
    characterPanel.addControl(genderGrid)
    characterPanel.addControl(this._descriptionText)

    characterPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
    characterPanel.height = '100%'
    characterPanel.background = 'black'
    characterPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
    this.menu.addControl(characterPanel)
    const autoRotateButton = uiButton(`${this._menuId}__auto_rotate`, '↺')
    autoRotateButton.onPointerDownObservable.add(() => {
      this._autoRotate = !this._autoRotate
    })
    autoRotateButton.background = 'black'
    autoRotateButton.width = '40px'
    autoRotateButton.height = '40px'
    autoRotateButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
    autoRotateButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
    this.menu.addControl(autoRotateButton)
    this._renderSceneCharacters()
  }

  private async _renderSceneCharacters() {
    const characterSelectScene = await SceneLoader.ImportMeshAsync(
      null,
      '',
      CharacterCreateScene,
      this.scene,
    )
    characterSelectScene.lights.forEach(light => {
      light.intensity = 0.5
    })
    const result = await CharacterModels.loadCharacterMeshes(this.scene)
    this._characters = Object.entries(result.characters).reduce(
      (accumulator, [key, value]) => {
        const characterSelectData = value as CharacterCreationSettings
        switch (key) {
          case 'f_dwarf':
          case 'f_goblin':
          case 'm_dwarf':
          case 'm_goblin':
            characterSelectData.cameraRadius = 3
            characterSelectData.cameraHeightOffset = 1
            break
          case 'f_human':
          case 'f_orc':
          case 'm_human':
          case 'm_orc':
            characterSelectData.cameraRadius = 6
            characterSelectData.cameraHeightOffset = 1.5
            break
        }
        accumulator[key as keyof CharactersCreationSettings] =
          characterSelectData
        return accumulator
      },
      {} as CharactersCreationSettings,
    )
    result.root.position = new Vector3(0, 0.85, 0)
    this._selectedGender = 'm'
    this._selectedRace = 'human'
    this._descriptionText.text = this._races.description(this._selectedRace)
    this._attributes = this._races.attributes(this._selectedRace)
    this._setModelVisibility()
    this.camera.radius = 6
    this.camera.heightOffset = 2
    this.camera.fov = 1
    this.camera.lockedTarget = result.root
    this.camera.upperRadiusLimit = 6
    this.camera.lowerRadiusLimit = 3
    this.camera.upperHeightOffsetLimit = 2
    this.camera.lowerHeightOffsetLimit = 1
    this.camera.maxCameraSpeed = 1
    let alpha = 0
    this._attributesPanel = new AttributeSelect(this._menuId, this._attributes)
    this._attributesPanel &&
      this.menu.addControl(this._attributesPanel.attributesPanel)
    this.scene.registerBeforeRender(() => {
      if (this._autoRotate) {
        alpha += 0.025
        this.camera.rotationOffset = (18 * alpha) % 360
      } else {
        this.camera.rotationOffset = 0
      }
    })
    this.camera.attachControl(true)
  }

  private _setModelVisibility() {
    let character: keyof typeof this._characters
    for (character in this._characters) {
      if (character !== `${this._selectedGender}_${this._selectedRace}`) {
        this._characters[character].mesh.isVisible = false
        this._characters[character].animations.idle.stop()
      } else {
        this._characters[character].mesh.isVisible = true
        this._characters[character].animations.idle.play(true)
        this.camera.radius = this._characters[character].cameraRadius
        this.camera.heightOffset =
          this._characters[character].cameraHeightOffset
      }
    }
  }

  private _setGender(gender: 'm' | 'f') {
    this._selectedGender = gender
    this._setModelVisibility()
  }

  private _setRace(race: RaceName) {
    this._selectedRace = race
    this._descriptionText.text = this._races.description(race)
    const attibutes = this._races.attributes(race)
    this._attributesPanel && this._attributesPanel.updateAttributes(attibutes)
    this._setModelVisibility()
  }
}
