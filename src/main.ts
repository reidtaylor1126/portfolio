import * as THREE from 'three';
import { degToRad} from 'three/src/math/MathUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import CustomOrbitCam from './cameraSystem';

// const debug = document.getElementById('debug');

const mousePosition = new THREE.Vector2();
const scene = new THREE.Scene();
const loader = new GLTFLoader();
scene.background = new THREE.Color(0xbbbbb7);

document.addEventListener('mousemove', onMouseMove, false);
addEventListener('mousedown', onClick, false)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camSys = new CustomOrbitCam(scene);
camSys.targets = [new THREE.Vector2(-0.16145833333333337, -0.31443298969072164)]
const sky = new THREE.AmbientLight(0xafcfff, 1);
const light = new THREE.DirectionalLight(0xffefdf, 3);
light.position.set(5, 10, 3);

scene.add(sky);
scene.add(light);

loader.load( 'illusion-angle.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

function onMouseMove(event: MouseEvent) {
    event.preventDefault();
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = (event.clientY / window.innerHeight) * 2 - 1;
}

function onClick(event: MouseEvent) {
    console.log((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1)
}

function render() {
    renderer.render(scene, camSys.camera);

    camSys.moveCamera(mousePosition);
}



renderer.setAnimationLoop(render);