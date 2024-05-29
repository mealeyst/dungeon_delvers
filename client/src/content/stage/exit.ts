import { Color3, Scene } from '@babylonjs/core'
import { Room, RoomProps } from './room'

export class Exit extends Room {
  constructor(args: RoomProps, scene: Scene) {
    super(
      {
        ...args,
        color: new Color3(1, 0, 0),
        type: 'exit',
        roomCountLimit: 1,
      },
      scene,
    )
  }
}
