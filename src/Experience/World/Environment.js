import * as THREE from 'three';
import Experience from '../Experience';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const envMapInput = document.getElementById('envMapFile');

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.rgbeLoader = new RGBELoader();
        
        this.setSunLight();
        this.setAdditionalLight();
        this.addEnvInputListeners();
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3, 3, - 2.25)
        this.scene.add(this.sunLight)
    }

    setAdditionalLight() {
        this.ambientLight = new THREE.AmbientLight( 0xf0f0f0, 1.5 );
        this.scene.add(this.ambientLight)
    }

    addEnvInputListeners() {
        const envMapInput = document.getElementById('envMapFile');
        envMapInput.addEventListener('change', (event) => {
            const files = Array.from(event.target.files);

            const singleFile = files.find(file => file.name.match(/\.(hdr|jpeg|jpg|png)$/i));

            if (singleFile) {
                const url = URL.createObjectURL(singleFile);

                if (singleFile.name.match(/\.hdr$/i)) {
                    this.rgbeLoader.load(url, (environmentMap) => {
                        environmentMap.mapping = THREE.EquirectangularReflectionMapping;

                        this.applyEnvironmentMap(environmentMap);
                    });
                } else {
                    const textureLoader = new THREE.TextureLoader();
                    textureLoader.load(url, (environmentMap) => {
                        environmentMap.mapping = THREE.EquirectangularReflectionMapping;

                        this.applyEnvironmentMap(environmentMap);
                    });
                }
            } else if (files.length === 6) {
                const urls = files.map(file => URL.createObjectURL(file));
                const order = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
                const cubeMapUrls = order.map(dir => urls.find(url => url.includes(dir)));

                if (cubeMapUrls.every(url => url)) {
                    this.cubeTextureLoader.load(cubeMapUrls, (environmentMap) => {
                        environmentMap.mapping = THREE.CubeReflectionMapping;

                        this.applyEnvironmentMap(environmentMap);
                    });
                } else {
                    console.error('Please provide exactly six images with names containing "px", "nx", "py", "ny", "pz", "nz"');
                }
            } else {
                console.error('Please provide a .hdr, .jpeg, or .png file or exactly six images for the cube texture');
            }
        });
    }

    applyEnvironmentMap(environmentMap) {
        this.scene.background = environmentMap;
        this.scene.environment = environmentMap;

        if (this.activeModel && this.activeModel.material) {
            this.activeModel.material.envMap = environmentMap;
            this.activeModel.material.needsUpdate = true;
        }
    }
}
