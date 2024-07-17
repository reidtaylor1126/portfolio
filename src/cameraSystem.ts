import * as THREE from 'three';

class CustomOrbitCam {
    camera: THREE.Camera;
    base: THREE.Object3D;
    elevator: THREE.Object3D;
    lerpSpeed: number = 0.25
    snapThreshold: number = 100;
    targets: Array<THREE.Vector2> = [];
    targetIndex: number = -1;

    constructor(scene: THREE.Scene) {
        this.base = new THREE.Object3D();
        scene.add(this.base);
        this.elevator = new THREE.Object3D();
        scene.add(this.elevator);
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
        
        this.camera.position.z = 7.5;

        this.elevator.parent = this.base;
        this.base.children.push(this.elevator);
        this.camera.parent = this.elevator;
        this.elevator.children.push(this.camera);
    }

    moveCamera(position: THREE.Vector2): void {
    
        var nearTarget = false;
        var goal = new THREE.Vector2();
    
        this.targets.map((target, index) => {
            const targetNormalized = new THREE.Vector2(target.x * window.innerWidth, target.y * window.innerHeight)
            const positionNormalized = new THREE.Vector2(position.x * window.innerWidth , position.y * window.innerHeight)
            if (targetNormalized.distanceTo(positionNormalized) < this.snapThreshold) {
                goal.x = -target.y;
                goal.y = -target.x*1.5;
                nearTarget = true;
                this.targetIndex = index;
            }
        })
    
        if (!nearTarget) {
            goal.y = -position.x*1.5;
            goal.x = -position.y;
        }
        
        this.elevator.rotation.x = this.lerpSpeed * goal.x + (1-this.lerpSpeed) * this.elevator.rotation.x;
        this.base.rotation.y = this.lerpSpeed * goal.y + (1-this.lerpSpeed) * this.base.rotation.y;
    }

    nextTarget(): THREE.Vector2 {
        this.targetIndex = (this.targetIndex + 1) % this.targets.length;
        return this.targets[this.targetIndex];
    }
}

export default CustomOrbitCam;