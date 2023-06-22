import { Color3, Scene } from '@babylonjs/core'
import { Room, RoomProps } from './room'

export type ExitProps = Pick<RoomProps, 'x' | 'y' | 'z' | 'height'>

export class Exit extends Room {
  constructor(args: ExitProps, scene: Scene) {
    super(
      {
        color: new Color3(1, 0, 0),
        length: Math.random() * 4 + 3,
        type: 'exit',
        width: Math.random() * 4 + 3,
        ...args,
      },
      scene,
    )
  }
}
