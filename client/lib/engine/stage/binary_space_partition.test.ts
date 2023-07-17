import { BinarySpacePartition } from './binary_space_partition'
describe('BinarySpacePartition', () => {
  it('should generate a BSP tree', () => {
    const args = {
      iterations: 10,
      mapHeight: 250,
      mapLength: 500,
      mapWidth: 500,
      minSize: 50,
    }
    const bsp = new BinarySpacePartition(args)
    expect(typeof bsp.leaves).toBe('object')
    console.log(bsp.leaves?.length)
    bsp.leaves?.forEach(leaf => {
      expect(
        leaf.height < args.mapHeight ||
          leaf.depth < args.mapLength ||
          leaf.width < args.mapWidth,
      ).toBeTruthy()
    })
  })
})
