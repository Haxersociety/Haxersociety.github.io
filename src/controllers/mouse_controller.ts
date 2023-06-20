import { Camera, Mesh, Raycaster, Scene, Vector2 } from "three";
import { SelectionUtils } from "../utils/selection_utils";
import { GRAPH_CONTAINER_NAME } from "../utils/constants";

export class MouseController {
  domElement: HTMLElement;
  scene: Scene;
  camera: Camera;
  selectionUtils: SelectionUtils;
  pointer: Vector2;
  raycaster: Raycaster;

  constructor(domElement: HTMLElement, scene: Scene, camera: Camera) {
    this.domElement = domElement;
    this.scene = scene;
    this.camera = camera;
    this.selectionUtils = new SelectionUtils(this.scene);
    this.pointer = new Vector2();
    this.raycaster = new Raycaster();
    this.activate();
  }

  activate() {
    this.domElement.addEventListener("mousemove", this.mouseMove);
    this.domElement.addEventListener("mouseup", this.mouseUp);
  }

  deactivate() {
    this.domElement.removeEventListener("mousemove", this.mouseMove);
  }

  mouseMove = (event: MouseEvent) => {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    const intersect = this.getIntersectedObject();
    if (intersect) this.selectionUtils.preSelectObject(<Mesh>intersect.object);
    else this.selectionUtils.unPreSelect();
  };

  mouseUp = (event: MouseEvent) => {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    const intersect = this.getIntersectedObject();
    if (intersect) this.selectionUtils.selectObject(<Mesh>intersect.object);
    else this.selectionUtils.unSelect();
  };

  getIntersectedObject() {
    const meshes = [];
    this.scene.children
      .find((obj) => obj.name === GRAPH_CONTAINER_NAME)
      .traverse((object) => {
        if (object instanceof Mesh) meshes.push(object);
      });
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.raycaster
      .intersectObjects(meshes)
      .find(
        (object) =>
          object.object instanceof Mesh && object.object.userData.isIntersected
      );
  }
}
