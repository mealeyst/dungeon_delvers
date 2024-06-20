import {
  Color3,
  GroundMesh,
  InspectableType,
  Mesh,
  MeshBuilder,
  NoiseProceduralTexture,
  Scene,
  StandardMaterial,
} from '@babylonjs/core'

export class PerlinGround extends GroundMesh {
  public _scene: Scene
  private _ground: Mesh
  private _octaves: number = 3
  private _persistence: number = 1.0
  private _noiseTexture: NoiseProceduralTexture

  constructor(name: string, scene: Scene) {
    super(name, scene)
    this._scene = scene
    this._ground = MeshBuilder.CreateGround(
      'ground',
      { width: 100, height: 100 },
      scene,
    )
    this._noiseTexture = new NoiseProceduralTexture('perlin', 256, scene)
    this._noiseTexture.octaves = this._octaves
    this._noiseTexture.persistence = this._persistence
    this._ground.material = new StandardMaterial('groundMat', scene)
    this.inspectableCustomProperties = [
      {
        label: 'Ground Options',
        propertyName: 'options',
        type: InspectableType.Tab,
      },
      {
        label: 'Octaves',
        propertyName: 'octaves',
        type: InspectableType.Slider,
        min: 0,
        max: 8,
        step: 1,
      },
      {
        label: 'Persitence',
        propertyName: 'persistence',
        type: InspectableType.Slider,
        min: 0,
        max: 1,
        step: 0.1,
      },
    ]
  }
}
