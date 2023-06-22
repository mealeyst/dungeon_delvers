export type Direction = 'horizontal' | 'vertical'

export class TreeNode<T> {
  _left?: TreeNode<T>
  _right?: TreeNode<T>
  _leaf: T

  constructor(data: T) {
    this._leaf = data
  }

  /**
   * This function works to get the bottom most leaves.
   */
  get leaves(): T[] {
    const result: T[] = []

    if (this._left && this._right) {
      result.push(...this._left.leaves, ...this._right.leaves)
    } else {
      result.push(this._leaf)
    }
    return result
  }
}
