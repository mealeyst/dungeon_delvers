import {
  AbstractMesh,
  AnimationGroup,
  Color4,
  Engine,
  Scene,
  SceneLoader,
  Vector3,
} from '@babylonjs/core'
import { FullScreenMenu } from './fullScreenMenu'
import {
  Button,
  Control,
  Grid,
  InputText,
  StackPanel,
  TextBlock,
} from '@babylonjs/gui'
import CharacterCreateScene from '../../../public/assets/models/character_create_scene.glb'
import { RaceType, Races } from '../../content/race'
import { ATTRIBUTES } from '../core/attribute'
import { CharacterModels, CharacterProps } from '../race/race'

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

export class CharacterSelect extends FullScreenMenu {
  private _characters: CharactersCreationSettings
  private _selectedRace: RaceType
  private _selectedGender: 'm' | 'f'
  private _races = new Races()
  private _descriptionText: TextBlock
  constructor(canvas: HTMLCanvasElement, engine: Engine, scene: Scene) {
    const menuId = 'character_select'
    super(canvas, engine, menuId, new Color4(0.18, 0.09, 0.2), scene)
    const characterNameLabel = new TextBlock(
      `${menuId}__character_name`,
      'Character Name:',
    )
    characterNameLabel.color = 'white'
    characterNameLabel.height = '40px'

    const characterNameInput = new InputText(`${menuId}__character_name_input`)
    characterNameInput.width = '400px'
    characterNameInput.height = '40px'
    characterNameInput.color = 'white'
    const humanButton = Button.CreateSimpleButton(`${menuId}__human`, 'Human')
    const dwarfButton = Button.CreateSimpleButton(`${menuId}__dwarf`, 'Dwarf')
    const goblinButton = Button.CreateSimpleButton(
      `${menuId}__goblin`,
      'Goblin',
    )
    const orcButton = Button.CreateSimpleButton(`${menuId}__orc`, 'Orc')
    const maleButton = Button.CreateSimpleButton(`${menuId}__male`, 'Male')
    const femaleButton = Button.CreateSimpleButton(
      `${menuId}__female`,
      'Female',
    )
    maleButton.onPointerDownObservable.add(() => {
      this._setGender('m')
    })
    femaleButton.onPointerDownObservable.add(() => {
      this._setGender('f')
    })
    const buttons = [
      humanButton,
      dwarfButton,
      goblinButton,
      orcButton,
      maleButton,
      femaleButton,
    ]
    humanButton.onPointerDownObservable.add(() => {
      this._setRace('human')
    })
    dwarfButton.onPointerDownObservable.add(() => {
      this._setRace('dwarf')
    })
    goblinButton.onPointerDownObservable.add(() => {
      this._setRace('goblin')
    })
    orcButton.onPointerDownObservable.add(() => {
      this._setRace('orc')
    })
    const raceGrid = new Grid(`${menuId}__race_grid`)
    raceGrid.width = '500px'
    raceGrid.height = '200px'
    raceGrid.addColumnDefinition(0.5)
    raceGrid.addColumnDefinition(0.5)
    raceGrid.addRowDefinition(0.5)
    raceGrid.addRowDefinition(0.5)
    raceGrid.addControl(humanButton, 0, 0)
    raceGrid.addControl(dwarfButton, 0, 1)
    raceGrid.addControl(goblinButton, 1, 0)
    raceGrid.addControl(orcButton, 1, 1)
    raceGrid.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
    const genderGrid = new Grid(`${menuId}__gender_grid`)
    genderGrid.addColumnDefinition(0.5)
    genderGrid.addColumnDefinition(0.5)
    genderGrid.width = '500px'
    genderGrid.height = '60px'
    genderGrid.addControl(maleButton, 0, 0)
    genderGrid.addControl(femaleButton, 0, 1)
    genderGrid.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
    genderGrid.addControl
    buttons.forEach((control, index) => {
      control.color = 'white'
      control.paddingTop = '10px'
      control.paddingBottom = '10px'
      control.paddingLeft = '10px'
      control.paddingRight = '10px'

      // Evenly space controls vertically based on index
    })
    const characterPanel = new StackPanel(`${menuId}__character_stack`)
    characterPanel.adaptWidthToChildren = true
    this._descriptionText = new TextBlock(`${menuId}__race_description`, '')
    this._descriptionText.color = 'white'
    this._descriptionText.width = '400px'
    this._descriptionText.fontSize = 16
    this._descriptionText.textWrapping = true
    this._descriptionText.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
    characterPanel.addControl(this._descriptionText)
    characterPanel.addControl(characterNameLabel)
    characterPanel.addControl(characterNameInput)
    characterPanel.addControl(raceGrid)
    characterPanel.addControl(genderGrid)

    characterPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
    characterPanel.height = '100%'
    characterPanel.background = 'black'
    characterPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
    this.menu.addControl(characterPanel)
    const attributesPanel = new StackPanel(`${menuId}__attribute_stack`)
    attributesPanel.height = '100%'
    attributesPanel.width = '200px'
    attributesPanel.background = 'black'
    attributesPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT

    for (const attribute in ATTRIBUTES) {
      const attributePanel = new StackPanel(`${menuId}__${attribute}_stack`)
      const attributeValueGrid = new Grid(
        `${menuId}__attribute_${attribute}_grid`,
      )
      attributeValueGrid.width = '160px'
      attributeValueGrid.height = '40px'
      attributeValueGrid.addColumnDefinition(0.33)
      attributeValueGrid.addColumnDefinition(0.33)
      attributeValueGrid.addColumnDefinition(0.33)
      const attributeLabel = new TextBlock(
        `${menuId}__attribute_${attribute}`,
        ATTRIBUTES[attribute as keyof typeof ATTRIBUTES],
      )
      const attributeValue = new TextBlock(
        `${menuId}__attribute_${attribute}_value`,
        '10',
      )
      attributeValue.color = 'white'
      attributeLabel.color = 'white'
      attributeLabel.height = '40px'
      attributePanel.addControl(attributeLabel)
      attributeValueGrid.addControl(attributeValue, 1, 1)
      const attributeMinusButton = Button.CreateSimpleButton(
        `${menuId}__${attribute}_minus`,
        '-',
      )
      const attributePlusButton = Button.CreateSimpleButton(
        `${menuId}__${attribute}_plus`,
        '+',
      )
      attributeMinusButton.onPointerDownObservable.add(() => {
        console.log('minus')
      })
      attributePlusButton.onPointerDownObservable.add(() => {
        console.log('plus')
      })
      attributeMinusButton.color = 'white'
      attributePlusButton.color = 'white'
      attributeValueGrid.addControl(attributeMinusButton, 0, 0)
      attributeValueGrid.addControl(attributePlusButton, 0, 2)
      attributePanel.addControl(attributeValueGrid)
      attributePanel.paddingBottom = '20px'
      attributesPanel.addControl(attributePanel)
    }
    this.menu.addControl(attributesPanel)
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
    // this.scene.registerBeforeRender(() => {
    //   alpha += 0.025
    //   this.camera.rotationOffset = (18 * alpha) % 360
    // })
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

  private _setRace(race: RaceType) {
    this._selectedRace = race
    this._descriptionText.text = this._races.description(race)
    this._setModelVisibility()
  }
}
