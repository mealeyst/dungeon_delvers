import '@babylonjs/inspector';
import * as dat from 'dat.gui';
import {
  Vector3,
  HemisphericLight,
  MeshBuilder,
  FreeCamera,
  StandardMaterial,
  Mesh,
  VertexBuffer,
} from '@babylonjs/core';
// import { SkyMaterial } from '@babylonjs/materials';
import React, { useEffect, FunctionComponent } from 'react';
import { Helmet } from 'react-helmet';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import SceneComponent from './ui/SceneComponent';
import socket from './socket';
import ProceduralTerrainDemo from './game/ProceduralTerrainDemo';
import Login from './ui/Login';

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
  ProceduralTerrainDemo(scene);
  // This creates and positions a free camera (non-mesh)
  // camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
  // camera = new ArcRotateCamera(
  //   'camera1',
  //   1,
  //   0,
  //   2,
  //   new Vector3(0, 5, -10),
  //   scene,
  // );

  // This targets the camera to scene origin
  // camera.setTarget(Vector3.Zero());

  // const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  // camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  // const light = new HemisphericLight('light', new Vector3(0, 1, 1), scene);

  // Default intensity is 1. Let's dim the light a small amount
  // light.intensity = 0.7;

  // Our built-in 'box' shape.
  // const box = MeshBuilder.CreateBox('box', { size: 2 }, scene);

  // Move the box upward 1/2 its height
  // box.position.y = 1;

  // Our built-in 'ground' shape.
  // const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene);
  // const skyboxMaterial = new StandardMaterial('skyBox', scene);
  // skyboxMaterial.backFaceCulling = false;
  // skyboxMaterial.reflectionTexture = new CubeTexture('public/skybox', scene);
  // skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  // skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  // skyboxMaterial.specularColor = new Color3(0, 0, 0);
  // skybox.material = skyboxMaterial;
  // const skyMaterial = new SkyMaterial('skyMaterial', scene);
  // skyMaterial.backFaceCulling = false;

  // const skybox = Mesh.CreateBox('skyBox', 1000.0, scene);
  // skyMaterial.turbidity = 1;
  // skyMaterial.inclination = 0.5;
  // skyMaterial.useSunPosition = true; // Do not set sun position from azimuth and inclination
  // skyMaterial.sunPosition = new Vector3(-50, 100, 0);
  // skyMaterial.rayleigh = 2;
  // skyMaterial.luminance = 1;
  // skybox.material = skyMaterial;
  // const ground = MeshBuilder.CreateGround('ground', {
  //   width: 50,
  //   height: 50,
  //   subdivisions: 50,
  //   updatable: true,
  // }, scene);
  // const materialforground = new StandardMaterial('texture1', scene);
  // ground.material = materialforground;
  // materialforground.wireframe = true;

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
      {/* <Login /> */}
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
