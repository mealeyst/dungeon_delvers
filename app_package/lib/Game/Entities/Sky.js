"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babylonjs/core");
const materials_1 = require("@babylonjs/materials");
class Sky extends core_1.TransformNode {
    constructor(name, scene, options) {
        var _a, _b, _c, _d, _e;
        super(name, scene);
        const defualtSkyOptions = {
            sky: {
                luminance: 0.2,
                rayleigh: 0.4,
                turbidity: 1,
            },
            sun: {
                inclination: 0.0,
                azimuth: 0.25,
            },
        };
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        this._sunPosition = new core_1.Vector3(0, 100, 0);
        this._light = new core_1.HemisphericLight("light", this._sunPosition, scene);
        this._azimuth = ((_a = options === null || options === void 0 ? void 0 : options.sun) === null || _a === void 0 ? void 0 : _a.azimuth) || (defualtSkyOptions === null || defualtSkyOptions === void 0 ? void 0 : defualtSkyOptions.sun.azimuth);
        this._inclination = ((_b = options === null || options === void 0 ? void 0 : options.sun) === null || _b === void 0 ? void 0 : _b.inclination) || (defualtSkyOptions === null || defualtSkyOptions === void 0 ? void 0 : defualtSkyOptions.sun.inclination);
        this._luminance = ((_c = options === null || options === void 0 ? void 0 : options.sky) === null || _c === void 0 ? void 0 : _c.luminance) || (defualtSkyOptions === null || defualtSkyOptions === void 0 ? void 0 : defualtSkyOptions.sky.luminance);
        this._rayleigh = ((_d = options === null || options === void 0 ? void 0 : options.sky) === null || _d === void 0 ? void 0 : _d.rayleigh) || (defualtSkyOptions === null || defualtSkyOptions === void 0 ? void 0 : defualtSkyOptions.sky.rayleigh);
        this._turbidity = ((_e = options === null || options === void 0 ? void 0 : options.sky) === null || _e === void 0 ? void 0 : _e.turbidity) || (defualtSkyOptions === null || defualtSkyOptions === void 0 ? void 0 : defualtSkyOptions.sky.turbidity);
        // Default intensity is 1. Let's dim the light a small amount
        this._light.intensity = 0.7;
        this._skyMaterial = new materials_1.SkyMaterial("skyMaterial", scene);
        this._skyMaterial.backFaceCulling = false;
        this._skybox = core_1.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
        this._skybox.parent = this;
        this._skybox.material = this._skyMaterial;
        // Custom inspector properties.
        this.inspectableCustomProperties = [
            {
                label: "Sky Options",
                propertyName: "sky",
                type: core_1.InspectableType.Tab
            },
            {
                label: "Luminance",
                propertyName: "luminence",
                type: core_1.InspectableType.Slider,
                min: 0.0,
                max: 1.0,
                step: 0.1,
            },
            {
                label: "Rayleigh",
                propertyName: "rayleigh",
                type: core_1.InspectableType.Slider,
                min: 0.0,
                max: 2.0,
                step: 0.1,
            },
            {
                label: "Turbidity",
                propertyName: "turbidity",
                type: core_1.InspectableType.Slider,
                min: 0,
                max: 20,
                step: 1,
            },
            {
                label: "Sun Options",
                propertyName: "sun",
                type: core_1.InspectableType.Tab
            },
            {
                label: "azimuth",
                propertyName: "azimuth",
                type: core_1.InspectableType.Slider,
                min: 0.0,
                max: 1.0,
                step: 0.1,
            },
            {
                label: "Inclination",
                propertyName: "inclination",
                type: core_1.InspectableType.Slider,
                min: -1.0,
                max: 1.0,
                step: 0.1,
            }
        ];
        let alpha = 1;
        scene.onBeforeRenderObservable.add(() => {
            this._inclination = Math.cos(alpha);
            this._skyMaterial.inclination = Math.cos(alpha);
            alpha = (alpha < 3) ? (alpha + 0.0001) : 0;
        });
    }
    set azimuth(value) {
        this._azimuth = value;
        this._skyMaterial.azimuth = value;
    }
    get azimuth() {
        return this._azimuth;
    }
    set inclination(value) {
        this._inclination = value;
        this._skyMaterial.inclination = value;
    }
    get inclination() {
        return this._inclination;
    }
    set rayleigh(value) {
        this._rayleigh = value;
        this._skyMaterial.rayleigh = value;
    }
    get rayleigh() {
        return this._rayleigh;
    }
    set turbidity(value) {
        this._turbidity = value;
        this._skyMaterial.turbidity = value;
    }
    get turbidity() {
        return this._turbidity;
    }
    set luminance(value) {
        this._luminance = value;
        this._skyMaterial.luminance = value;
    }
    get luminance() {
        return this._luminance;
    }
}
exports.default = Sky;
//# sourceMappingURL=Sky.js.map