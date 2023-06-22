import { Color3, Scene } from '@babylonjs/core'
import { Room, RoomProps } from './room'

export type EntryProps = Pick<RoomProps, 'x' | 'y' | 'z' | 'height'>

export class Entry extends Room {
  constructor(args: EntryProps, scene: Scene) {
    super(
      {
        color: new Color3(0, 1, 0),
        length: Math.random() * 4 + 3,
        type: 'entry',
        width: Math.random() * 4 + 3,
        ...args,
      },
      scene,
    )
  }
}
