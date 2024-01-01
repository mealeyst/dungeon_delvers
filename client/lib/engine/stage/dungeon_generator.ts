import {
  Color3,
  InspectableType,
  MeshBuilder,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from '@babylonjs/core'
import { Room } from '../../content/stage/room'
import { random } from '../core/random'
import { BinarySpacePartition } from '../core/binarySpacePartition'
import triangulate from 'delaunay-triangulate'
import { Prim } from './prim'
import { Container } from '@babylonjs/gui'

type DungeonArgs = {
  gutter?: number
  iterations?: number
  mapHeight?: number
  mapDepth?: number
  mapWidth?: number
  minRoomSize?: number
}

type DungeonRooms = {
  id: string
  room: Room
  neighbors?: string[]
  reached: boolean
}

export class DungeonGenerator extends TransformNode {
  private _iterations = 6
  private _mapLevels = 3
  private _mapLevelHeight = 3
  private _mapDepth = 140
  private _mapWidth = 140
  private _minRoomSize = 20
  private _gutter = 10
  _rooms: Room[] = []
  public inspectableCustomProperties: any
  constructor(name = 'dungeon', scene: Scene, options?: DungeonArgs) {
    super(name, scene)
    this._scene = scene
    this._gutter = options?.gutter ?? this._gutter
    this._iterations = options?.iterations ?? this._iterations
    this._mapLevels = options?.mapHeight ?? this._mapLevels
    this._mapLevelHeight = options?.mapHeight ?? this._mapLevelHeight
    this._mapDepth = options?.mapDepth ?? this._mapDepth
    this._mapWidth = options?.mapWidth ?? this._mapWidth
    this._minRoomSize = options?.minRoomSize ?? this._minRoomSize
    this._scene = scene
    this.generateRooms()
    this.inspectableCustomProperties = [
      {
        label: 'Dungeon Options',
        propertyName: 'dungeon',
        type: InspectableType.Tab,
      },
      {
        label: 'Gutter Size',
        propertyName: 'gutter',
        type: InspectableType.Slider,
        min: 5,
        max: 50,
        step: 1,
      },
      {
        label: 'Iterations',
        propertyName: 'iterations',
        type: InspectableType.Slider,
        min: 1,
        max: 50,
        step: 1,
      },
      {
        label: 'Map Levels',
        propertyName: 'mapLevels',
        type: InspectableType.Slider,
        min: 1,
        max: 5,
        step: 1,
      },
      {
        label: 'Map Level Height',
        propertyName: 'mapLevelHeight',
        type: InspectableType.Slider,
        min: 2.5,
        max: 8,
        step: 1,
      },
      {
        label: 'Map Depth',
        propertyName: 'mapDepth',
        type: InspectableType.Slider,
        min: 30,
        max: 500,
        step: 1,
      },
      {
        label: 'Map Width',
        propertyName: 'mapWidth',
        type: InspectableType.Slider,
        min: 30,
        max: 500,
        step: 1,
      },
      {
        label: 'Room Size',
        propertyName: 'minRoomSize',
        type: InspectableType.Slider,
        min: 5,
        max: 100,
        step: 1,
      },
      {
        label: 'Generate Dungeon',
        propertyName: 'generate',
        type: InspectableType.Button,
        callback: async () => {
          this._rooms = []
          this.getChildren().forEach(child => child.dispose())
          this._scene.materials.forEach(material => material.dispose())
          this.generateRooms()
        },
      },
    ]
  }

  set gutter(value: number) {
    this._gutter = value
  }

  get gutter() {
    return this._gutter
  }

  set iterations(value: number) {
    this._iterations = value
  }

  get iterations() {
    return this._iterations
  }

  set mapLevels(value: number) {
    this._mapLevels = value
  }

  get mapLevels() {
    return this._mapLevels
  }

  set mapLevelHeight(value: number) {
    this._mapLevelHeight = value
  }

  get mapLevelHeight() {
    return this._mapLevelHeight
  }

  set mapDepth(value: number) {
    this._mapDepth = value
  }

  get mapDepth() {
    return this._mapDepth
  }

  set mapWidth(value: number) {
    this._mapWidth = value
  }

  get mapWidth() {
    return this._mapWidth
  }

  set minRoomSize(value: number) {
    this._minRoomSize = value
  }

  get minRoomSize() {
    return this._minRoomSize
  }

  generateRooms() {
    console.log('Generating Dungeon')
    let bsp = new BinarySpacePartition({
      iterations: this._iterations,
      levels: this._mapLevels,
      levelHeight: this._mapLevelHeight,
      depth: this._mapDepth,
      width: this._mapWidth,
      minRoomSize: this._minRoomSize,
    })
    bsp.leaves &&
      bsp.leaves.forEach((level, level_index) => {
        level.forEach(
          (
            {
              branch,
              depth: leaf_depth,
              node: { depth, height, width, x, y, z },
            },
            index,
          ) => {
            const randomizedWidth = random(
              this._minRoomSize * 0.5,
              this._minRoomSize * 1,
            )
            const randomizedX = random(
              -width / 2 + this._gutter,
              width / 2 - this._gutter,
            )
            const randomizedDepth = random(
              this._minRoomSize * 0.5,
              this._minRoomSize * 1,
            )
            const randomizedZ = random(
              -depth / 2 + this._gutter,
              depth / 2 - this._gutter,
            )

            this._rooms.push(
              new Room({
                name: `room_${index}_branch_${branch}_${leaf_depth}`,
                x: x + randomizedX,
                y: this._mapLevelHeight * level_index,
                z: z + randomizedZ,
                depth: randomizedDepth,
                height: this._mapLevelHeight,
                width: randomizedWidth,
              }),
            )
          },
        )
      })
    this._rooms.forEach(room => {
      const { name, depth, height, width, x, y, z } = room
      const material = new StandardMaterial(`${name}_material`, this._scene)
      material.backFaceCulling = false
      const roomMesh = MeshBuilder.CreateBox(
        room.name,
        {
          depth,
          height,
          width,
        },
        this._scene,
      )
      roomMesh.position.x = x
      roomMesh.position.y = y
      roomMesh.position.z = z
      roomMesh.parent = this
      material.diffuseColor = new Color3(1, 0, 0)
      roomMesh.material = material
    })
    const entrance = this._rooms.reduce((acc, room, index) => {
      acc = room.y > this._rooms[acc].y ? index : acc
      return acc
    }, 0)

    const prim = new Prim(this._rooms, entrance)
    const lines = MeshBuilder.CreateLines(
      `min_spanning_tree`,
      { points: Array.from(prim.tree) },
      this._scene,
    )
    lines.color = new Color3(0, 1, 0)
    lines.parent = this

    const material = new StandardMaterial('container_marterial', this._scene)
    material.wireframe = true
  }
}
