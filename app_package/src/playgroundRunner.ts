import { Engine } from "@babylonjs/core";
import { CreatePlaygroundScene } from "./Playground/playground";

export interface InitializeBabylonAppOptions {
    canvas: HTMLCanvasElement;
    resourceManifest?: Map<string, string>;
}

export function initializeBabylonApp(options: InitializeBabylonAppOptions) {
    const canvas = options.canvas;
    const engine = new Engine(canvas);
    const scene = CreatePlaygroundScene(engine, canvas);
    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener("resize", () => {
        engine.resize();
    });
}

