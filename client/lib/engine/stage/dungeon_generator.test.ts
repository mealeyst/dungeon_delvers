import { NullEngine, Scene } from '@babylonjs/core'
import { DungeonGenerator } from './dungeon_generator'

describe('Dungeon Generator', () => {
  let generator: DungeonGenerator
  beforeEach(() => {
    const scene = new Scene(new NullEngine())
    generator = new DungeonGenerator('dungeon', scene)
  })
  describe('splitContainer', () => {
    it(' should split the container until we hit the minimum size', () => {
      console.log(generator)
      expect(typeof generator.splitContainer).toBe('function')
    })
  })
})
