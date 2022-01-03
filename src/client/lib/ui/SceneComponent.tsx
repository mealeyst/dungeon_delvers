import {
  Engine, Scene, EngineOptions, SceneOptions,
} from '@babylonjs/core';
import React, {
  useEffect, useRef, HTMLProps, FunctionComponent,
} from 'react';
import styled from 'styled-components';

type SceneProps = {
  antialias: boolean;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  sceneOptions?: SceneOptions;
  onRender: Function;
  onSceneReady: Function;
};

const SceneComponentView: FunctionComponent<
  SceneProps & HTMLProps<HTMLCanvasElement>
> = ({
  antialias,
  engineOptions,
  adaptToDeviceRatio,
  sceneOptions,
  onRender,
  onSceneReady,
  ...rest
}) => {
  const reactCanvas = useRef(null);

  useEffect(() => {
    if (reactCanvas.current) {
      const engine = new (Engine as any)(
        reactCanvas.current,
        antialias,
        engineOptions,
        adaptToDeviceRatio,
      );
      const scene = new Scene(engine, sceneOptions);
      if (scene.isReady()) {
        onSceneReady(scene);
      } else {
        scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
      }

      engine.runRenderLoop(() => {
        if (typeof onRender === 'function') {
          onRender(scene);
        }
        scene.render();
      });

      const resize = () => {
        scene.getEngine().resize();
      };

      if (window) {
        window.addEventListener('resize', resize);
      }

      return () => {
        scene.getEngine().dispose();

        if (window) {
          window.removeEventListener('resize', resize);
        }
      };
    }
  }, [reactCanvas]);

  return <canvas ref={reactCanvas} {...rest} />;
};

const SceneComponent = styled(SceneComponentView)`
  height: 100%;
  width: 100%;
`;

export default SceneComponent;
