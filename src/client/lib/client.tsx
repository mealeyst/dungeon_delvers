import * as BABYLON from 'babylonjs'
import React, { useEffect, useRef, FunctionComponent } from 'react';
import { Helmet } from 'react-helmet'
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components'
import Login from "./ui/Login"
import socket from "./socket";
type RootProps = {
  className?: string
}

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
`

const RootView:FunctionComponent<RootProps> = ({className}) => {
  const canvasRef = useRef(undefined)
  useEffect(() => {
    socket.connect();
    console.log(socket)
  })
  useEffect(() => {
    if(canvasRef.current) {
      // Load the 3D engine
      var engine = new BABYLON.Engine(canvasRef.current, true, {preserveDrawingBuffer: true, stencil: true});
      // CreateScene function that creates and return the scene
      var createScene = function(){
          // Create a basic BJS Scene object
          var scene = new BABYLON.Scene(engine);
          // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
          // var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
          var camera = new BABYLON.ArcRotateCamera('camera1', 1, 0, 2, new BABYLON.Vector3(0, 5, -10), scene)
          // Target the camera to scene origin
          camera.setTarget(BABYLON.Vector3.Zero());
          // Attach the camera to the canvasRef.current
          camera.attachControl(canvasRef.current, false);
          // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
          var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
          // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
          var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
          // Move the sphere upward 1/2 of its height
          sphere.position.y = 1;
          // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
          var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false);
          // Return the created scene
          return scene;
      }
      // call the createScene function
      var scene = createScene();
      // run the render loop
      engine.runRenderLoop(function(){
          scene.render();
      });
    }
  }, [canvasRef.current])
  return (
    <main className={className}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Bellefair&display=swap" rel="stylesheet" />
      </Helmet>
      <StageStyles />
      <canvas ref={canvasRef} />
      <Login />
    </main>
  )
}

const Root = styled(RootView)`
  width: 100%;
  height: 100%;
  position: relative;
  canvas {
    height: 100%;
    width: 100%;
  }
`

const main = document.createElement('main')
main.classList.add('main-stage')

ReactDOM.render(
  <Root />,
  document.body.appendChild(main)
)

console.log('Here we go!')