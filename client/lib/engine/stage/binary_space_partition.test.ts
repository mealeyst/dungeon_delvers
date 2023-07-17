import { BinarySpacePartition } from './binary_space_partition'
describe('BinarySpacePartition', () => {
  it('should generate a BSP tree', () => {
    const bsp = new BinarySpacePartition()
    expect(bsp.hasOwnProperty('leaves')).toBe(true)
  })
})
