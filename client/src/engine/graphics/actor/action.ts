import { AnimationGroup, Sound } from "@babylonjs/core"

export class Action {
  public animationGroup: AnimationGroup
  public defaultInput: string
  public defaultSpeed: number
  public id: string
  public input: string
  public loop: boolean = true
  public rate: number = 1
  public sound?: Sound
  public speed: number

  constructor(id: string, speed: number, input: string, sound?: Sound) {
    this.defaultSpeed = speed
    this.id = id
    this.input = input
    this.sound = sound
    this.speed = speed
  }

  public reset() {
    this.speed = this.defaultSpeed;
    this.input = this.defaultInput;
    this.loop = true;
    this.rate = 1;
    this.sound = undefined;
  }
}