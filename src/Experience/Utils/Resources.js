import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import EventEmitter from './EventEmitter.js';

export default class Resources extends EventEmitter {
    constructor() {
        super();

        // Setup
        this.items = {};
        this.loaded = 0;

        this.setLoaders();
        this.setupInputModelListener();
        this.setupInputMapListener();
    }

    setLoaders() {
        this.loaders = {};
        this.loaders.fbxLoader = new FBXLoader();
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
    }

    setupInputModelListener() {
        const input = document.getElementById('file');
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const extension = file.name.split('.').pop().toLowerCase();

                const url = URL.createObjectURL(file);

                if (extension === 'glb' || extension === 'gltf') {
                    this.loadModel(url, 'gltfModel', file.name);
                } else if (extension === 'fbx') {
                    this.loadModel(url, 'fbxModel', file.name);
                } else {
                    alert('Unsupported file format');
                    console.error('Unsupported file format');
                }
            }
        });
    }

    setupInputMapListener() {
        const input = document.getElementById('mapFile');
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                
                this.loadModel(url, 'texture', file.name);
            }
        });
    }

    loadModel(url, type, name) {
        if (type === 'gltfModel') {
            this.loaders.gltfLoader.load(
                url,
                (file) => {
                    this.sourceLoaded({ name, type }, file);
                },
                undefined,
                (error) => {
                    console.error('An error happened while loading GLTF model:', error);
                }
            );
        } else if (type === 'fbxModel') {
            this.loaders.fbxLoader.load(
                url,
                (file) => {
                    this.sourceLoaded({ name, type }, file);
                },
                undefined,
                (error) => {
                    console.error('An error happened while loading FBX model:', error);
                }
            );
        } 
    }

    sourceLoaded(source, file) {
        let uniqueName = source.name;
        let count = 1;
        while (this.items[uniqueName]) {
            uniqueName = `copy${count}_${source.name}`;
            count++;
        }
        this.items[uniqueName] = file;
        this.loaded++;

        this.trigger('ready', [{ name: uniqueName, file }]);
    }
}
