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
import { Button, Control, Grid, StackPanel } from '@babylonjs/gui'
import Characters from '../../../public/assets/models/characters.glb'
import CharacterCreateScene from '../../../public/assets/models/character_create_scene.glb'

type Character = {
  mesh: AbstractMesh
  animations: Record<string, AnimationGroup>
}

type CharacterCreationSettings = Character & {
  cameraRadius: number
}

type Characters = {
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
  private _characters: Characters
  private _selectedRace: 'dwarf' | 'goblin' | 'human' | 'orc'
  private _selectedGender: 'm' | 'f'
  constructor(engine: Engine, scene: Scene) {
    const menuId = 'character_select'
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
    const attributeStackPanel = new StackPanel(`${menuId}__attribute_stack`)
    attributeStackPanel.adaptWidthToChildren = true
    attributeStackPanel.addControl(raceGrid)
    attributeStackPanel.addControl(genderGrid)
    attributeStackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
    attributeStackPanel.height = '100%'
    attributeStackPanel.background = 'black'
    attributeStackPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT

    super(
      engine,
      [attributeStackPanel],
      menuId,
      new Color4(0.18, 0.09, 0.2),
      scene,
    )
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
    const characters_result = await SceneLoader.ImportMeshAsync(
      null,
      '',
      Characters,
      this.scene,
    )
    characters_result.meshes[0].position = new Vector3(0, 0.85, 0)
    this._characters = {
      f_dwarf: {
        mesh: characters_result.meshes[8],
        animations: {
          idle: characters_result.animationGroups[21],
          run: characters_result.animationGroups[22],
          walk: characters_result.animationGroups[23],
        },
        cameraRadius: 3,
      },
      f_goblin: {
        mesh: characters_result.meshes[2],
        animations: {
          idle: characters_result.animationGroups[3],
          run: characters_result.animationGroups[4],
          walk: characters_result.animationGroups[5],
        },
        cameraRadius: 3,
      },
      f_human: {
        mesh: characters_result.meshes[1],
        animations: {
          idle: characters_result.animationGroups[0],
          run: characters_result.animationGroups[1],
          walk: characters_result.animationGroups[2],
        },
        cameraRadius: 6,
      },
      f_orc: {
        mesh: characters_result.meshes[3],
        animations: {
          idle: characters_result.animationGroups[6],
          run: characters_result.animationGroups[7],
          walk: characters_result.animationGroups[8],
        },
        cameraRadius: 6,
      },
      m_dwarf: {
        mesh: characters_result.meshes[5],
        animations: {
          idle: characters_result.animationGroups[12],
          run: characters_result.animationGroups[13],
          walk: characters_result.animationGroups[14],
        },
        cameraRadius: 3,
      },
      m_goblin: {
        mesh: characters_result.meshes[6],
        animations: {
          idle: characters_result.animationGroups[15],
          run: characters_result.animationGroups[16],
          walk: characters_result.animationGroups[17],
        },
        cameraRadius: 3,
      },
      m_human: {
        mesh: characters_result.meshes[7],
        animations: {
          idle: characters_result.animationGroups[18],
          run: characters_result.animationGroups[19],
          walk: characters_result.animationGroups[20],
        },
        cameraRadius: 6,
      },
      m_orc: {
        mesh: characters_result.meshes[4],
        animations: {
          idle: characters_result.animationGroups[9],
          run: characters_result.animationGroups[10],
          walk: characters_result.animationGroups[11],
        },
        cameraRadius: 6,
      },
    }
    this._selectedGender = 'm'
    this._selectedRace = 'human'
    this._setModelVisibility()
    this.camera.radius = 6
    this.camera.heightOffset = 2
    this.camera.fov = 1
    this.camera.lockedTarget = characters_result.meshes[0]
    let alpha = 0
    this.scene.registerBeforeRender(() => {
      alpha += 0.05
      this.camera.rotationOffset = (18 * alpha) % 360
    })
  }

  private _setModelVisibility() {
    let character: keyof typeof this._characters
    for (character in this._characters) {
      if (character !== `${this._selectedGender}_${this._selectedRace}`) {
        this._characters[character].mesh.isVisible = false
      } else {
        this._characters[character].mesh.isVisible = true
        this._characters[character].animations.idle.play(true)
        this.camera.radius = this._characters[character].cameraRadius
      }
    }
  }

  private _setGender(gender: 'm' | 'f') {
    this._selectedGender = gender
    this._setModelVisibility()
  }

  private _setRace(race: 'dwarf' | 'goblin' | 'human' | 'orc') {
    this._selectedRace = race
    this._setModelVisibility()
  }
}
