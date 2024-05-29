import { Color3, Scene } from '@babylonjs/core'
import { Room, RoomProps } from './room'

export class Entry extends Room {
  public limit: number = 1
  constructor(args: RoomProps, scene: Scene) {
    super(
      {
        ...args,
        color: new Color3(0, 1, 0),
        type: 'entry',
        roomCountLimit: 1,
      },
      scene,
    )
  }
}
