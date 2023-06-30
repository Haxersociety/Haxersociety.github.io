import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { Text } from "troika-three-text";

export class PrimitiveUtils {
  static getParallelepipedMesh(options) {
    const width = options.width || 1;
    const height = options.height || width;
    const depth = options.depth || width;
    const geometry = new BoxGeometry(width, height, depth);
    const material =
      options.material || new MeshStandardMaterial({ color: 0xdd3333 });
    const mesh = new Mesh(geometry, material);
    if (options.position) mesh.position.copy(options.position);
    return mesh;
  }

  static getParallelepipedWithStroke(options) {
    const group = new Group();

    const mainMesh = PrimitiveUtils.getParallelepipedMesh(options);
    group.add(mainMesh);

    const position = options.position
      ? options.position.clone()
      : new Vector3();

    const width = options.width || 1;
    const height = options.height || width;
    const depth = options.depth || width;

    position.y = 0

    const positions = [
      position.clone().add(new Vector3(width / 2, 0, depth / 2)),
      position.clone().add(new Vector3(width / 2, 0, -depth / 2)),
      position.clone().add(new Vector3(-width / 2, 0, depth / 2)),
      position.clone().add(new Vector3(-width / 2, 0, -depth / 2)),
    ];
    const optionsStroke = {
      width: 0.1,
      height: height + 0.1,
      depth: 0.1,
      material: new MeshStandardMaterial({ color: 0x000000 }),
    };

    const verticalStroke = new Group()
    verticalStroke.position.y = height / 2
    group.add(verticalStroke)

    const topStroke = new Group()
    topStroke.position.y = height
    group.add(topStroke)

    const bottomStroke = new Group()
    group.add(bottomStroke)

    for (let position of positions) {
      const meshStroke = PrimitiveUtils.getParallelepipedMesh({
        ...optionsStroke,
        position,
      });
      verticalStroke.add(meshStroke);
    }


    const topStrokeMesh1 = PrimitiveUtils.getParallelepipedMesh({
      ...optionsStroke,
      height: depth,
      position: position.clone().add(new Vector3(width / 2, 0, 0)),
    });
    topStrokeMesh1.rotateX(Math.PI / 2);
    topStroke.add(topStrokeMesh1);

    const topStrokeMesh2 = PrimitiveUtils.getParallelepipedMesh({
      ...optionsStroke,
      height: depth,
      position: position.clone().add(new Vector3(-width / 2, 0, 0)),
    });
    topStrokeMesh2.rotateX(Math.PI / 2);
    topStroke.add(topStrokeMesh2);

    const topStrokeMesh3 = PrimitiveUtils.getParallelepipedMesh({
      ...optionsStroke,
      height: width,
      position: position.clone().add(new Vector3(0, 0, depth / 2)),
    });
    topStrokeMesh3.rotateZ(Math.PI / 2);
    topStroke.add(topStrokeMesh3);

    const topStrokeMesh4 = PrimitiveUtils.getParallelepipedMesh({
      ...optionsStroke,
      height: width,
      position: position.clone().add(new Vector3(0, 0, -depth / 2)),
    });
    topStrokeMesh4.rotateZ(Math.PI / 2);
    topStroke.add(topStrokeMesh4);

    const bottomStrokeMesh1 = PrimitiveUtils.getParallelepipedMesh({
      ...optionsStroke,
      height: depth,
      position: position.clone().add(new Vector3(width / 2, 0, 0)),
    });
    bottomStrokeMesh1.rotateX(Math.PI / 2);
    bottomStroke.add(bottomStrokeMesh1);

    const bottomStrokeMesh2 = PrimitiveUtils.getParallelepipedMesh({
      ...optionsStroke,
      height: depth,
      position: position.clone().add(new Vector3(-width / 2, 0, 0)),
    });
    bottomStrokeMesh2.rotateX(Math.PI / 2);
    bottomStroke.add(bottomStrokeMesh2);

    const bottomStrokeMesh3 = PrimitiveUtils.getParallelepipedMesh({
      ...optionsStroke,
      height: width,
      position: position.clone().add(new Vector3(0, 0, depth / 2)),
    });
    bottomStrokeMesh3.rotateZ(Math.PI / 2);
    bottomStroke.add(bottomStrokeMesh3);

    const bottomStrokeMesh4 = PrimitiveUtils.getParallelepipedMesh({
      ...optionsStroke,
      height: width,
      position: position.clone().add(new Vector3(0, 0, -depth / 2)),
    });
    bottomStrokeMesh4.rotateZ(Math.PI / 2);
    bottomStroke.add(bottomStrokeMesh4);

    return group;
  }

  static getPartOfPie(options) {
    const thetaStart = options.startPart || 0;
    const thetaLength = options.lengthPart || 0;
    const radiusTop = options.radiusTop || 10;
    const radiusBottom = options.radiusBottom || 10;
    const height = options.height || 3;
    const heightSegment = options.heightSegment || 1;
    const radialSegments = options.radialSegments || thetaLength * 10;
    const openEnded = options.openEnded || false;

    console.log("radialSegments: ", radialSegments);

    const partMaterial =
      options.material ||
      new MeshStandardMaterial({ color: this.getRandomColor() });

    const partGeometry = new CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      Math.ceil(radialSegments),
      heightSegment,
      openEnded,
      thetaStart,
      thetaLength
    );

    return new Mesh(partGeometry, partMaterial);
  }

  static getText(options) {
    const text = new Text();
    text.text = options.text || "";
    text.font =
      options.font ||
      "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5g.woff";
    text.fontSize = options.fontSize || 1;
    options.position && text.position.copy(options.position);
    options.rotation && text.rotation.copy(options.rotation);
    text.anchorX = options.anchorX || "left";
    text.color = options.color || 0x000000;

    text.sync();
    return text;
  }

  static getRandomColor() {
    const chars = [6, 9, 'C', 'F']
    const num1 = chars[Math.floor(Math.random() * 4)];
    const num2 = chars[Math.floor(Math.random() * 4)];
    const num3 = num1 === 'F' || num2 === 'F' ? chars[Math.floor(Math.random() * 4)] : 'F';
    console.log(num1, num2, num3)
    return Number(`0x${num1}${num1}${num2}${num2}${num3}${num3}`)
  }
}
