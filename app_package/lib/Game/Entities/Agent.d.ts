import { Nullable, Vector3, Quaternion, TransformNode } from "@babylonjs/core";
import { Input } from "./Inputs/Input";
export declare class Agent {
    forward: Vector3;
    right: Vector3;
    quat: Quaternion;
    position: Vector3;
    input: Input;
    transformNode: Nullable<TransformNode>;
    goToward(aimPos: Vector3, aimAt: Vector3, turnRatio: number): number;
}
//# sourceMappingURL=Agent.d.ts.map