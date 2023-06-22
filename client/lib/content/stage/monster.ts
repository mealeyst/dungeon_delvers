import { Color3, Scene } from '@babylonjs/core'
import { Room, RoomProps } from './room'

export type MonsterProps = Pick<RoomProps, 'x' | 'y' | 'z' | 'height'>

export class Monster extends Room {
  constructor(args: MonsterProps, scene: Scene) {
    super(
      {
        color: new Color3(1, 0.65, 0),
        length: Math.random() * 10 + 5,
        type: 'monster',
        width: Math.random() * 10 + 5,
        ...args,
      },
      scene,
    )
  }
}
