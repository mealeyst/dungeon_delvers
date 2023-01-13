"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babylonjs/core");
const materials_1 = require("@babylonjs/materials");
class Sky {
    constructor(gui, scene) {
        this.setSky = () => {
            this.skyMaterial.turbidity = this.guiParams.sky.turbidity;
            this.skyMaterial.rayleigh = this.guiParams.sky.rayleigh;
            this.skyMaterial.luminance = this.guiParams.sky.luminance;
            this.skybox.material = this.skyMaterial;
        };
        this.setSun = () => {
            this.skyMaterial.inclination = this.guiParams.sun.inclination;
            this.skyMaterial.azimuth = this.guiParams.sun.azimuth;
        };
        this.initializeGui = () => {
            const skyRollup = this.gui.addFolder("Sky");
            skyRollup.add(this.guiParams.sky, "turbidity", 0, 20).onChange(this.setSky);
            skyRollup
                .add(this.guiParams.sky, "rayleigh", 0.0, 2.0)
                .onChange(this.setSky);
            skyRollup
                .add(this.guiParams.sky, "luminance", 0.0, 1.0)
                .onChange(this.setSky);
            const sunRollup = this.gui.addFolder("Sun");
            sunRollup
                .add(this.guiParams.sun, "inclination", 0.0, 1.0)
                .onChange(this.setSun);
            sunRollup.add(this.guiParams.sun, "azimuth", 0.0, 1).onChange(this.setSun);
        };
        this.scene = scene;
        this.gui = gui;
        this.guiParams = {
            sky: {
                luminance: 0.2,
                mieCoefficient: 0.005,
                mieDirectionalG: 0.8,
                rayleigh: 0.4,
                turbidity: 1,
            },
            sun: {
                inclination: 0.2,
                azimuth: 0.25,
            },
        };
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        this.sunPosition = new core_1.Vector3(0, 100, 0);
        this.light = new core_1.HemisphericLight("light", this.sunPosition, this.scene);
        // Default intensity is 1. Let's dim the light a small amount
        this.light.intensity = 0.7;
        this.skyMaterial = new materials_1.SkyMaterial("skyMaterial", this.scene);
        this.skyMaterial.backFaceCulling = false;
        this.skybox = core_1.Mesh.CreateBox("skyBox", 1000.0, this.scene);
        this.setSky();
        this.setSun();
        this.initializeGui();
    }
}
exports.default = Sky;
//# sourceMappingURL=Sky.js.map