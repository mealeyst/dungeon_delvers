export type Axis = 'x' | 'y' | 'z'
export type Branch = 'a' | 'b' | 'root'
export type Leaf<T> = {
  depth: number
  branch: Branch
  node: T
}
export type DepthCounter = {
  [key: number]: number
}

export class TreeNode<T> {
  _branch: Branch
  _branch_a?: TreeNode<T>
  _branch_b?: TreeNode<T>
  _node: T
  _depth: number = 0

  constructor(data: T, depth: number = 0, branch: Branch = 'root') {
    this._node = data
    this._depth = depth
    this._branch = branch
  }

  /**
   * This function works to get the bottom most leaves.
   */
  get leaves(): Leaf<T>[] {
    const results: Leaf<T>[] = []
    if (this._branch_a && this._branch_b) {
      results.push(...this._branch_a.leaves, ...this._branch_b.leaves)
    } else {
      results.push({
        branch: this._branch,
        depth: this._depth,
        node: this._node,
      })
    }
    return results
  }
}
