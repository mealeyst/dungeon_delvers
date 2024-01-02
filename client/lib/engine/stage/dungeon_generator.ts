import {
  Color3,
  InspectableType,
  MeshBuilder,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from '@babylonjs/core'
import { Container } from '../stage/container'
import { Room } from '../../content/stage/room'
import { random } from '../core/random'
import { BinarySpacePartition } from '../core/binarySpacePartition'
import triangulate from 'delaunay-triangulate'
import { Prim } from './prim'
import { TreeNode } from './tree_node'

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
  private _mapLevels = 1
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

  generateRoom({ depth, width, x, y, z }: Container) {
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
    const room = new Room({
      name: `room_${this._rooms.length}`,
      x: x + randomizedX,
      y: y,
      z: z + randomizedZ,
      depth: randomizedDepth,
      height: this._mapLevelHeight,
      width: randomizedWidth,
    })
    const material = new StandardMaterial(`${name}_material`, this._scene)
    material.backFaceCulling = false
    const roomMesh = MeshBuilder.CreateBox(
      room.name,
      {
        depth: room.depth,
        height: room.height,
        width: room.width,
      },
      this._scene,
    )
    roomMesh.position.x = room.x
    roomMesh.position.y = room.y
    roomMesh.position.z = room.z
    roomMesh.parent = this
    material.diffuseColor = new Color3(1, 0, 0)
    roomMesh.material = material
  }

  generateCorridor(branch_a: Container, branch_b: Container) {
    const line = MeshBuilder.CreateLines(
      `min_spanning_tree`,
      {
        points: Array.from([
          new Vector3(branch_a.x, branch_a.y, branch_a.z),
          new Vector3(branch_b.x, branch_b.y, branch_b.z),
        ]),
      },
      this._scene,
    )
    line.color = new Color3(0, 1, 0)
    line.parent = this

    const material = new StandardMaterial('container_marterial', this._scene)
    material.diffuseColor = Color3.Random()
    material.wireframe = true
    const container_a = MeshBuilder.CreateBox(
      'corridor',
      {
        depth: branch_a.depth,
        height: branch_a.height,
        width: branch_a.width,
      },
      this._scene,
    )
    container_a.position.x = branch_a.x
    container_a.position.y = branch_a.y
    container_a.position.z = branch_a.z
    container_a.parent = this
    container_a.material = material
    const container_b = MeshBuilder.CreateBox(
      'corridor',
      {
        depth: branch_b.depth,
        height: branch_b.height,
        width: branch_b.width,
      },
      this._scene,
    )
    container_b.position.x = branch_b.x
    container_b.position.y = branch_b.y
    container_b.position.z = branch_b.z
    container_b.parent = this
    container_b.material = material
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
      leafOperation: this.generateRoom.bind(this),
      branchesOperation: this.generateCorridor.bind(this),
    })

    // const material = new StandardMaterial('container_marterial', this._scene)
    // material.wireframe = true
  }
}
