import { Color3, Scene } from '@babylonjs/core'
import { Room, RoomProps } from './room'

export class Treasure extends Room {
  constructor(args: RoomProps, scene: Scene) {
    super(
      {
        ...args,
        color: new Color3(1, 1, 0),
        type: 'treasure',
        roomCountLimit: 1,
      },
      scene,
    )
  }
}
