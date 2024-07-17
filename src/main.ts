import * as THREE from 'three';
import { degToRad} from 'three/src/math/MathUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import CustomOrbitCam from './cameraSystem';

// const debug = document.getElementById('debug');
var useMouse = true;

const viewPosition = new THREE.Vector2();
const scene = new THREE.Scene();
const loader = new GLTFLoader();
scene.background = new THREE.Color(0xbbbbb7);

addEventListener('mousemove', onMouseMove, false);
addEventListener('mousedown', onClick, false)
addEventListener('keydown', onKeyDown, false)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camSys = new CustomOrbitCam(scene);
camSys.targets = [
    new THREE.Vector2(-0.5791666667, -0.2620967742),
    new THREE.Vector2(0.053125, 0.524193548),
    new THREE.Vector2(0.4072916667, -0.435483871)   
]
const sky = new THREE.AmbientLight(0xafcfff, 1);
const light = new THREE.DirectionalLight(0xffefdf, 3);
light.position.set(5, 10, 3);

const targetMarkContainer = document.getElementById('target-container')
camSys.targets.map((target) => {
    const width = camSys.snapThreshold*0.5
    const x = (window.innerWidth * (target.x+1) / 2) - width/2;
    const y = (window.innerHeight * (target.y + 1) / 2) - width/2;
    const targetMark = document.createElement("div");
    targetMark.className = 'nav-target'
    targetMark.setAttribute('style', `left: ${x}px; top: ${y}px; width: ${width}px; height: ${width}px`)
    // targetMark.style.left = `${x}`;
    // targetMark.style.top = `${y}`;
    // targetMark.style.width = `${width}`;
    // targetMark.style.height = `${width}`;

    targetMarkContainer?.appendChild(targetMark);
})

scene.add(sky);
scene.add(light);

loader.load( 'full_1.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

function onMouseMove(event: MouseEvent) {
    event.preventDefault();
    useMouse = true;
    viewPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    viewPosition.y = (event.clientY / window.innerHeight) * 2 - 1;
}

function onClick(event: MouseEvent) {
    console.log((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1)
}

function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
        event.preventDefault();
        useMouse = false;
        var nextTarget = camSys.nextTarget()
        viewPosition.x = nextTarget.x;
        viewPosition.y = nextTarget.y;
    }
}

function render() {
    renderer.render(scene, camSys.camera);

    camSys.moveCamera(viewPosition);
}

renderer.setAnimationLoop(render);