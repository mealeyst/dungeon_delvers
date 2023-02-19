import { Vector2 } from "@babylonjs/core";
export declare class TreeNode<T> {
    _left?: TreeNode<T>;
    _right?: TreeNode<T>;
    _leaf: T;
    constructor(data: T);
    /**
     * This function works to get the bottom most leaves.
     */
    get leaves(): T[];
}
/**
 * Container Types:
 */
export type Direction = "horizontal" | "vertical";
export declare class Rectangle {
    x: number;
    y: number;
    width: number;
    length: number;
    constructor(x: number, y: number, width: number, length: number);
    get center(): Vector2;
    get surface(): number;
    get down(): number;
    get right(): number;
}
export declare class Container extends Rectangle {
    room?: Room;
    corridor?: Corridor;
    constructor(x: number, y: number, width: number, length: number);
}
export declare class Room extends Rectangle {
    id: string;
    template: RoomTemplate;
    constructor(x: number, y: number, id: string, template: RoomTemplate);
}
export declare class Corridor extends Rectangle {
    constructor(x: number, y: number, width: number, length: number);
    get direction(): Direction;
}
/**
 * Rooms
 */
export declare const RoomTypes: readonly ["entrance", "monsters", "heal", "treasure", "boss"];
export type RoomType = typeof RoomTypes[number];
export interface RoomTemplate {
    type: RoomType;
    width: number;
    length: number;
}
export type RoomTemplates = Record<string, RoomTemplate>;
//# sourceMappingURL=types.d.ts.map