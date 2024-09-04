import { Character } from './character/character'

type ActionArgs = {
  actor: Character
  cooldown: number
  cost: number
  description: string
  name: string
  onPerform: () => void
  range: number
  target: Character
}
export const action = ({ actor }) => {}
