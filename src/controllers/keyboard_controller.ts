import { Scene } from "three";

export class KeyboardController {
  domElement: HTMLElement;
  scene: Scene;

  constructor(domElement: HTMLElement, scene: Scene) {
    this.domElement = domElement;
    this.scene = scene;
    this.activate();
  }

  activate() {
    this.domElement.addEventListener("keyup", this.keyUp);
  }

  deactivate() {
    this.domElement.removeEventListener("keyup", this.keyUp);
  }

  keyUp = (event: KeyboardEvent) => {};
}
