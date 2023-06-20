import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer, } from "three";
export class App {
    constructor() {
        this.initScene();
        this.initCamera();
        this.initRender();
        console.log("++");
    }
    initRender() {
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }
    initScene() {
        this.scene = new Scene();
        const geometry = new BoxGeometry();
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new Mesh(geometry, material);
        this.scene.add(cube);
    }
    initCamera() {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    }
    update() {
        this.renderer.render(this.scene, this.camera);
    }
}
// Создаем геометрию и материал для куба
//# sourceMappingURL=app.js.map