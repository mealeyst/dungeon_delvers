import '@babylonjs/inspector';
import 'babylonjs-loaders';
import * as dat from 'dat.gui';
import {
  SceneLoader,
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

let box: any;

const onSceneReady = (scene: any) => {
  ProceduralTerrainDemo(scene);
  scene.debugLayer.show();
  SceneLoader.Append('./public/', 'PlaceHolderChar.glb', scene, () => {
    console.log('We have loaded');
  });
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: any) => {
  if (box !== undefined) {
    const deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
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
