import { MeshBuilder } from "@babylonjs/core";

const MIN_LEAF_SIZE = 100;
const MAX_LEAF_SIZE = 300;
const MIN_ROOM_SIZE = 30;

type LeafFunc = {
  split: () => boolean;
  createRoom: () => void;
  leftChild: LeafFunc | null;
  rightChild: LeafFunc | null;
  width: number;
  height: number;
};

export function leaf(
  x: number,
  y: number,
  width: number,
  height: number,
  index: number
) {
  let leftChild: LeafFunc | null = null;
  let rightChild: LeafFunc | null = null;

  function split() {
    if (leftChild !== null && rightChild !== null) {
      return false;
    }
    // Determine to split vertical or horizontal, else split randomly
    const splitH =
      width > height && width / height >= 1.25
        ? true
        : height > width && height / width >= 1.25
        ? false
        : Math.random() > 0.5;
    const max = splitH ? height : width - MIN_LEAF_SIZE;
    if (max <= MIN_LEAF_SIZE) {
      return false; // Area is too small to split
    }
    const split = Math.floor(Math.random() * max) + MIN_LEAF_SIZE;
    if (splitH) {
      leftChild = leaf(x, y, width, split, index + 1);
      rightChild = leaf(x, y + split, width, height - split, index + 2);
    } else {
      leftChild = leaf(x, y, split, height, index + 1);
      rightChild = leaf(x + split, y, width - split, height, index + 2);
    }
    return true; // Split success!
  }

  function createRoom() {
    if (!!leftChild && !!rightChild) {
      !!leftChild && leftChild.createRoom();
      !!rightChild && rightChild.createRoom();
    } else {
      const floor = MeshBuilder.CreateGround(`room_${index}_floor`, {
        height: Math.floor(Math.random() * height - 10) + MIN_ROOM_SIZE,
        width: Math.floor(Math.random() * width - 10) + MIN_ROOM_SIZE,
        subdivisions: 4,
      });
    }
  }
  return {
    split,
    createRoom,
    leftChild,
    rightChild,
    width,
    height,
  };
}

export function binarySpacePartition(width: number, height: number) {
  const _leafs = [];
  let count = 0;
  const rootLeaf: LeafFunc = leaf(0, 0, width, height, count);
  _leafs.push(rootLeaf);

  let didSplit = true;
  while (didSplit) {
    debugger;
    didSplit = false;
    _leafs.forEach((leaf) => {
      if (leaf.leftChild === null && leaf.rightChild === null) {
        if (
          leaf.width > MAX_LEAF_SIZE ||
          leaf.height > MAX_LEAF_SIZE ||
          Math.random() > 0.25
        ) {
          if (leaf.split()) {
            _leafs.push(leaf.leftChild);
            _leafs.push(leaf.rightChild);
            didSplit = true;
          }
        }
      }
    });
  }
  rootLeaf.createRoom();
}
