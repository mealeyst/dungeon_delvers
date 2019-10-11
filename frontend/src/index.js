"use strict";
import * as THREE from "three";
import { Login } from "SRC/ui";

export default class DungeonDelver {
  constructor(document, window) {
    console.log("Creating UI");
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      (window.innerWidth - 5) / (window.innerHeight - 4),
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth - 5, window.innerHeight - 4);
    document.body.appendChild(this.renderer.domElement);
    const LoginScreen = new Login({ ...this });
    LoginScreen.animate();
  }
}

new DungeonDelver(document, window);
