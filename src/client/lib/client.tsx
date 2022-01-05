import '@babylonjs/inspector';
import * as dat from 'dat.gui';
import {
  Vector3,
  HemisphericLight,
  MeshBuilder,
  FreeCamera,
  StandardMaterial,
  CubeTexture,
  Texture,
  Color3
} from '@babylonjs/core';
import React, { useEffect, FunctionComponent } from 'react';
import { Helmet } from 'react-helmet';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import SceneComponent from './ui/SceneComponent';
import socket from './socket';
import NoiseGenerator from './engine/noise';

type RootProps = {
  className?: string;
};

const StageStyles = createGlobalStyle`
  html, body {
    height: 100%;
    font-family: 'Bellefair', serif;
  }
  body {
    padding: 0;
    margin: 0;
  }
  .main-stage {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
`;

let camera: any;

const onSceneReady = (scene: any) => {
  // This creates and positions a free camera (non-mesh)
  camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
  // camera = new ArcRotateCamera(
  //   'camera1',
  //   1,
  //   0,
  //   2,
  //   new Vector3(0, 5, -10),
  //   scene,
  // );

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight('light', new Vector3(0, 1, 1), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  // const box = MeshBuilder.CreateBox('box', { size: 2 }, scene);

  // Move the box upward 1/2 its height
  // box.position.y = 1;

  // Our built-in 'ground' shape.
  const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene);
  const skyboxMaterial = new StandardMaterial('skyBox', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new CubeTexture('public/skybox', scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
  const ground = MeshBuilder.CreateGround('ground', {
    width: 50,
    height: 50,
    subdivisions: 50,
    updatable: true,
  }, scene);
  const materialforground = new StandardMaterial('texture1', scene);
  ground.material = materialforground;
  // materialforground.wireframe = true;
  const oldgui = document.getElementById('datGUI');
  if (oldgui != null) {
    oldgui.remove();
  }

  const gui = new dat.GUI();
  gui.domElement.style.marginTop = '100px';
  gui.domElement.id = 'datGUI';
  const onNoiseChanged = () => {
  };
  const noiseOptions = {
    octaves: 10,
    persistence: 0.5,
    lacunarity: 2.0,
    exponentiation: 3.9,
    height: 64,
    scale: 256.0,
    seed: 1,
    noiseType: 'simplex',
  };

  const noiseRollup = gui.addFolder('Terrain.Noise');
  noiseRollup.add(noiseOptions, 'noiseType', ['simplex', 'perlin', 'rand']).onChange(onNoiseChanged);
  noiseRollup.add(noiseOptions, 'scale', 64.0, 1024.0).onChange(onNoiseChanged);
  noiseRollup.add(noiseOptions, 'octaves', 1, 20, 1).onChange(onNoiseChanged);
  noiseRollup.add(noiseOptions, 'persistence', 0.01, 1.0).onChange(onNoiseChanged);
  noiseRollup.add(noiseOptions, 'lacunarity', 0.01, 4.0).onChange(onNoiseChanged);
  noiseRollup.add(noiseOptions, 'exponentiation', 0.1, 10.0).onChange(onNoiseChanged);
  noiseRollup.add(noiseOptions, 'height', 0, 256).onChange(onNoiseChanged);

  const noise = new NoiseGenerator(noiseOptions);
  const heightmapOptions = {
    height: 16,
  };

  const heightmapRollup = gui.addFolder('Terrain.Heightmap');
  heightmapRollup.add(heightmapOptions, 'height', 0, 128).onChange(onNoiseChanged);
  // const positions = ground.getVerticesData(VertexBuffer.PositionKind);
  // if (positions != null) {
  //   const numberOfVertices = positions.length / 3;
  //   for (let i = 0; i < numberOfVertices; i += 1) {
  //   //   // positions[i*3] *= 1.1;
  //     positions[i * 3 + 1] += Math.random();
  //   //   // positions[i*3+2] *= 2.5;
  //   }
  //   ground.updateVerticesData(VertexBuffer.PositionKind, positions);
  // }
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: any) => {
  // if (camera !== undefined) {
  //   const deltaTimeInMillis = scene.getEngine().getDeltaTime();

  //   const rpm = 10;
  //   camera.rotation;
  //   // camera.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  // }
};

const RootView: FunctionComponent<RootProps> = ({ className }) => {
  useEffect(() => {
    socket.connect();
    console.log(socket);
  });
  return (
    <main className={className}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bellefair&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <StageStyles />
      <SceneComponent
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
        id="my-canvas"
      />
    </main>
  );
};

const Root = styled(RootView)`
  width: 100%;
  height: 100%;
  position: relative;
`;

const main = document.createElement('main');
main.classList.add('main-stage');

ReactDOM.render(<Root />, document.body.appendChild(main));

console.log('Here we go!');
