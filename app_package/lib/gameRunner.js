"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeBabylonApp = exports.useNative = exports.useWebGPU = void 0;
const core_1 = require("@babylonjs/core");
require("@babylonjs/loaders/glTF");
const CANNON = __importStar(require("cannon-es"));
const Game_1 = require("./game/Game");
exports.useWebGPU = false;
exports.useNative = false;
async function initializeBabylonApp(options) {
    window.CANNON = CANNON;
    exports.useNative = !!_native;
    if (exports.useNative) {
        options.assetsHostUrl = "app://";
    }
    else {
        options.assetsHostUrl = window.location.href.split("?")[0];
        if (!options.assetsHostUrl) {
            options.assetsHostUrl = "";
        }
    }
    if (options.assetsHostUrl) {
        console.log("Assets host URL: " + options.assetsHostUrl);
    }
    else {
        console.log("No assets host URL provided");
    }
    if (!exports.useNative) {
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        const div = document.createElement("div");
        div.style.width = "100%";
        div.style.height = "100%";
        document.body.appendChild(div);
        const canvas = document.createElement("canvas");
        canvas.id = "renderCanvas";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        canvas.oncontextmenu = () => false;
        div.appendChild(canvas);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        options.canvas = canvas;
    }
    else {
        options.canvas = {};
        core_1.MorphTargetManager.EnableTextureStorage = false;
    }
    const canvas = options.canvas;
    let engine;
    if (exports.useNative) {
        engine = new core_1.NativeEngine();
    }
    else if (exports.useWebGPU) {
        engine = new core_1.WebGPUEngine(canvas, {
            deviceDescriptor: {
                requiredFeatures: [
                    "depth-clip-control",
                    "depth24unorm-stencil8",
                    "depth32float-stencil8",
                    "texture-compression-bc",
                    "texture-compression-etc2",
                    "texture-compression-astc",
                    "timestamp-query",
                    "indirect-first-instance",
                ],
            },
        });
        await engine.initAsync();
        engine.compatibilityMode = false;
    }
    else {
        const badOS = /iPad/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent);
        engine = new core_1.Engine(canvas, !badOS);
    }
    window.engine = engine;
    const scene = (0, Game_1.CreateGameScene)(engine, options.assetsHostUrl, canvas);
    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        engine.resize();
    });
}
exports.initializeBabylonApp = initializeBabylonApp;
//# sourceMappingURL=gameRunner.js.map