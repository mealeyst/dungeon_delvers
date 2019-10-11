import * as THREE from "three";

export default class Login {
  constructor({ scene, camera, renderer }) {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(this.geometry, this.material);
    scene.add(cube);

    camera.position.z = 5;
    const animate = function() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };
    animate();
  }
}
