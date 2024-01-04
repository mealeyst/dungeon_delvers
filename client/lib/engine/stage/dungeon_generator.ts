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
  private _mapHeight = 30
  private _mapDepth = 200
  private _mapWidth = 200
  private _minRoomSize = 20
  private _minRoomHeight = 3
  private _gutter = 10
  private _rooms: Record<string, Room> = {}
  private _container: Container[] = []
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
        label: 'Map Height',
        propertyName: 'mapLevelHeight',
        type: InspectableType.Slider,
        min: 3,
        max: 100,
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

  generateRoom({ _x: x, _y: y, _z: z }: Container) {
    const randomizedWidth = random(
      this._minRoomSize * 0.5,
      this._minRoomSize * 0.8,
    )
    const randomizedDepth = random(
      this._minRoomSize * 0.5,
      this._minRoomSize * 0.8,
    )
    const room = new Room({
      name: `room_x${x}_y${y}_z${z}`,
      x,
      y,
      z,
      depth: randomizedDepth,
      height: this._minRoomHeight,
      width: randomizedWidth,
    })
    this._rooms[room.name] = room
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
    const point_a = new Vector3(branch_a._x, branch_a._y, branch_a._z)
    const point_b = new Vector3(branch_b._x, branch_b._y, branch_b._z)
    const room_a =
      this._rooms[`room_x${branch_a._x}_y${branch_a._y}_z${branch_a._z}`]
    const room_b =
      this._rooms[`room_x${branch_b._x}_y${branch_b._y}_z${branch_b._z}`]
    const rooms_depth =
      (room_a ? room_a.depth / 2 : 0) + (room_b ? room_b.depth / 2 : 0)

    const max = new Vector3()
    const min = new Vector3()
    min.x = Math.min(point_a.x, point_b.x)
    min.y = Math.min(point_a.y, point_b.y)
    min.z = Math.min(point_a.z, point_b.z)
    max.x = Math.max(point_a.x, point_b.x)
    max.y = Math.max(point_a.y, point_b.y)
    max.z = Math.max(point_a.z, point_b.z)
    const center = min.add(max.subtract(min).scale(0.5))
    const distance = Vector3.Distance(point_a, point_b) - rooms_depth

    const direction = point_a.subtract(point_b).normalize()
    const material = new StandardMaterial('corridor_material', this._scene)
    const corridorMesh = MeshBuilder.CreateBox(
      'corridor',
      {
        depth: !(direction.z === 0) ? distance : 3,
        height: !(direction.y === 0) ? distance : 3,
        width: !(direction.x === 0) ? distance : 3,
      },
      this._scene,
    )
    corridorMesh.position.x = center.x
    corridorMesh.position.y = center.y
    corridorMesh.position.z = center.z
    corridorMesh.parent = this
    material.diffuseColor = new Color3(0, 1, 0)
    corridorMesh.material = material
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
  }
}
