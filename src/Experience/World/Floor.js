import * as THREE from 'three';
import Experience from '../Experience';

export default class Floor {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        // this.setFloor();
        this.setHelper();
        // this.scene.add(new THREE.GridHelper(30, 20, 0x888888, 0x444444));
    }

    setFloor() {
        this.geometry = new THREE.PlaneGeometry(20, 20, 20, 20);
        this.material =  new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.2 } );
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.y = -1

        this.mesh.rotateX(- Math.PI * 0.5);
    }

    setHelper() {
        this.helper = new THREE.GridHelper( 30, 20 );
        this.helper.material.transparent = true;
        this.helper.material.opacity = 0.25;
        this.scene.add( this.helper );
    }
}
