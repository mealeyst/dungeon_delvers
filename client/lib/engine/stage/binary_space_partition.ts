import { random, randomChoice } from '../core/random'
import { Container } from './container'
import { TreeNode, Axis, Branch } from './tree_node'

type SplitResult = {
  branch_a: Container
  branch_b: Container
}

type BinarySpacePartitionArgs = {
  iterations?: number
  mapHeight?: number
  mapDepth?: number
  mapWidth?: number
  minSize?: number
}

export class BinarySpacePartition {
  private _iterations = 10
  private _mapHeight = 500
  private _mapDepth = 500
  private _mapWidth = 500
  private _minSize = 10
  private _tree?: TreeNode<Container>

  constructor(args?: BinarySpacePartitionArgs) {
    if (args) {
      const {
        iterations,
        mapHeight,
        mapDepth: mapLength,
        mapWidth,
        minSize,
      } = args
      this._iterations = iterations ?? this._iterations
      this._mapHeight = mapHeight ?? this._mapHeight
      this._mapDepth = mapLength ?? this._mapDepth
      this._mapWidth = mapWidth ?? this._mapWidth
      this._minSize = minSize ?? this._minSize
    }

    this.initializeTree()
  }

  get leaves() {
    return this._tree?.leaves
  }

  initializeTree() {
    const container = new Container(
      0,
      0,
      0,
      this._mapWidth,
      this._mapHeight,
      this._mapDepth,
    )
    this._tree = this.generateTree(container, this._iterations, 'root')
  }

  generateTree(
    container: Container,
    iterations: number,
    branch?: Branch,
    prevDirection?: Axis,
  ): TreeNode<Container> {
    const node = new TreeNode<Container>(
      container,
      this._iterations - iterations,
      branch,
    )
    const sizeBuffer = this._minSize * 2
    if (
      iterations !== 0 &&
      node._node.width > sizeBuffer &&
      node._node.height > sizeBuffer &&
      node._node.depth > sizeBuffer
    ) {
      const direction = this.getRandomDirection(prevDirection)
      const { branch_a, branch_b } = this.split(
        node._node,
        iterations,
        direction,
      )
      node._branch_a = this.generateTree(
        branch_a,
        iterations - 1,
        'a',
        direction,
      )
      node._branch_b = this.generateTree(
        branch_b,
        iterations - 1,
        'b',
        direction,
      )
    }
    return node
  }

  split(
    container: Container,
    iterations: number,
    direction: Axis,
  ): SplitResult {
    let branch_a: Container
    let branch_b: Container
    const percentage = random(40, 60) / 100
    switch (direction) {
      default:
        const splitWidth = container.width * percentage
        branch_a = new Container(
          container.x + -(container.width - splitWidth) / 2,
          container.y,
          container.z,
          splitWidth,
          container.height,
          container.depth,
        )
        branch_b = new Container(
          container.x + splitWidth / 2,
          container.y,
          container.z,
          container.width - splitWidth,
          container.height,
          container.depth,
        )
        break
      case 'y':
        const splitHeight = container.height * percentage
        branch_a = new Container(
          container.x,
          container.y + -(container.height - splitHeight) / 2,
          container.z,
          container.width,
          splitHeight,
          container.depth,
        )
        branch_b = new Container(
          container.x,
          container.y + splitHeight / 2,
          container.z,
          container.width,
          container.height - splitHeight,
          container.depth,
        )
        break
      case 'z':
        const splitDepth = container.depth * percentage
        branch_a = new Container(
          container.x,
          container.y,
          container.z + -(container.depth - splitDepth) / 2,
          container.width,
          container.height,
          splitDepth,
        )
        branch_b = new Container(
          container.x,
          container.y,
          container.z + splitDepth / 2,
          container.width,
          container.height,
          container.depth - splitDepth,
        )
        break
    }
    return {
      branch_a,
      branch_b,
    }
  }

  getRandomDirection(prevDirection?: Axis): Axis {
    const directions = ['x', 'y', 'z'] as Axis[]
    prevDirection && directions.splice(directions.indexOf(prevDirection), 1)
    return randomChoice<Axis>(directions)
  }
}
