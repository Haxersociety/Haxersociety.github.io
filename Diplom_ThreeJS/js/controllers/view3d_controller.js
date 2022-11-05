import * as THREE from "../three/build/three.module.js";
import {OrbitControls} from "../three/examples/jsm/controls/OrbitControls.js";
import {FontLoader} from "../three/examples/jsm/loaders/FontLoader.js";
import {Controller} from "../controller.js";
import {SCREENS} from "../constants.js"
import {ThreeSimpleFigure} from "../helpers/ThreeSimpleFigure.js";

export class View3d_controller extends Controller {

    intersected_object

    init() {

        this.scene = new THREE.Scene();

        const r = 'textures/background/default/'
        const urls = [
            r + 'px.jpg', r + 'nx.jpg',
            r + 'py.jpg', r + 'ny.jpg',
            r + 'pz.jpg', r + 'nz.jpg'
        ];

        const textureCube = new THREE.CubeTextureLoader().load(urls);
        textureCube.mapping = THREE.CubeRefractionMapping;

        this.scene.background = textureCube;


        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.position.set(-200, 50, 200);

        // controls

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.listenToKeyEvents(window); // optional

        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.05;

        this.controls.screenSpacePanning = false;

        this.controls.minDistance = 100;
        this.controls.maxDistance = 500;

        this.controls.maxPolarAngle = Math.PI / 2;

        this.generateWorld()

        this.generateLight()

        const loader = new FontLoader();
        loader.load('fonts/droid.typeface.json',
            (response) => {
                // do something with the font
                this.font = response;
                this.updateText()
            });

        this.textGroup = new THREE.Group()

        this.panel = SCREENS.MAIN_MENU

        this.scene.add(this.textGroup)

        this.raycaster = new THREE.Raycaster();

        this.pointer = new THREE.Vector2()

        this.initListeners()

    }

    initListeners() {
        let onPointerDown = (event) => {
            this.onPointerDown(event)
        }
        let onPointerMove = (event) => {
            this.onPointerMove(event)
        }
        let resize = () => {
            this.resize()
        }

        window.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('resize', resize);
    }

    onPointerDown(event) {

        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {

            const object = intersects[0].object;
            object.onclick && object.onclick()
            this.render();

        }

    }

    onPointerMove(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    resize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    update() {

        this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
        this.render();

    }

    render() {
        this.raycaster.setFromCamera(this.pointer, this.camera);
        //Метод проверки выделенных объектов
        this.updateIntersect()
        this.renderer.render(this.scene, this.camera);

    }

    getMainMenu() {
        let meshes = []

        let download_data_group = this.getTextWithBox({
            text: 'Загрузить данные',
        })

        download_data_group.onclick = () => {
            //TODO При нажатии на загрузить данные открывать окно с выбором xls документа
        }
        download_data_group.mouseenter = () => {
            this.engine.data.createInputElement()
        }
        download_data_group.mouseleave = () => {
            this.engine.data.deleteInputElement()
        }

        meshes.push(download_data_group)
        return meshes
    }

    updateText() {
        this.textGroup.clear()
        switch (this.panel) {
            case SCREENS.MAIN_MENU:
                let meshes = this.getMainMenu()
                for (let mesh of meshes)
                    this.textGroup.add(mesh)
                break
        }
    }

    //#region Generate

    generateWorld() {
        const geometry = new THREE.PlaneGeometry(1000, 1000);
        const material = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
        const plane = new THREE.Mesh(geometry, material);
        plane.rotateX(Math.PI / 2)
        plane.position.set(0, -13, 0)
        this.scene.add(plane);

        const helper = new THREE.GridHelper(1000, 30);
        helper.position.set(0, -13, 0)
        this.scene.add(helper);
    }

    generateLight() {

        const dirLight1 = new THREE.DirectionalLight(0xffffff);
        dirLight1.position.set(1, 1, 1);
        this.scene.add(dirLight1);

        const ambientLight = new THREE.AmbientLight(0x222222);
        this.scene.add(ambientLight);

    }

    //#endregion

    getSizeObject(object) {
        let modelBoundingBox;

        modelBoundingBox = new THREE.Box3().setFromObject(object);
        modelBoundingBox.size = {};
        modelBoundingBox.size.x = modelBoundingBox.max.x - modelBoundingBox.min.x;
        modelBoundingBox.size.y = modelBoundingBox.max.y - modelBoundingBox.min.y;
        modelBoundingBox.size.z = modelBoundingBox.max.z - modelBoundingBox.min.z;

        return modelBoundingBox.size
    }

    getTextWithBox(params) {
        let text = params.text || 'Текст без названия';
        let font = params.font || this.font;
        let color = params.color || 0xffffff;
        let text_position = params.text_position || {x: 0, y: 0, z: 0}
        let text_anchor = params.text_anchor || 1 // 0 - left, 1 - middle, 2 - right;

        let text_geometry = ThreeSimpleFigure.getTextGeometry({
            text,
            font,
        })
        let text_mesh = new THREE.Mesh(text_geometry, new THREE.MeshPhongMaterial({color, flatShading: true}));

        let size = this.getSizeObject(text_mesh);

        text_mesh.position.x = text_position.x + text_anchor === 1 ? -size.x / 2 : !text_anchor ? 0 : -size.x
        text_mesh.position.y = text_position.y
        text_mesh.position.z = text_position.z


        let box_geometry = ThreeSimpleFigure.getBoxGeometry({
            width: size.x,
            height: size.y,
            depth: size.z,
        })
        let box_mesh = new THREE.Mesh(box_geometry, new THREE.MeshPhongMaterial({color, flatShading: true}));
        box_mesh.material.transparent = true
        box_mesh.material.opacity = 0

        box_mesh.position.x = text_position.x
        box_mesh.position.y = text_position.y + 10.5
        box_mesh.position.z = text_position.z + 2.5


        let group_mesh = new THREE.Group()
        group_mesh.add(text_mesh)
        group_mesh.add(box_mesh)

        return group_mesh

    }

    //#region Update Intersects

    updateIntersect() {
        switch (this.panel) {
            case SCREENS.MAIN_MENU:
                this.updateMainMenuIntersect()
                break
        }
    }

    updateMainMenuIntersect() {
        const intersects = this.raycaster.intersectObjects(this.textGroup.children);

        if (intersects.length > 0) {

            if (this.intersected_object?.parent !== intersects[0].object.parent) {

                if (this.intersected_object) this.intersected_object.material.emissive.setHex(this.intersected_object.currentHex);

                this.intersected_object = intersects[0].object;
                this.intersected_object.parent.children[0].currentHex = this.intersected_object.material.emissive.getHex();
                this.intersected_object.parent.children[0].material.emissive.setHex(0x444220);
                this.intersected_object.parent.mouseenter && this.intersected_object.parent.mouseenter()


            }

        } else {

            if (this.intersected_object) {
                this.intersected_object.parent.mouseleave && this.intersected_object.parent.mouseleave()
                this.intersected_object.parent.children[0].material.emissive.setHex(this.intersected_object.parent.children[0].currentHex);
                this.intersected_object = null;
            }

        }
    }

    //#endregion

}