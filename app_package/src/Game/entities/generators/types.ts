import { GroundMesh, Scene, Vector2 } from "@babylonjs/core";

export class TreeNode<T> {
  _left?: TreeNode<T>;
  _right?: TreeNode<T>;
  _leaf: T;

  constructor(data: T) {
    this._leaf = data;
  }

  /**
   * This function works to get the bottom most leaves.
   */
  get leaves(): T[] {
    const result: T[] = [];

    if (this._left && this._right) {
      result.push(...this._left.leaves, ...this._right.leaves);
    } else {
      result.push(this._leaf);
    }
    return result;
  }
}

/**
 * Container Types:
 */
export type Direction = "horizontal" | "vertical";

export class Rectangle {
  x: number;
  y: number;
  width: number;
  length: number;

  constructor(x: number, y: number, width: number, length: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.length = length;
  }

  get center(): Vector2 {
    return new Vector2(this.x + this.width / 2, this.y + this.length / 2);
  }

  get surface(): number {
    return this.width * this.length;
  }

  get down(): number {
    return this.y + this.length;
  }

  get right(): number {
    return this.x + this.width;
  }
}

export class Container extends Rectangle {
  room?: Room;
  corridor?: Corridor;

  constructor(x: number, y: number, width: number, length: number) {
    super(x, y, width, length);
  }
}

export class Room extends Rectangle {
  id: string;
  template: RoomTemplate;

  constructor(x: number, y: number, id: string, template: RoomTemplate) {
    super(x, y, template.width, template.length);

    this.id = id;
    this.template = template;
  }
}

export class Corridor extends Rectangle {
  constructor(x: number, y: number, width: number, length: number) {
    super(x, y, width, length);
  }

  get direction(): Direction {
    return this.width > this.length ? "horizontal" : "vertical";
  }
}

/**
 * Rooms
 */
export const RoomTypes = [
  "entrance",
  "monsters",
  "heal",
  "treasure",
  "boss",
] as const;

export type RoomType = typeof RoomTypes[number];

export interface RoomTemplate {
  type: RoomType;
  width: number;
  length: number;
}

export type RoomTemplates = Record<string, RoomTemplate>
