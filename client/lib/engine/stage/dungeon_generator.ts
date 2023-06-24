import {
  GroundMesh,
  InspectableType,
  MeshBuilder,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from '@babylonjs/core'
import { Rooms, isRoomKey } from '../../content/stage'
import { Room } from '../../content/stage/room'
import { random, randomChoice } from '../core/random'
import { Container } from './container'
import { Direction, TreeNode } from './tree_node'
import Delaunator from 'delaunator'
import { Triangle } from '../core/triangle'

type DungeonArgs = {
  corridorWidth?: number
  gutter?: number
  iterations?: number
  length?: number
  minSize?: number
  ratio?: number
  retries?: number
  width?: number
}

export class DungeonGenerator extends TransformNode {
  _corridorWidth: number
  _gutter: number
  _iterations: number
  _length: number
  _minSize: number
  _ratio: number
  _retries: number
  _scene: Scene
  _transparentMaterial: StandardMaterial
  _tree?: TreeNode<Container>
  _width: number
  _rooms: Room[] = []
  public inspectableCustomProperties: any
  constructor(name = 'dungeon', scene: Scene, options?: DungeonArgs) {
    super(name, scene)
    const defaultArgs = {
      corridorWidth: 2,
      gutter: 1,
      iterations: 3,
      length: 250,
      minSize: 8,
      ratio: 0.35,
      retries: 20,
      tileWidth: 16,
      width: 300,
    }
    this._corridorWidth = options?.corridorWidth || defaultArgs.corridorWidth
    this._gutter = options?.gutter || defaultArgs.gutter
    this._iterations = options?.iterations || defaultArgs.iterations
    this._length = options?.length || defaultArgs.length
    this._minSize = options?.minSize || defaultArgs.minSize
    this._ratio = options?.ratio || defaultArgs.ratio
    this._retries = options?.retries || defaultArgs.retries
    this._scene = scene
    this._width = options?.width || defaultArgs.width
    this._transparentMaterial = new StandardMaterial(
      'transparentMaterial',
      scene,
    )
    this._transparentMaterial.alpha = 0
    this.generateRooms()
    this.inspectableCustomProperties = [
      {
        label: 'Dungeon Options',
        propertyName: 'dungeon',
        type: InspectableType.Tab,
      },
      {
        label: 'Width',
        propertyName: 'width',
        type: InspectableType.Slider,
        min: 30,
        max: 500,
        step: 1,
      },
      {
        label: 'Length',
        propertyName: 'length',
        type: InspectableType.Slider,
        min: 30,
        max: 500,
        step: 1,
      },
      {
        label: 'Iterations',
        propertyName: 'iterations',
        type: InspectableType.Slider,
        min: 3,
        max: 10,
        step: 1,
      },
      {
        label: 'Retries',
        propertyName: 'retries',
        type: InspectableType.Slider,
        min: 8,
        max: 100,
        step: 1,
      },
      {
        label: 'Container Size Ratio',
        propertyName: 'ratio',
        type: InspectableType.Slider,
        min: 0.05,
        max: 1,
        step: 0.05,
      },
      {
        label: 'Corridor Width',
        propertyName: 'corridorWidth',
        type: InspectableType.Slider,
        min: 1,
        max: 4,
        step: 1,
      },
      {
        label: 'Tile Width',
        propertyName: 'tileWidth',
        type: InspectableType.Slider,
        min: 1,
        max: 4,
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

  set corridorWidth(value: number) {
    this._corridorWidth = value
  }

  get corridorWidth() {
    return this._corridorWidth
  }

  set iterations(value: number) {
    this._iterations = value
  }

  get iterations() {
    return this._iterations
  }

  set length(value: number) {
    this._length = value
  }

  get length() {
    return this._length
  }

  set ratio(value: number) {
    this._ratio = value
  }

  get ratio() {
    return this._ratio
  }

  set width(value: number) {
    this._width = value
  }

  get width() {
    return this._width
  }

  createTree(iterations: number): TreeNode<Container> {
    return this.generateTree(
      new Container(0, 0, 0, this._width, this._length),
      iterations,
    )
  }

  generateTree(container: Container, iterations: number): TreeNode<Container> {
    const node = new TreeNode<Container>(container)
    if (
      iterations !== 0 &&
      node._leaf.width > this._minSize * 2 &&
      node._leaf.length > this._minSize * 2
    ) {
      // We still need to divide the container
      const [left, right] = this.splitContainer(container, this._retries)
      if (left && right) {
        node._left = this.generateTree(left, iterations - 1)
        node._right = this.generateTree(right, iterations - 1)
      }
    }
    return node
  }

  splitContainer(
    container: Container,
    retries: number,
  ): [Container, Container] | [null, null] {
    let left: Container
    let right: Container
    // We tried too many times tos split the container without success
    if (retries === 0) {
      return [null, null]
    }

    // Generate a random direction to split the container
    const direction = randomChoice<Direction>(['horizontal', 'vertical'])
    if (direction === 'vertical') {
      // Vertical
      left = new Container(
        container.x,
        container.y,
        container.z,
        container.width * 0.5,
        container.length,
      )
      right = new Container(
        container.x + container.width,
        container.y,
        container.z,
        container.width - left.width,
        container.length,
      )
      // Retry splitting the container if it's not large enough
      const leftWidthRatio = left.width / left.length
      const rightWidthRatio = right.width / right.length
      if (leftWidthRatio < this._ratio || rightWidthRatio < this._ratio) {
        // Decrement amount retires;
        return this.splitContainer(container, retries - 1)
      }
    } else {
      // Horizontal
      left = new Container(
        container.x,
        container.y,
        container.z,
        container.width,
        container.length * 0.5,
      )
      right = new Container(
        container.x,
        container.y + left.length,
        container.z,
        container.width,
        container.length - left.length,
      )

      // Retry splitting the container if it's not high enough
      const leftLengthRatio = left.length / left.width
      const rightLengthRatio = right.length / right.width
      if (leftLengthRatio < this._ratio || rightLengthRatio < this._ratio) {
        // Decrement amount of iterations
        return this.splitContainer(container, retries - 1)
      }
    }

    return [left, right]
  }
  generateRooms() {
    const iterations = this._iterations
    this._tree = this.createTree(iterations)
    const availableRooms = Object.keys(Rooms).reduce<
      Record<keyof typeof Rooms, { count: number }>
    >((acc: any, key) => {
      if (isRoomKey(Rooms, key)) {
        acc[key] = {
          count: 0,
        }
      }
      return acc
    }, {} as Record<keyof typeof Rooms, { count: number }>)
    this._tree.leaves.forEach((leaf, index) => {
      const randomRoomKey = randomChoice(
        Object.keys(availableRooms),
      ) as keyof typeof Rooms
      const room = new Rooms[randomRoomKey](
        {
          name: index,
          x: leaf.x,
          z: leaf.y,
          length: random(leaf.length * 0.4, leaf.length * 0.6),
          width: random(leaf.width * 0.4, leaf.width * 0.6),
        },
        this._scene,
      )
      availableRooms[randomRoomKey].count++
      if (
        room.roomCountLimit &&
        room.roomCountLimit === availableRooms[randomRoomKey].count
      ) {
        delete availableRooms[randomRoomKey]
      }
      room.parent = this
      this._rooms.push(room)
    })
    this.generateLines()
  }
  generateLines() {
    const roomOrigins = this._rooms.reduce<[number, number][]>((acc, room) => {
      const { x, z } = room
      acc.push([x, z])
      return acc
    }, [])
    const { triangles } = Delaunator.from(roomOrigins)
    for (var i = 0; i < triangles.length; i += 3) {
      var p0 = triangles[i]
      var p1 = triangles[i + 1]
      var p2 = triangles[i + 2]
      const points = [
        new Vector3(roomOrigins[p0][0], 0, roomOrigins[p0][1]),
        new Vector3(roomOrigins[p1][0], 0, roomOrigins[p1][1]),
        new Vector3(roomOrigins[p2][0], 0, roomOrigins[p2][1]),
        new Vector3(roomOrigins[p0][0], 0, roomOrigins[p0][1]),
      ]
      const triangle = new Triangle({ id: i / 3, points: points }, this._scene)
      triangle.parent = this
    }
  }
}
