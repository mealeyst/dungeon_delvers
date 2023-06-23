import { Color3, Scene } from '@babylonjs/core'
import { Room, RoomProps } from './room'

export class Heal extends Room {
  constructor(args: RoomProps, scene: Scene) {
    super(
      {
        ...args,
        color: new Color3(0, 1, 1),
        type: 'heal',
        roomCountLimit: 1,
      },
      scene,
    )
  }
}
