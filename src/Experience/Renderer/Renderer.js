import * as THREE from 'three';
import Experience from '../Experience';

export default class Renderer {
    constructor() {
        this.experience = new Experience();
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera;
        this.scene = this.experience.scene;
       
        this.setInstance();
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })

        this.instance.toneMapping = THREE.CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        this.instance.setClearColor('#bdbdbd');
        this.instance.setSize(this.sizes.width - 250, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    resize() {
        this.instance.setSize(this.sizes.width - 250, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        this.instance.render(this.scene, this.camera.instance);
    }
}