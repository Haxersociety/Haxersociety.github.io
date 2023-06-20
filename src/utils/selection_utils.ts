import { Material, Mesh, MeshStandardMaterial } from "three";
import { Text } from "troika-three-text";

export class SelectionUtils {
  preSelectedMesh: Mesh;
  preSelectedMeshMaterial: Material | Material[];
  preSelectMaterial = new MeshStandardMaterial({ color: 0xffa500 });

  selectedMesh: Mesh;
  selectedMeshMaterial: Material | Material[];
  selectMaterial = new MeshStandardMaterial({ color: 0xff1111 });

  text: Text;

  constructor(scene) {
    this.text = new Text();
    this.text.anchorX = "right";
    this.text.anchorY = "bottom";
    this.text.color = 0x0000aa;
    this.text.fontSize = 0.5;
    scene.add(this.text);
  }

  preSelectObject(object: Mesh) {
    if (object) {
      if (this.preSelectedMesh !== object) {
        if (this.preSelectedMesh)
          this.preSelectedMesh.material = this.preSelectedMeshMaterial;
        this.preSelectedMesh = object;
        if (!this.selectedMesh || this.selectedMesh !== this.preSelectedMesh)
          this.preSelectedMeshMaterial = object.material;
        object.material = this.preSelectMaterial;
      }
    } else {
      this.unPreSelect();
    }
  }

  unPreSelect() {
    if (this.preSelectedMesh) {
      if (!this.selectedMesh || this.preSelectedMesh !== this.selectedMesh) {
        this.preSelectedMesh.material = this.preSelectedMeshMaterial;
      } else {
        this.preSelectedMesh.material = this.selectMaterial;
      }
    }
    this.preSelectedMesh = null;
  }

  selectObject(object: Mesh) {
    if (object) {
      if (this.selectedMesh !== object) {
        if (this.selectedMesh)
          this.selectedMesh.material = this.selectedMeshMaterial;
        this.selectedMesh = object;
        this.selectedMeshMaterial = this.preSelectedMeshMaterial;
        object.material = this.selectMaterial;
        this.text.text = object.userData.textForClue || '';
        this.text.position.x = object.position.x - 0.2;
        this.text.position.y = object.position.y + 0.2;
        this.text.position.z = object.position.z;
        this.text.visible = true;
        this.text.sync();
      }
    } else {
      this.unSelect();
    }
  }

  unSelect() {
    if (this.selectedMesh)
      this.selectedMesh.material = this.selectedMeshMaterial;
    this.selectedMesh = null;
    this.text.visible = false;
    this.text.sync();
  }
}
