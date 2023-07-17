export type Direction = 'horizontal' | 'vertical'
export type Axis = 'x' | 'y' | 'z'

export class TreeNode<T> {
  _branch_a?: TreeNode<T>
  _branch_b?: TreeNode<T>
  _leaf: T

  constructor(data: T) {
    this._leaf = data
  }

  split(data: T, direction: Direction): void {

  /**
   * This function works to get the bottom most leaves.
   */
  get leaves(): T[] {
    const result: T[] = []

    if (this._branch_a && this._branch_b) {
      result.push(...this._branch_a.leaves, ...this._branch_b.leaves)
    } else {
      result.push(this._leaf)
    }
    return result
  }
}
