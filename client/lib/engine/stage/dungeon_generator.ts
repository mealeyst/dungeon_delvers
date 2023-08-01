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
import { BinarySpacePartition } from './binary_space_partition'
import triangulate from 'delaunay-triangulate'
import { Prim } from './prim'

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
  private _iterations = 3
  private _mapHeight = 200
  private _mapDepth = 300
  private _mapWidth = 300
  private _minRoomSize = 40
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
        propertyName: 'mapHeight',
        type: InspectableType.Slider,
        min: 30,
        max: 500,
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

  generateRooms() {
    let bsp = new BinarySpacePartition({
      iterations: this._iterations,
      mapHeight: this._mapHeight,
      mapDepth: this._mapDepth,
      mapWidth: this._mapWidth,
      minSize: this._minRoomSize,
    })
    while (bsp.leaves && bsp.leaves.length < 5) {
      bsp = new BinarySpacePartition({
        iterations: this._iterations,
        mapHeight: this._mapHeight,
        mapDepth: this._mapDepth,
        mapWidth: this._mapWidth,
        minSize: this._minRoomSize,
      })
    }

    bsp.leaves?.forEach(
      (
        { branch, depth: leaf_depth, node: { depth, height, width, x, y, z } },
        index,
      ) => {
        this._rooms.push(
          new Room({
            name: `room_${index}_branch_${branch}_${leaf_depth}`,
            x,
            y,
            z,
            depth: (this._minRoomSize * random(50, 150)) / 100,
            height: this._minRoomSize,
            width: (this._minRoomSize * random(50, 150)) / 100,
          }),
        )
      },
    )
    this._rooms.forEach(room => {
      const { name, depth, height, width, x, y, z } = room
      const material = new StandardMaterial(`${name}_material`, this._scene)
      // material.wireframe = true
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
      ;(material.diffuseColor = new Color3(1, 0, 0)),
        (roomMesh.material = material)
    })
    const entrance = this._rooms.reduce((acc, room, index) => {
      acc = room.y > this._rooms[acc].y ? index : acc
      return acc
    }, 0)
    const cells = triangulate(this._rooms.map(room => [room.x, room.y, room.z]))

    // cells.forEach((cell: number[], i: number) => {
    //   const tetrahedron = [
    //     this._rooms[cell[0]].center(),
    //     this._rooms[cell[1]].center(),
    //     this._rooms[cell[2]].center(),
    //     this._rooms[cell[3]].center(),
    //   ]
    //   const line = MeshBuilder.CreateLines(
    //     `line_${i}`,
    //     { points: tetrahedron },
    //     this._scene,
    //   )
    //   line.parent = this
    // })
    const prim = new Prim(this._rooms, entrance)
    const lines = MeshBuilder.CreateLines(
      `min_spanning_tree`,
      { points: Array.from(prim.tree) },
      this._scene,
    )
    lines.color = new Color3(0, 1, 0)
    lines.parent = this
  }
}
