import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

const canvas = document.querySelector<HTMLCanvasElement>('[data-brain-viewer]');

if (canvas) {
  const viewportReadout = document.querySelector<HTMLElement>('[data-brain-readout="viewport"]');
  const trianglesReadout = document.querySelector<HTMLElement>('[data-brain-readout="triangles"]');
  const autorotateToggle = document.querySelector<HTMLInputElement>('[data-brain-toggle="autorotate"]');
  const wireframeToggle = document.querySelector<HTMLInputElement>('[data-brain-toggle="wireframe"]');
  const opacityRange = document.querySelector<HTMLInputElement>('[data-brain-range="opacity"]');
  const emissiveRange = document.querySelector<HTMLInputElement>('[data-brain-range="emissive"]');
  const speedRange = document.querySelector<HTMLInputElement>('[data-brain-range="speed"]');
  const resetButton = document.querySelector<HTMLButtonElement>('[data-brain-action="reset"]');
  const focusButton = document.querySelector<HTMLButtonElement>('[data-brain-action="focus"]');

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xdce8ff, 12, 28);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(-1.2, 0.4, 6.2);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.1;
  controls.minDistance = 3.8;
  controls.maxDistance = 9;
  controls.target.set(0, 0.2, 0);

  const ambient = new THREE.AmbientLight(0xd6e7ff, 1.9);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
  keyLight.position.set(4, 6, 8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xffee7d, 1.45);
  rimLight.position.set(-6, 2, -4);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0x8ab7ff, 18, 20, 2);
  fillLight.position.set(0, 0, 3.5);
  scene.add(fillLight);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xd7e6ff,
    metalness: 0.08,
    roughness: 0.24,
    transmission: 0.12,
    transparent: true,
    opacity: 0.88,
    thickness: 0.9,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
    emissive: new THREE.Color(0x6d8dff),
    emissiveIntensity: 0.62,
  });

  const group = new THREE.Group();
  scene.add(group);

  const updateViewport = () => {
    const bounds = canvas.parentElement?.getBoundingClientRect();
    const width = bounds?.width ?? 800;
    const height = bounds?.height ?? 600;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (viewportReadout) viewportReadout.textContent = `${Math.round(width)} × ${Math.round(height)}`;
  };

  const fitCamera = (mesh: THREE.Mesh) => {
    const box = new THREE.Box3().setFromObject(mesh);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    mesh.position.sub(center);
    const distance = maxDim * 2.1;
    camera.position.set(-0.8, 0.45, distance);
    controls.target.set(0, 0.15, 0);
    camera.near = Math.max(0.1, distance / 100);
    camera.far = distance * 20;
    camera.updateProjectionMatrix();
    controls.update();
  };

  const loader = new STLLoader();
  loader.load(
    '/models/brain.stl',
    (geometry: THREE.BufferGeometry) => {
      geometry.computeVertexNormals();
      geometry.center();
      geometry.rotateY(Math.PI);

      const mesh = new THREE.Mesh(geometry, material);
      const box = new THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.25 / maxDim;
      mesh.scale.setScalar(scale);

      group.clear();
      group.add(mesh);
      fitCamera(mesh);

      const position = geometry.getAttribute('position');
      if (trianglesReadout) {
        trianglesReadout.textContent = `${Math.round(position.count / 3).toLocaleString()} triangles`;
      }
    },
    undefined,
    () => {
      if (trianglesReadout) trianglesReadout.textContent = 'Failed to load STL';
    }
  );

  autorotateToggle?.addEventListener('change', () => {
    controls.autoRotate = autorotateToggle.checked;
  });

  wireframeToggle?.addEventListener('change', () => {
    material.wireframe = wireframeToggle.checked;
  });

  opacityRange?.addEventListener('input', () => {
    material.opacity = Number(opacityRange.value) / 100;
  });

  emissiveRange?.addEventListener('input', () => {
    material.emissiveIntensity = Number(emissiveRange.value) / 100;
  });

  speedRange?.addEventListener('input', () => {
    controls.autoRotateSpeed = (Number(speedRange.value) / 100) * 3.5;
  });

  resetButton?.addEventListener('click', () => {
    camera.position.set(-1.2, 0.4, 6.2);
    controls.target.set(0, 0.2, 0);
    controls.update();
  });

  focusButton?.addEventListener('click', () => {
    camera.position.set(0.25, 0.15, 4.5);
    controls.target.set(0, 0.1, 0);
    controls.update();
  });

  const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  updateViewport();
  window.addEventListener('resize', updateViewport);
  animate();
}
