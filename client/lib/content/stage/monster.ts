import { Color3, Scene } from '@babylonjs/core'
import { Room, RoomProps } from './room'

export class Monster extends Room {
  constructor(args: RoomProps, scene: Scene) {
    super(
      {
        ...args,
        color: new Color3(1, 0.65, 0),
        type: 'monster',
      },
      scene,
    )
  }
}
