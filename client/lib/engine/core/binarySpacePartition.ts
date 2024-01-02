import { random, randomChoice } from './random'
import { Container } from '../stage/container'
import { TreeNode, Axis, Branch } from '../stage/tree_node'
import { Color3, MeshBuilder, Scene, StandardMaterial } from '@babylonjs/core'

type SplitResult = {
  branch_a: Container
  branch_b: Container
}

type BinarySpacePartitionArgs = {
  iterations?: number
  levelHeight?: number
  levels?: number
  depth?: number
  width?: number
  minRoomSize?: number
  scene?: Scene
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
    this._mapLevelHeight = args?.levelHeight ?? this._mapLevelHeight
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
    for (let level = this._mapLevels; level > 0; level--) {
      this._trees?.push(
        this.generateTree(container, this._iterations, level, 'root'),
      )
    }
  }

  generateTree(
    container: Container,
    iterations: number,
    level: number,
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
      node._node.width > sizeBuffer &&
      node._node.depth > sizeBuffer
    ) {
      const direction = this.getRandomDirection()
      const { branch_a, branch_b } = this.split(node._node, direction, level)
      node._branch_a = this.generateTree(branch_a, iterations - 1, level, 'a')
      node._branch_b = this.generateTree(branch_b, iterations - 1, level, 'b')
      this._branchesOperation &&
        this._branchesOperation(node._branch_a._node, node._branch_b._node)
    } else {
      this._leafOperation && this._leafOperation(node._node)
    }
    return node
  }

  split(container: Container, direction: Axis, level: number): SplitResult {
    let branch_a: Container
    let branch_b: Container
    const percentage = random(40, 60) / 100

    switch (direction) {
      default:
        const splitWidth = container.width * percentage
        branch_a = new Container(
          container.x + -(container.width - splitWidth) / 2,
          level * this._mapLevelHeight,
          container.z,
          splitWidth,
          container.height,
          container.depth,
        )
        branch_b = new Container(
          container.x + splitWidth / 2,
          level * this._mapLevelHeight,
          container.z,
          container.width - splitWidth,
          container.height,
          container.depth,
        )
        break
      case 'z':
        const splitDepth = container.depth * percentage
        branch_a = new Container(
          container.x,
          level * this._mapLevelHeight,
          container.z + -(container.depth - splitDepth) / 2,
          container.width,
          container.height,
          splitDepth,
        )
        branch_b = new Container(
          container.x,
          level * this._mapLevelHeight,
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

  getRandomDirection(): Axis {
    const directions = ['x', 'z'] as Axis[]
    return randomChoice<Axis>(directions)
  }
}