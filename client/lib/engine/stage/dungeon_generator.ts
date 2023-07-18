import {
  Color3,
  InspectableType,
  MeshBuilder,
  Scene,
  SceneInstrumentation,
  ScenePerformancePriority,
  StandardMaterial,
  TransformNode,
  Vector3,
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
  private _iterations = 3
  private _mapHeight = 200
  private _mapDepth = 300
  private _mapWidth = 300
  private _minRoomSize = 40
  private _gutter = 10
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
        const room = MeshBuilder.CreateBox(
          `container${index}_branch_${branch}_depth_${leaf_depth}`,
          {
            depth: this._minRoomSize,
            height: this._minRoomSize,
            width: this._minRoomSize,
          },
          this._scene,
        )
        // room.material = material
        room.position.x = x
        room.position.y = y
        room.position.z = z
        room.parent = this
        const material = new StandardMaterial(
          `container${index}_material`,
          this._scene,
        )
        ;(material.diffuseColor = new Color3(
          random(1, 100) / 100,
          random(1, 100) / 100,
          random(1, 100) / 100,
        )),
          (room.material = material)
      },
    )
  }
}
