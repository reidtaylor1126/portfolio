import * as THREE from 'three';

class CustomOrbitCam {
    camera: THREE.Camera;
    base: THREE.Object3D;
    elevator: THREE.Object3D;
    lerpSpeed: number = 0.25
    targets: Array<THREE.Vector2> = [];

    constructor(scene: THREE.Scene) {
        this.base = new THREE.Object3D();
        scene.add(this.base);
        this.elevator = new THREE.Object3D();
        scene.add(this.elevator);
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
        
        this.camera.position.z = 10;

        this.elevator.parent = this.base;
        this.base.children.push(this.elevator);
        this.camera.parent = this.elevator;
        this.elevator.children.push(this.camera);
    }

    moveCamera(mousePosition: THREE.Vector2): void {
    
        var nearTarget = false;
        var goal = new THREE.Vector2();
    
        this.targets.map(target => {
            if (target.distanceTo(mousePosition) < 0.1) {
                goal.x = -target.y;
                goal.y = -target.x*1.5;
                nearTarget = true;
            }
        })
    
        if (!nearTarget) {
            goal.y = -mousePosition.x*1.5;
            goal.x = -mousePosition.y;
        }
        
        this.elevator.rotation.x = this.lerpSpeed * goal.x + (1-this.lerpSpeed) * this.elevator.rotation.x;
        this.base.rotation.y = this.lerpSpeed * goal.y + (1-this.lerpSpeed) * this.base.rotation.y;
    }
}

export default CustomOrbitCam;