export class Node<T> {
  adjacent: Node<T>[]
  data: T
  weight: number
  comparator: (a: T, b: T) => number

  constructor(data: T, comparator: (a: T, b: T) => number) {
    this.data = data
    this.comparator = comparator
    this.adjacent = []
  }

  addAdjacent(node: Node<T>) {
    this.adjacent.push(node)
  }

  removeAdjacent(data: T): Node<T> | null {
    const index = this.adjacent.findIndex(
      node => this.comparator(node.data, data) === 0,
    )

    if (index > -1) {
      return this.adjacent.splice(index, 1)[0]
    }

    return null
  }
}
