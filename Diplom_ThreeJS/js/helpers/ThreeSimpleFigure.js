import {TextGeometry} from "../three/examples/jsm/geometries/TextGeometry.js";
import * as THREE from "../three/build/three.module.js";

export class ThreeSimpleFigure {

    static getTextGeometry(params) {
        let font = params.font
        let text = params.text || 'Hello World!!!'
        let size = params.size || 30
        let height = params.height || 5
        let curveSegments = params.curveSegments || 5
        let bevelEnabled = params.bevelEnabled || true
        let bevelThickness = params.bevelThickness || 1
        let bevelSize = params.bevelSize || 1
        let bevelOffset = params.bevelOffset || 0
        let bevelSegments = params.bevelSize || 5

        return new TextGeometry(text, {
            font, size, height, curveSegments,
            bevelEnabled, bevelThickness, bevelSize, bevelOffset, bevelSegments
        })
    }

    static getBoxGeometry(params) {
        let width = params.width || 100
        let height = params.height || 100
        let depth = params.depth || 100

        return new THREE.BoxGeometry( width, height, depth );
    }

}