import Experience from '../Experience';
import Pointer from '../Pointer/Pointer';
import Environment from './Environment';
import Floor from './Floor';

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        
        this.pointer = new Pointer();

        this.environment = new Environment();
        this.floor = new Floor();

        this.addLoadedModels();
    }

    addLoadedModels() {
        this.resources.on('ready', ({ name, file }) => {
            const sceneToAdd = file.scene || file;
            this.scene.add(sceneToAdd);
            
            const modelInScene = this.scene.children.includes(sceneToAdd);
                
            if (modelInScene) {
                const noModelLi = document.getElementById('no-model');
                if (noModelLi) {
                    noModelLi.remove();
                }
    
                const ul = document.querySelector('.scene_models');
                const li = document.createElement('li');
                li.textContent = name;
                ul.appendChild(li);
    
                this.pointer.objectsToIntersect.push(sceneToAdd);
            }
        });
    }
    

    update() {
        this.pointer.update();
    }
}
