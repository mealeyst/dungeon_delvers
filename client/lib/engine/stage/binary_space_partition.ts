import { random, randomChoice } from '../core/random'
import { Container } from './container'
import { TreeNode, Axis } from './tree_node'

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
    this._tree = this.generateTree(container, this._iterations)
  }

  generateTree(container: Container, iterations: number): TreeNode<Container> {
    const node = new TreeNode<Container>(container)
    if (
      iterations !== 0 &&
      node._node.width > this._minSize * 2 &&
      node._node.height > this._minSize * 2 &&
      node._node.depth > this._minSize * 2
    ) {
      const direction = this.getRandomDirection()
      const { branch_a, branch_b } = this.split(node._node, direction)
      node._branch_a = this.generateTree(branch_a, iterations - 1)
      node._branch_b = this.generateTree(branch_b, iterations - 1)
    }
    return node
  }

  split(container: Container, direction: Axis): SplitResult {
    let branch_a: Container
    let branch_b: Container
    switch (direction) {
      default:
        const splitWidth = Math.floor(container.width / 2)
        branch_a = new Container(
          container.x,
          container.y,
          container.z,
          splitWidth,
          container.height,
          container.depth,
        )
        branch_b = new Container(
          container.x + splitWidth,
          container.y,
          container.z,
          container.width - splitWidth,
          container.height,
          container.depth,
        )
        break
      case 'y':
        const splitHeight = Math.floor(container.height / 2)
        branch_a = new Container(
          container.x,
          container.y,
          container.z,
          container.width,
          splitHeight,
          container.depth,
        )
        branch_b = new Container(
          container.x,
          container.y + splitHeight,
          container.z,
          container.width,
          container.height - splitHeight,
          container.depth,
        )
        break
      case 'z':
        const splitDepth = Math.floor(container.depth / 2)
        branch_a = new Container(
          container.x,
          container.y,
          container.z,
          container.width,
          container.height,
          splitDepth,
        )
        branch_b = new Container(
          container.x,
          container.y,
          container.z + splitDepth,
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

  getRandomDirection(): Axis {
    return randomChoice<Axis>(['x', 'y', 'z'])
  }
}
