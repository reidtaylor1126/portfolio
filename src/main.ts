import * as THREE from 'three';
import { degToRad} from 'three/src/math/MathUtils.js';

// const debug = document.getElementById('debug');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xafcfff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const mousePosition = new THREE.Vector2();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geo = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({color: 0xfa3c10})
const cube = new THREE.Mesh(geo, material);
const plane = new THREE.PlaneGeometry(5, 5);
const floorMat = new THREE.MeshStandardMaterial({color: 0xa0a0a0})
const floor = new THREE.Mesh(plane, floorMat);
floor.position.set(0, -0.5, 0);
floor.rotation.x = degToRad(-90);

const cameraAnchor = new THREE.Object3D();

const sky = new THREE.AmbientLight(0xafcfff, 1);
const light = new THREE.DirectionalLight(0xffefdf, 3);
light.position.set(5, 10, 3);
light.target = cube;

scene.add(sky);
scene.add(cube);
scene.add(floor);
scene.add(light);
scene.add(cameraAnchor);

cameraAnchor.children.push(camera);
camera.parent = cameraAnchor;

camera.position.z = 5;
// camera.position.y = 1;
// camera.rotation.x = 0.1;
document.addEventListener('mousemove', onMouseMove, false);
addEventListener('mousedown', onClick, false)

function onMouseMove(event: MouseEvent) {
    event.preventDefault();
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = (event.clientY / window.innerHeight) * 2 - 1;
}

function onClick(event: MouseEvent) {
    console.log(event)
}

function render() {
    renderer.render(scene, camera);
    cameraAnchor.rotation.y = mousePosition.x*1.5;
    cameraAnchor.rotation.x = mousePosition.y;
}

renderer.setAnimationLoop(render);