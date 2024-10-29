import * as THREE from 'three';
import { degToRad} from 'three/src/math/MathUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import CustomOrbitCam from './cameraSystem';

// const debug = document.getElementById('debug');
var useMouse = true;
var isHome = true;

const viewPosition = new THREE.Vector2();
const scene = new THREE.Scene();
const loader = new GLTFLoader();
// scene.background = new THREE.Color(0xbbbbb7);

addEventListener('mousemove', onMouseMove, false);
addEventListener('mousedown', onClick, false)
addEventListener('keydown', onKeyDown, false)

const titleBlock = document.getElementById("title-block")
if (titleBlock) {
    titleBlock.onclick = returnHome
}

for (let i = 0; i < 3; i++) {
    const btn = document.getElementById(`home-button-${i}`)
    if (btn) {
        btn.onclick = returnHome
    }
}

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camSys = new CustomOrbitCam(scene);
camSys.targets = [
    new THREE.Vector2(-0.5791666667, -0.2620967742),
    new THREE.Vector2(0.053125, 0.524193548),
    new THREE.Vector2(0.4072916667, -0.435483871)   
]
camSys.setupMarkers()

const sky = new THREE.AmbientLight(0xafcfff, 1);
const light1 = new THREE.DirectionalLight(0xffefdf, 5);
light1.position.set(5, 10, 3);
const light2 = new THREE.DirectionalLight(0xffefdf, 5);
light2.position.set(-8, -3, 0);
const light3 = new THREE.DirectionalLight(0xffefdf, 5);
light3.position.set(10, 0, -5);

scene.add(sky);
scene.add(light1);
scene.add(light2);
scene.add(light3);

loader.load( 'full_1.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

export function returnHome() {
    if (!isHome) {
        const targetMarkContainer = document.getElementById('target-container');
        targetMarkContainer?.classList.remove('hidden');
        const contentPanels = document.getElementsByClassName('content-panel')
        for (let i = 0; i < contentPanels.length; i++) {
            contentPanels[i].classList.add('hidden')
        }
        camSys.panHome();
        isHome = true;
    }
}

function onMouseMove(event: MouseEvent) {
    event.preventDefault();
    useMouse = true;
    viewPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    viewPosition.y = (event.clientY / window.innerHeight) * 2 - 1;
}

function onClick(event: MouseEvent) {
    // console.log((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1)
    if (camSys.onClick()) {
        isHome = false;
    }
}

function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
        event.preventDefault();
        useMouse = false;
        var nextTarget = camSys.nextTarget()
        viewPosition.x = nextTarget.x;
        viewPosition.y = nextTarget.y;
    } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        camSys.onClick();
        isHome = false;
    } else if (event.key === 'Escape' || event.key === 'Backspace') {
        returnHome();
    }
}

function render() {
    renderer.render(scene, camSys.camera);

    camSys.moveCamera(viewPosition);
}

renderer.setAnimationLoop(render);