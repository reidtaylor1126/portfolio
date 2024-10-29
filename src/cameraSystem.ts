import * as THREE from 'three';

class CustomOrbitCam {
    camera: THREE.Camera;
    base: THREE.Object3D;
    elevator: THREE.Object3D;
    lerpSpeed: number = 0.15;
    snapThreshold: number = 100;
    targets: Array<THREE.Vector2> = [];
    targetIndex: number = -1;
    targetMarkers: Array<Element> = [];
    hoveringTarget: boolean = false;
    linksEnabled: boolean = true;
    panTo: number = 0;
    panFrom: number = 0;
    panStart: number = -1;
    panEnd: number = -1;

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

    setupMarkers(): void {
        const targetMarkContainer = document.getElementById('target-container')
        this.targets.map((target) => {
            const targetMark = document.createElement("div");
            this.configureMarker(targetMark, target, false);
            targetMarkContainer?.appendChild(targetMark);
            this.targetMarkers.push(targetMark);
        })
    }

    configureMarker(marker: Element, target: THREE.Vector2, selected: boolean): void {
        const width = this.snapThreshold*0.5
        marker.className = 'nav-target'
        const x = (window.innerWidth * (target.x+1) / 2) - width;
        const y = (window.innerHeight * (target.y + 1) / 2) - width;
        if (selected) {
            marker.setAttribute('style', `left: ${x}px; top: ${y}px; width: ${width*2}px; height: ${width*2}px; margin: 0px`);
        } else {
            marker.setAttribute('style', `left: ${x}px; top: ${y}px; width: ${width}px; height: ${width}px; margin: ${width/2}px;`);
        }
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
                if (!this.hoveringTarget) {
                    this.configureMarker(this.targetMarkers[index], target, true);
                    this.hoveringTarget = true;
                }
                this.targetIndex = index;
            } else {
                this.configureMarker(this.targetMarkers[index], target, false);
            }
        })
    
        if (!nearTarget) {
            goal.y = -position.x*1.5;
            goal.x = -position.y;
            this.hoveringTarget = false;
        }
        
        this.elevator.rotation.x = this.lerpSpeed * goal.x + (1-this.lerpSpeed) * this.elevator.rotation.x;
        this.base.rotation.y = this.lerpSpeed * goal.y + (1-this.lerpSpeed) * this.base.rotation.y;

        this.panCamera(this.panFrom, this.panTo, this.panStart, this.panEnd);
    }

    panCamera(startRotation: number, targetRotation: number, startTime: number, endTime: number) {
        const currentTime = new Date().getTime();
        if (currentTime < endTime) {
            const t = -(Math.cos(Math.PI * ((currentTime-startTime)/(endTime-startTime))) - 1) / 2
            this.camera.rotation.x = ((targetRotation - startRotation) * t)+startRotation;
        }
    }

    nextTarget(): THREE.Vector2 {
        this.configureMarker(this.targetMarkers[Math.max(0, this.targetIndex)], this.targets[Math.max(0, this.targetIndex)], false);
        this.targetIndex = (this.targetIndex + 1) % this.targets.length;
        this.configureMarker(this.targetMarkers[this.targetIndex], this.targets[this.targetIndex], true);
        this.hoveringTarget = true;
        return this.targets[this.targetIndex];
    }

    panAway(): void {
        this.panStart = new Date().getTime();
        this.panEnd = this.panStart + 500;
        this.panFrom = 0;
        this.panTo = -1;
        this.linksEnabled = false;
    }

    panHome(): void {
        this.panStart = new Date().getTime();
        this.panEnd = this.panStart + 500;
        this.panFrom = -1;
        this.panTo = 0;
        this.linksEnabled = true;
    }

    onClick(): boolean {
        if (this.hoveringTarget && this.linksEnabled) {
            const targetMarkContainer = document.getElementById('target-container');
            targetMarkContainer?.classList.add('hidden');
            const contentPanel = document.getElementById(`content-${this.targetIndex}`);
            contentPanel?.classList.remove('hidden');
            this.panAway();
            return true;
        }
        return false;
    }
}

export default CustomOrbitCam;