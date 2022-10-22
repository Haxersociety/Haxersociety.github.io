import * as THREE from "../three/build/three.module.js";
import {OrbitControls} from "../three/examples/jsm/controls/OrbitControls.js";
import {TextGeometry} from "../three/examples/jsm/geometries/TextGeometry.js";
import {FontLoader} from "../three/examples/jsm/loaders/FontLoader.js";
import {Controller} from "../controller.js";
import {SCREENS} from "../constants.js"

export class View3d_controller extends Controller {

    init() {

        this.scene = new THREE.Scene();

        const r = 'textures/background/default/'
        const urls = [
            r + 'px.jpg', r + 'nx.jpg',
            r + 'py.jpg', r + 'ny.jpg',
            r + 'pz.jpg', r + 'nz.jpg'
        ];

        const textureCube = new THREE.CubeTextureLoader().load( urls );
        textureCube.mapping = THREE.CubeRefractionMapping;

        this.scene.background = textureCube;


        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.position.set(400, 200, 0);

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

        window.addEventListener('resize', this.onWindowResize);

        const loader = new FontLoader();
        loader.load('fonts/droid.typeface.json',
            ( response ) => {
                // do something with the font
                this.font = response;
                this.updateText()
            });

        this.textGroup = new THREE.Group()

        this.panel = SCREENS.MAIN_MENU

        this.scene.add(this.textGroup)

        this.raycaster = new THREE.Raycaster();

        this.pointer = new THREE.Vector2()

        let onPointerDown = (event) => {
            this.onPointerDown(event)
        }

        let onPointerMove = (event) => {
            this.onPointerMove(event)
        }

        window.addEventListener( 'pointerdown', onPointerDown );

        window.addEventListener( 'pointermove', onPointerMove );

    }

    onPointerDown(event) {

        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.raycaster.setFromCamera( this.pointer, this.camera );
        const intersects = this.raycaster.intersectObjects( this.scene.children );
        if ( intersects.length > 0 ) {

            const object = intersects[ 0 ].object;
            object.onclick && object.onclick()
            this.render();

        }

    }

    onPointerMove(event) {
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    update() {

        this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
        this.render();

    }

    render() {

        // update the picking ray with the camera and pointer position
        this.raycaster.setFromCamera( this.pointer, this.camera );

        //console.log(this.textGroup.children)

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects( this.textGroup.children );

        for ( let i = 0; i < intersects.length; i ++ ) {

            //console.log(intersects[i])

            //intersects[ i ].object.material.color.set( 0xff0000 );

        }

        this.renderer.render(this.scene, this.camera);

    }

    getMainMenu() {
        let materials = [
            new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
        ];

        let meshes = []

        let download_data_button_geometry = new TextGeometry('Загрузить данные', {
            font: this.font,
            size: 30,
            height: 5,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 5
        })
        let download_data_button_mesh = new THREE.Mesh(download_data_button_geometry, materials);

        download_data_button_mesh.position.x = 0
        download_data_button_mesh.position.y = 0;
        download_data_button_mesh.position.z = 0

        download_data_button_mesh.onclick = () => {
            let randomColor = Math.floor(Math.random()*16777215).toString(16)
            download_data_button_mesh.material = [
                new THREE.MeshPhongMaterial( { color: '#' + randomColor, flatShading: true } ), // front
                new THREE.MeshPhongMaterial( { color: '#' + randomColor } ) // side
            ]
        }

        meshes.push(download_data_button_mesh)
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
        const geometry = new THREE.PlaneGeometry( 1000, 1000 );
        const material = new THREE.MeshPhongMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );
        plane.rotateX(Math.PI / 2)
        plane.position.set(0, -15, 0)
        this.scene.add(plane);
    }

    generateLight() {

        const dirLight1 = new THREE.DirectionalLight(0xffffff);
        dirLight1.position.set(1, 1, 1);
        this.scene.add(dirLight1);

        const ambientLight = new THREE.AmbientLight(0x222222);
        this.scene.add(ambientLight);

    }

    //#endregion

}