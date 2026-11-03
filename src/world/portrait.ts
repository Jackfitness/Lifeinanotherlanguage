import * as THREE from 'three';
import type { Plush } from './plush';

/** A small secondary renderer for plush portraits and the character-creation preview. */
let R: { renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera } | null = null;

export function mini() {
  if (R) return R;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  const scene = new THREE.Scene();
  const hemi = new THREE.HemisphereLight('#FFF4E6', '#C9A88C', 1.6);
  const key = new THREE.DirectionalLight('#FFF1DC', 2.2); key.position.set(2, 3, 4);
  const rim = new THREE.DirectionalLight('#FFD9E0', 1.2); rim.position.set(-3, 2, -2);
  scene.add(hemi, key, rim);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  R = { renderer, scene, camera };
  return R;
}

export function portraitOf(p: Plush, size = 192): string {
  const { renderer, scene, camera } = mini();
  renderer.setSize(size, size, false);
  p.root.position.set(0, 0, 0);
  p.yaw = p.targetYaw = 0.35;
  p.update(0.016, 0);
  scene.add(p.root);
  camera.aspect = 1; camera.updateProjectionMatrix();
  camera.position.set(0, 1.15, 2.75); camera.lookAt(0, 0.95, 0);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/png');
  scene.remove(p.root);
  return url;
}
