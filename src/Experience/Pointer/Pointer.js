import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import Experience from '../Experience';

const modelSetup = document.querySelector('div.model_setup');
const colorInput = document.getElementById('color');
const opacityInput = document.getElementById('opacity');
const metalnessInput = document.getElementById('metalness');
const roughnessInput = document.getElementById('roughness');
const mapInput = document.getElementById('mapFile');
const normalMapInput = document.getElementById('normalMapFile');
const envModelInput = document.getElementById('model_envMapFile');


export default class Pointer {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;
        this.orbitControls = this.experience.camera.orbitControls;

        // pointer
        this.instance = new THREE.Vector2();
        this.objectsToIntersect = [];
        this.raycaster = new THREE.Raycaster();

        this.activeModel = null;
        this.boxHelper = null;

        this.rgbeLoader = new RGBELoader();

        this.transformControls = new TransformControls(this.camera.instance, this.canvas);
        this.scene.add(this.transformControls);

        window.addEventListener('click', (e) => this.onClick(e));

        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.orbitControls.enabled = !event.value;
        });

        this.addInputListeners();
    }

    onClick(event) {
        this.onPointerMove(event);

        const rect = this.canvas.getBoundingClientRect();

        const isClickInsideCanvas = (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );

        if (!isClickInsideCanvas) return;

        this.raycaster.setFromCamera(this.instance, this.camera.instance);

        this.intersects = this.raycaster.intersectObjects(this.objectsToIntersect, true);

        if (this.intersects.length) {
            const selectedObject = this.intersects[0].object;
    
            this.setActiveObject(selectedObject);

        } else {
            if (this.boxHelper) {
                this.scene.remove(this.boxHelper);
                this.boxHelper = null;
                this.activeModel = null;
                modelSetup.classList.add('hidden');
            }

            this.transformControls.detach();
        }
    }

    onPointerMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        
        this.instance.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.instance.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    setActiveObject(object) {
        if (this.activeModel !== object) {
            if (this.boxHelper) {
                this.scene.remove(this.boxHelper);
                this.boxHelper = null;
                this.activeModel = null;
                modelSetup.classList.add('hiiden');
            }

            this.activeModel = object;
            this.activeModel.material.transparent = true;

            this.transformControls.attach(this.activeModel);

            this.boxHelper = new THREE.BoxHelper(this.activeModel, 0xd9d95d);
            this.scene.add(this.boxHelper);

            this.editModelParams();
        }
    }

    editModelParams() {
        modelSetup.classList.remove('hidden');

        if (this.activeModel.material) {
            colorInput.value = `#${this.activeModel.material.color.getHexString()}`;
            opacityInput.value = this.activeModel.material.opacity;
            metalnessInput.value = this.activeModel.material.metalness;
            roughnessInput.value = this.activeModel.material.roughness;
        }
    }

    addInputListeners() {
        colorInput.addEventListener('input', (event) => {
            if (this.activeModel && this.activeModel.material) {
                this.activeModel.material.color.set(event.target.value);
            }
        });

        opacityInput.addEventListener('input', (event) => {
            if (this.activeModel && this.activeModel.material) {
                this.activeModel.material.opacity = event.target.value;
                this.activeModel.material.needsUpdate = true;
            }
        });

        metalnessInput.addEventListener('input', (event) => {
            if (this.activeModel && this.activeModel.material) {
                this.activeModel.material.metalness = event.target.value;
                this.activeModel.material.needsUpdate = true;
            }
        });

        roughnessInput.addEventListener('input', (event) => {
            if (this.activeModel && this.activeModel.material) {
                this.activeModel.material.roughness = event.target.value;
                this.activeModel.material.needsUpdate = true;
            }
        });

        mapInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && this.activeModel && this.activeModel.material) {
                const url = URL.createObjectURL(file);
                new THREE.TextureLoader().load(url, (texture) => {
                    this.activeModel.material.map = texture;
                    this.activeModel.material.needsUpdate = true;
                });
            }
        });

        normalMapInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && this.activeModel && this.activeModel.material) {
                const url = URL.createObjectURL(file);
                new THREE.TextureLoader().load(url, (texture) => {
                    this.activeModel.material.normalMap = texture;
                    this.activeModel.material.needsUpdate = true;
                });
            }
        });

        envModelInput.addEventListener('change', (event) => {
            const file = event.target.files[0];

            if (file && this.activeModel && this.activeModel.material) {
                const url = URL.createObjectURL(file);

                this.rgbeLoader.load(url, (environmentMap) =>{
                    console.log(environmentMap);
                    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
        

                    this.activeModel.material.envMap = environmentMap;
                    this.activeModel.material.needsUpdate = true;

                })
            }
        });
    }

    update() {
        if (this.boxHelper) {
            this.boxHelper.update();
        }
    }
}
