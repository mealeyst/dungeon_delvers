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
  minRoomHeight?: number
}

type DungeonRooms = {
  id: string
  room: Room
  neighbors?: string[]
  reached: boolean
}

export class DungeonGenerator extends TransformNode {
  private _iterations = 5
  private _mapHeight = 20
  private _mapDepth = 200
  private _mapWidth = 200
  private _minRoomSize = 20
  private _minRoomHeight = 3
  private _gutter = 10
  _rooms: Room[] = []
  public inspectableCustomProperties: any
  constructor(name = 'dungeon', scene: Scene, options?: DungeonArgs) {
    super(name, scene)
    this._scene = scene
    this._gutter = options?.gutter ?? this._gutter
    this._iterations = options?.iterations ?? this._iterations
    this._mapHeight = options?.mapHeight ?? this._mapHeight
    this._mapDepth = options?.mapDepth ?? this._mapDepth
    this._mapWidth = options?.mapWidth ?? this._mapWidth
    this._minRoomSize = options?.minRoomSize ?? this._minRoomSize
    this._minRoomHeight = options?.minRoomHeight ?? this._minRoomHeight
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
        label: 'Room Height',
        propertyName: 'minRoomHeight',
        type: InspectableType.Slider,
        min: 3,
        max: 5,
        step: 1,
      },
      {
        label: 'Generate Dungeon',
        propertyName: 'generate',
        type: InspectableType.Button,
        callback: async () => {
          this._rooms = []
          this.getChildren().forEach(child => child.dispose())
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

  set mapHeight(value: number) {
    this._mapHeight = value
  }

  get mapHeight() {
    return this._mapHeight
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

  set minRoomHeight(value: number) {
    this._minRoomHeight = value
  }

  get minRoomHeight() {
    return this._minRoomHeight
  }

  generateRoom({ x, y, z }: Container) {
    const randomizedWidth = random(
      this._minRoomSize * 0.5,
      this._minRoomSize * 0.8,
    )
    const randomizedDepth = random(
      this._minRoomSize * 0.5,
      this._minRoomSize * 0.8,
    )
    const room = new Room({
      name: `room_${this._rooms.length}`,
      x,
      y,
      z,
      depth: randomizedDepth,
      height: this._minRoomHeight,
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
    const line = MeshBuilder.CreateLines(
      `min_spanning_tree`,
      {
        points: Array.from([
          new Vector3(x, y, z),
          new Vector3(room.x, room.y, room.z),
        ]),
      },
      this._scene,
    )
    line.color = new Color3(0, 1, 0)
    line.parent = this
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
  }

  generateRooms() {
    console.log('Generating Dungeon')
    let bsp = new BinarySpacePartition({
      iterations: this._iterations,
      height: this._mapHeight,
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
