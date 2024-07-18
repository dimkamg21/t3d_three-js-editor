import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from '../Experience';
import EventEmitter from '../Utils/EventEmitter';

export default class Camera extends EventEmitter {
    constructor() {
        super();

        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setInstance();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            75, this.sizes.width / this.sizes.height, 0.1, 200
        );

        this.instance.position.set(0, 3, 10);
        this.scene.add(this.instance);

        this.orbitControls = new OrbitControls(this.instance, this.canvas);
        this.orbitControls.enableDamping = true;
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        this.orbitControls.update();
    }
}
