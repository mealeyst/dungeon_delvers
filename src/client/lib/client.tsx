import {
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ArcRotateCamera,
} from '@babylonjs/core';
import React, { useEffect, FunctionComponent } from 'react';
import { Helmet } from 'react-helmet';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import SceneComponent from './ui/SceneComponent';
import socket from './socket';

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
  // camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  camera = new ArcRotateCamera(
    'camera1',
    0,
    0,
    150,
    new Vector3(0, 0, -10),
    scene,
  );

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  // const box = MeshBuilder.CreateBox('box', { size: 2 }, scene);

  // Move the box upward 1/2 its height
  // box.position.y = 1;

  // Our built-in 'ground' shape.
  // MeshBuilder.CreateGround('ground', { width: 250, height: 250 }, scene);
  MeshBuilder.CreateGroundFromHeightMap('gdhm', 'public/heightMap.png', {
    width: 150,
    height: 150,
    subdivisions: 500,
    maxHeight: 50,
  });
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: any) => {
  if (camera !== undefined) {
    const deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    camera.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
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
