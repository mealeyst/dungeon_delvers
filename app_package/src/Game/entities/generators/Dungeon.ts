import {
  MeshBuilder,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { InspectableType } from "@babylonjs/core/Misc/iInspectable";
import RoomsJSON from './Rooms.json'
import { random, randomChoice } from "../../../utils/random";
import { Container, Direction, RoomTemplate, RoomTemplates, TreeNode } from "./types";

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

const ROOMS_DEFAULT: RoomTemplates = RoomsJSON as RoomTemplates;

export class Dungeon extends TransformNode {
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

  constructor(name: string, scene: Scene, options?: DungeonArgs) {
    super(name, scene);
    const defaultArgs = {
      corridorWidth: 2,
      length: 48,
      iterations: 3,
      minSize: 4,
      ratio: 0.45,
      retries: 30,
      tileWidth: 16,
      width: 64,
    };
    this._corridorWidth = options?.corridorWidth || defaultArgs.corridorWidth;
    this._length = options?.length || defaultArgs.length;
    this._iterations = options?.iterations || defaultArgs.iterations;
    this._minSize = options?.minSize || defaultArgs.minSize;
    this._ratio = options?.ratio || defaultArgs.ratio;
    this._retries = options?.retries || defaultArgs.retries;
    this._tileWidth = options?.tileWidth || defaultArgs.tileWidth;
    this._width = options?.width || defaultArgs.width;
    this._transparentMaterial = new StandardMaterial(
      "transparentMaterial",
      scene
    );
    this._transparentMaterial.alpha = 0;
    this.generateRooms();

    this.inspectableCustomProperties = [
      {
        label: "Dungeon Options",
        propertyName: "dungeon",
        type: InspectableType.Tab,
      },
      {
        label: "Width",
        propertyName: "width",
        type: InspectableType.Slider,
        min: 30,
        max: 500,
        step: 1,
      },
      {
        label: "Length",
        propertyName: "length",
        type: InspectableType.Slider,
        min: 30,
        max: 500,
        step: 1,
      },
      {
        label: "Iterations",
        propertyName: "iterations",
        type: InspectableType.Slider,
        min: 3,
        max: 10,
        step: 1,
      },
      {
        label: "Retries",
        propertyName: "retries",
        type: InspectableType.Slider,
        min: 8,
        max: 100,
        step: 1,
      },
      {
        label: "Container Size Ratio",
        propertyName: "ratio",
        type: InspectableType.Slider,
        min: 0.05,
        max: 1,
        step: 0.05,
      },
      {
        label: "Corridor Width",
        propertyName: "corridorWidth",
        type: InspectableType.Slider,
        min: 1,
        max: 4,
        step: 1,
      },
      {
        label: "Tile Width",
        propertyName: "tileWidth",
        type: InspectableType.Slider,
        min: 1,
        max: 4,
        step: 1,
      },
      {
        label: "Generate Dungeon",
        propertyName: "generate",
        type: InspectableType.Button,
        callback: () => {
          const children = this.getChildMeshes();
          children.forEach((child) => child.dispose());
          this.generateRooms();
        },
      },
    ];
  }

  set corridorWidth(value: number) {
    this._corridorWidth = value;
  }

  get corridorWidth() {
    return this._corridorWidth;
  }

  set iterations(value: number) {
    this._iterations = value;
  }

  get iterations() {
    return this._iterations;
  }

  set length(value: number) {
    this._length = value;
  }

  get length() {
    return this._length;
  }

  set ratio(value: number) {
    this._ratio = value;
  }

  get ratio() {
    return this._ratio;
  }

  get tileWidth() {
    return this._tileWidth;
  }

  set tileWidth(value: number) {
    this._tileWidth = value;
  }

  set width(value: number) {
    this._width = value;
  }

  get width() {
    return this._width;
  }

  createTree(iterations: number): TreeNode<Container> {
    return this.generateTree(
      new Container(0, 0, this._width, this._length),
      iterations
    );
  }

  generateTree(container: Container, iterations: number): TreeNode<Container> {
    // debugger;
    const node = new TreeNode<Container>(container);
    if (
      iterations !== 0 &&
      node._leaf.width > this._minSize * 2 &&
      node._leaf.length > this._minSize * 2
    ) {
      // We still need to dive the container
      const [left, right] = this.splitContainer(container);
      if (left && right) {
        node._left = this.generateTree(left, iterations - 1);
        node._right = this.generateTree(right, iterations - 1);
      }
    }
    return node;
  }

  splitContainer(
    container: Container,
    retries?: number
  ): [Container, Container] | [null, null] {
    let left: Container;
    let right: Container;
    retries = retries || this._retries;
    // We tried too many times tos split the container without success
    if (retries === 0) {
      return [null, null];
    }

    // Generate a random direction to split the container
    const direction = randomChoice<Direction>(["horizontal", "vertical"]);
    if (direction === "vertical") {
      // Vertical
      left = new Container(
        container.x,
        container.y,
        random(1, container.width),
        container.length
      );
      right = new Container(
        container.x + container.width,
        container.y,
        container.width - left.width,
        container.length
      );

      // Retry splitting the container if it's not large enough
      const leftWidthRatio = left.width / left.length;
      const rightWidthRatio = right.width / right.length;
      if (leftWidthRatio < this._ratio || rightWidthRatio < this.ratio) {
        // Decrement amount retires;
        return this.splitContainer(container, retries - 1);
      }
    } else {
      // Horizontal
      left = new Container(
        container.x,
        container.y,
        container.width,
        random(1, container.length)
      );
      right = new Container(
        container.x,
        container.y + left.length,
        container.width,
        container.length - left.length
      );

      // Retry splitting the container if it's not high enough
      const leftLengthRatio = left.length / left.width;
      const rightLengthRatio = right.length / right.width;
      if (leftLengthRatio < this._ratio || rightLengthRatio < this._ratio) {
        // Decrement amount of iterations
        return this.splitContainer(container, retries - 1);
      }
    }

    return [left, right];
  }

  generateRooms() {
    const iterations = this._iterations;
    this._tree = this.createTree(iterations);
    this._tree.leaves.forEach((leaf, index) => {
      const roomIds = Object.keys(ROOMS_DEFAULT);
      const roomId = randomChoice(roomIds);
      const randomRoom = ROOMS_DEFAULT[roomId]
      console.log('RandomRoom', randomRoom)
      const ground = MeshBuilder.CreateGround(roomId, {
        width: randomRoom.width,
        height: randomRoom.length,
      });
      ground.parent = this;
      // ground.setPivotPoint(new Vector3(leaf.width / 2, 0, leaf.length));
      ground.position = new Vector3((leaf.center.x - randomRoom.width / 2), 0, (leaf.center.y - randomRoom.length / 2));
    });
  }
}
