import { Scene, StandardMaterial, TransformNode } from "@babylonjs/core";
import { Container, TreeNode } from "./types";
type DungeonArgs = {
    corridorWidth?: number;
    length?: number;
    iterations?: number;
    minSize?: number;
    ratio?: number;
    retries?: number;
    tileWidth?: number;
    width?: number;
};
export declare class Dungeon extends TransformNode {
    _corridorWidth: number;
    _length: number;
    _iterations: number;
    _minSize: number;
    _ratio: number;
    _retries: number;
    _tileWidth: number;
    _tree?: TreeNode<Container>;
    _width: number;
    _transparentMaterial: StandardMaterial;
    constructor(name: string, scene: Scene, options?: DungeonArgs);
    set corridorWidth(value: number);
    get corridorWidth(): number;
    set iterations(value: number);
    get iterations(): number;
    set height(value: number);
    get height(): number;
    set ratio(value: number);
    get ratio(): number;
    get tileWidth(): number;
    set tileWidth(value: number);
    set width(value: number);
    get width(): number;
    createTree(iterations: number): TreeNode<Container>;
    generateTree(container: Container, iterations: number): TreeNode<Container>;
    splitContainer(container: Container, retries?: number): [Container, Container] | [null, null];
    generateRooms(): void;
}
export {};
//# sourceMappingURL=Dungeon.d.ts.map