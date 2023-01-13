import NoiseGenerator from "../../../utils/noise";
declare class HeightGenerator {
    private position;
    private radius;
    private generator;
    constructor(generator: NoiseGenerator, position: any, minRadius: number, maxRadius: number);
    Get(x: number, y: number): number[];
}
export default HeightGenerator;
//# sourceMappingURL=HeightGenerator.d.ts.map