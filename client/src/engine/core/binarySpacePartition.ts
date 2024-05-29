import { random, randomChoice } from './random'
import { Container } from '../stage/container'
import { TreeNode, Axis, Branch } from '../stage/tree_node'

type SplitResult = {
  branch_a: Container
  branch_b: Container
}

type BinarySpacePartitionArgs = {
  iterations?: number
  height?: number
  levels?: number
  depth?: number
  width?: number
  minRoomSize?: number
  leafOperation?: (container: Container) => void
  branchesOperation?: (branch_a: Container, branch_b: Container) => void
}

export class BinarySpacePartition {
  private _iterations = 5
  private _branchesOperation?: (
    branch_a: Container,
    branch_b: Container,
  ) => void = () => {}
  private _leafOperation?: (container: Container) => void = () => {}
  private _mapDepth = 140
  private _mapLevelHeight = 2.5
  private _mapLevels = 1
  private _mapWidth = 140
  private _minSize = 10
  private _trees?: TreeNode<Container>[] = []

  constructor(args?: BinarySpacePartitionArgs) {
    this._iterations = args?.iterations ?? this._iterations
    this._mapDepth = args?.depth ?? this._mapDepth
    this._mapLevelHeight = args?.height ?? this._mapLevelHeight
    this._mapLevels = args?.levels ?? this._mapLevels
    this._mapWidth = args?.width ?? this._mapWidth
    this._minSize = args?.minRoomSize ?? this._minSize
    this._leafOperation = args?.leafOperation
    this._branchesOperation = args?.branchesOperation
    this.initializeTree()
  }

  get leaves() {
    return this._trees?.map(tree => tree?.leaves)
  }

  get trees() {
    return this._trees
  }

  get levelHeight() {
    return this._mapLevelHeight
  }

  initializeTree() {
    const container = new Container(
      0,
      0,
      0,
      this._mapWidth,
      this._mapLevelHeight,
      this._mapDepth,
    )
    this.generateTree(container, this._iterations, 'root')
  }

  generateTree(
    container: Container,
    iterations: number,
    branch?: Branch,
  ): TreeNode<Container> {
    const node = new TreeNode<Container>(
      container,
      this._iterations - iterations,
      branch,
    )
    const sizeBuffer = this._minSize * 2
    if (
      iterations !== 0 &&
      node._node._width > sizeBuffer &&
      node._node._depth > sizeBuffer
    ) {
      const direction = this.getRandomDirection()
      const { branch_a, branch_b } = this.split(node._node, direction)
      node._branch_a = this.generateTree(branch_a, iterations - 1, 'a')
      node._branch_b = this.generateTree(branch_b, iterations - 1, 'b')
      this._branchesOperation &&
        this._branchesOperation(node._branch_a._node, node._branch_b._node)
    } else {
      this._leafOperation && this._leafOperation(node._node)
    }
    return node
  }

  split(container: Container, direction: Axis): SplitResult {
    let branch_a: Container
    let branch_b: Container
    const percentage = random(40, 60) / 100

    switch (direction) {
      default:
        const splitWidth = container._width * percentage
        branch_a = new Container(
          container._x + -(container._width - splitWidth) / 2,
          container._y,
          container._z,
          splitWidth,
          container._height,
          container._depth,
        )
        branch_b = new Container(
          container._x + splitWidth / 2,
          container._y,
          container._z,
          container._width - splitWidth,
          container._height,
          container._depth,
        )
        break
      case 'y':
        const splitHeight = container._height * percentage
        branch_a = new Container(
          container._x,
          container._y + -(container._height - splitHeight) / 2,
          container._z,
          container._width,
          splitHeight,
          container._depth,
        )
        branch_b = new Container(
          container._x,
          container._y + splitHeight / 2,
          container._z,
          container._width,
          container._height - splitHeight,
          container._depth,
        )
        break
      case 'z':
        const splitDepth = container._depth * percentage
        branch_a = new Container(
          container._x,
          container._y,
          container._z + -(container._depth - splitDepth) / 2,
          container._width,
          container._height,
          splitDepth,
        )
        branch_b = new Container(
          container._x,
          container._y,
          container._z + splitDepth / 2,
          container._width,
          container._height,
          container._depth - splitDepth,
        )
        break
    }

    return {
      branch_a,
      branch_b,
    }
  }

  getRandomDirection(): Axis {
    const directions = ['x', 'y', 'z'] as Axis[]
    return randomChoice<Axis>(directions)
  }
}
