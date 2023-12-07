import {
  AbstractMesh,
  AnimationGroup,
  ISceneLoaderAsyncResult,
  Scene,
  SceneLoader,
} from '@babylonjs/core'
import Characters from '../../../public/assets/models/characters.glb'

export type CharacterProps = {
  mesh: AbstractMesh
  animations: Record<string, AnimationGroup>
}

export type CharacterModelsProps = {
  f_dwarf: CharacterProps
  f_goblin: CharacterProps
  f_human: CharacterProps
  f_orc: CharacterProps
  m_dwarf: CharacterProps
  m_goblin: CharacterProps
  m_human: CharacterProps
  m_orc: CharacterProps
}

export class CharacterModels {
  private _characters: CharacterModelsProps
  private __root__: AbstractMesh
  constructor(data: ISceneLoaderAsyncResult) {
    this.__root__ = data.meshes[0]
    this.__root__.name = 'characters'
    this._characters = {
      f_dwarf: {
        mesh: data.meshes[8],
        animations: {
          idle: data.animationGroups[25],
          run: data.animationGroups[26],
          walk: data.animationGroups[27],
        },
      },
      f_goblin: {
        mesh: data.meshes[2],
        animations: {
          idle: data.animationGroups[3],
          run: data.animationGroups[4],
          walk: data.animationGroups[5],
        },
      },
      f_human: {
        mesh: data.meshes[1],
        animations: {
          idle: data.animationGroups[0],
          run: data.animationGroups[1],
          walk: data.animationGroups[2],
        },
      },
      f_orc: {
        mesh: data.meshes[3],
        animations: {
          idle: data.animationGroups[6],
          run: data.animationGroups[7],
          walk: data.animationGroups[8],
        },
      },
      m_dwarf: {
        mesh: data.meshes[5],
        animations: {
          idle: data.animationGroups[12],
          run: data.animationGroups[13],
          walk: data.animationGroups[14],
        },
      },
      m_goblin: {
        mesh: data.meshes[6],
        animations: {
          idle: data.animationGroups[15],
          run: data.animationGroups[16],
          walk: data.animationGroups[17],
        },
      },
      m_human: {
        mesh: data.meshes[7],
        animations: {
          idle: data.animationGroups[19],
          run: data.animationGroups[19],
          walk: data.animationGroups[20],
          combat_idle: data.animationGroups[18],
        },
      },
      m_orc: {
        mesh: data.meshes[4],
        animations: {
          idle: data.animationGroups[9],
          run: data.animationGroups[10],
          walk: data.animationGroups[11],
        },
      },
    }
  }
  public static async loadCharacterMeshes(
    scene: Scene,
  ): Promise<CharacterModels> {
    const characters_result = await SceneLoader.ImportMeshAsync(
      null,
      '',
      Characters,
      scene,
    )
    return new CharacterModels(characters_result)
  }
  get root() {
    return this.__root__
  }
  get characters() {
    return this._characters
  }
  mesh(key: keyof CharacterModelsProps) {
    return this._characters[key].mesh
  }
  animations(key: keyof CharacterModelsProps) {
    return this._characters[key].animations
  }
}
