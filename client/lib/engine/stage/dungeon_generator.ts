import {
  InspectableType,
  MeshBuilder,
  Scene,
  SceneInstrumentation,
  ScenePerformancePriority,
  StandardMaterial,
  TransformNode,
} from '@babylonjs/core'
import { AdvancedDynamicTexture, Control, TextBlock } from '@babylonjs/gui'
import { Rooms, isRoomKey } from '../../content/stage'
import { Room } from '../../content/stage/room'
import { random, randomChoice } from '../core/random'
import { Container } from './container'
import Delaunator from 'delaunator'
import { Triangle } from '../core/triangle'
import { BinarySpacePartition } from './binary_space_partition'

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
  private _iterations = 20
  private _mapHeight = 200
  private _mapDepth = 500
  private _mapWidth = 500
  private _minRoomSize = 50
  private _gutter = 20
  private _tick = 0
  _rooms: DungeonRooms[] = []
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
        label: 'Map Length',
        propertyName: 'mapLength',
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
        max: 50,
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

  set mapLength(value: number) {
    this._mapDepth = value
  }

  get mapLength() {
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
    const bsp = new BinarySpacePartition({
      iterations: this._iterations,
      mapHeight: this._mapHeight,
      mapDepth: this._mapDepth,
      mapWidth: this._mapWidth,
      minSize: this._minRoomSize,
    })
    // const material = new StandardMaterial('wireframe', this._scene)
    // material.wireframe = true
    bsp.leaves?.forEach(({ depth, height, width, x, y, z }, index) => {
      const room = MeshBuilder.CreateBox(
        `room_${index}`,
        {
          depth: depth - this._gutter / 2,
          height: height - this._gutter / 2,
          width: width - this._gutter / 2,
        },
        this._scene,
      )
      // room.material = material
      room.position.x = x + this._gutter / 2
      room.position.y = y + this._gutter / 2
      room.position.z = z + this._gutter / 2
      room.parent = this
    })
    // const availableRooms = Object.keys(Rooms).reduce<
    //   Record<keyof typeof Rooms, { count: number }>
    // >((acc: any, key) => {
    //   if (isRoomKey(Rooms, key)) {
    //     acc[key] = {
    //       count: 0,
    //     }
    //   }
    //   return acc
    // }, {} as Record<keyof typeof Rooms, { count: number }>)
    // this._tree.leaves.forEach((leaf, index) => {
    //   const randomRoomKey = randomChoice(
    //     Object.keys(availableRooms),
    //   ) as keyof typeof Rooms
    //   const room = new Rooms[randomRoomKey](
    //     {
    //       name: index,
    //       x: leaf.x,
    //       z: leaf.y,
    //       length:
    //         leaf.length < leaf.width * 0.6
    //           ? random(leaf.length * 0.4, leaf.length * 0.6)
    //           : leaf.width,
    //       width:
    //         leaf.width < leaf.length * 0.6
    //           ? random(leaf.width * 0.4, leaf.width * 0.6)
    //           : leaf.length,
    //     },
    //     this._scene,
    //   )
    //   availableRooms[randomRoomKey].count++
    //   if (
    //     room.roomCountLimit &&
    //     room.roomCountLimit === availableRooms[randomRoomKey].count
    //   ) {
    //     delete availableRooms[randomRoomKey]
    //   }
    //   room.parent = this
    //   this._rooms.push({
    //     id: randomRoomKey,
    //     room,
    //     reached: false,
    //     neighbors: [],
    //   })
    // })
  }
  // generateLines() {
  //   const roomOrigins = this._rooms.reduce<[number, number][]>(
  //     (acc, { room }) => {
  //       const { x, z } = room
  //       acc.push([x, z])
  //       return acc
  //     },
  //     [],
  //   )
  //   const delauney = Delaunator.from(roomOrigins)
  //   console.log(roomOrigins, delauney)
  //   for (var i = 0; i < delauney.triangles.length; i += 3) {
  //     var p0 = delauney.triangles[i]
  //     var p1 = delauney.triangles[i + 1]
  //     var p2 = delauney.triangles[i + 2]
  //     const neighbor1 = this._rooms.find(({ room }) => {
  //       return room.x === roomOrigins[p1][0] && room.z === roomOrigins[p1][1]
  //     })
  //     const neighbor2 = this._rooms.find(({ room }) => {
  //       return room.x === roomOrigins[p2][0] && room.z === roomOrigins[p2][1]
  //     })
  //     const room = this._rooms.find(({ room }) => {
  //       return room.x === roomOrigins[p0][0] && room.z === roomOrigins[p0][1]
  //     })

  //     room && room.neighbors && neighbor1 && room.neighbors.push(neighbor1.id)
  //     room && room.neighbors && neighbor2 && room.neighbors.push(neighbor2.id)
  //     console.log(room)
  //     const vectors = [
  //       new Vector3(roomOrigins[p0][0], 0, roomOrigins[p0][1]),
  //       new Vector3(roomOrigins[p1][0], 0, roomOrigins[p1][1]),
  //       new Vector3(roomOrigins[p2][0], 0, roomOrigins[p2][1]),
  //     ]
  //     const triangle = new Triangle({ id: i / 3, vectors }, this._scene)
  //     triangle.parent = this
  //   }
  // }
}
