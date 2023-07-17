import { random, randomChoice } from '../core/random'
import { Container } from './container'
import { TreeNode, Axis } from './tree_node'

type SplitResult = {
  branch_a: Container
  branch_b: Container
}

export class BinarySpacePartition {
  private _tree = TreeNode<Container>
  private _minSize = 10
  private _mapLength = 500
  private _mapWidth = 500
  private _mapHeight = 500
  private _iterations = 30
  private _tree: TreeNode<Container>

  constructor() {
    this.initializeTree()
  }

  initializeTree() {
    const container = new Container(
      0,
      0,
      0,
      this._mapWidth,
      this._mapHeight,
      this._mapLength,
    )
    this._tree = this.generateTree(container, this._iterations)
  }
  generateTree(container: Container, iterations: number): TreeNode<Container> {
    if (
      iterations !== 0 &&
      node._leaf.width > this._minSize * 2 &&
      node._leaf.height > this._minSize * 2 &&
      node._leaf.length > this._minSize * 2
    ) {
      const direction = this.getRandomDirection()
      const { branch_a, branch_b } = this.split(node._leaf, direction)
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
          container.length,
        )
        branch_b = new Container(
          container.x + splitWidth,
          container.y,
          container.z,
          container.width - splitWidth,
          container.height,
          container.length,
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
          container.length,
        )
        branch_b = new Container(
          container.x,
          container.y + splitHeight,
          container.z,
          container.width,
          container.height - splitHeight,
          container.length,
        )
        break
      case 'z':
        const splitLength = Math.floor(container.length / 2)
        branch_a = new Container(
          container.x,
          container.y,
          container.z,
          container.width,
          container.height,
          splitLength,
        )
        branch_b = new Container(
          container.x,
          container.y,
          container.z + splitLength,
          container.width,
          container.height,
          container.length - splitLength,
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
