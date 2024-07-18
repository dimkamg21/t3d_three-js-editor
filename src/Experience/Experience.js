import * as THREE from 'three';
import Time from './Utils/Time';
import Sizes from './Utils/Sizes';
import World from './World/World';
import Camera from './Camera/Camera';
import Resources from './Utils/Resources';
import Renderer from './Renderer/Renderer';

let instance = null;

class Experience {
    constructor(_canvas) {
        if (instance) {
            return instance;
        }

        instance = this;

        // Options
        this.canvas = _canvas;
        this.scene = new THREE.Scene();
        this.sizes = new Sizes();
        this.time = new Time();
        this.resources = new Resources();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();

         // Resize event
         this.sizes.on('resize', () => {
            this.resizes();
        });

        // Tick event
        this.time.on('tick', () => {
            this.update();
        });
    }

    resizes() {
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        this.renderer.update();
        this.camera.update();
        this.world.update();
    }
}

export default Experience;