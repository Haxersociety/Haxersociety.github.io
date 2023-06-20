import {
  AmbientLight,
  BackSide,
  Color,
  DirectionalLight,
  DoubleSide,
  FrontSide,
  GridHelper,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
} from "three";

import {
  MapControls,
  OrbitControls,
} from "three/examples/jsm/controls/OrbitControls";
import { MouseController } from "./controllers/mouse_controller";
import { KeyboardController } from "./controllers/keyboard_controller";
import { UIController } from "./controllers/ui_controller";
import {GRAPH_CONTAINER_NAME, GRAPH_TYPE, LOADING_XLSX_FILE} from "./utils/constants";
import { DiagramsUtils } from "./utils/diagrams_utils";

export class App {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  control: OrbitControls;
  mouseController: MouseController;
  keyboardController: KeyboardController;
  uiController: UIController;
  diagramsUtils: DiagramsUtils;
  graphContainer: Group;
  graphData: any[];

  constructor() {
    this.initScene();

    this.diagramsUtils = new DiagramsUtils();

    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.scene.add(this.camera);
    this.camera.translateZ(20);
    this.camera.translateY(20);
    this.camera.translateX(20);

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.uiController = new UIController();
    this.uiController.setCallbackDrawGraph(this.drawGraph);

    const callbacks = this.getNavigationCallbacks();
    this.uiController.setNavigationCallbacks(callbacks);
    const navigationMenu = this.uiController.getNavigationMenu();

    document.body.appendChild(navigationMenu);
    document.body.appendChild(this.renderer.domElement);

    this.control = new MapControls(this.camera, this.renderer.domElement);
    this.control.update();

    const onWindowResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize);

    this.mouseController = new MouseController(
      this.renderer.domElement,
      this.scene,
      this.camera
    );
    this.keyboardController = new KeyboardController(document.body, this.scene);
  }

  private initScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0xffffff);

    const grid = new GridHelper(500, 100);
    this.scene.add(grid);

    const planeGeometry = new PlaneGeometry(500, 500);
    const plane = new Mesh(
      planeGeometry,
      new MeshStandardMaterial({ color: 0xffffff })
    );
    plane.position.set(0, -0.01, 0);
    plane.rotateX(Math.PI / 2);
    plane.material.side = BackSide;
    plane.material.clipShadows = true;
    plane.material.flatShading = true;
    plane.visible = false;
    this.scene.add(plane);

    this.graphContainer = new Group();
    this.graphContainer.name = GRAPH_CONTAINER_NAME
    this.scene.add(this.graphContainer);

    const ambientLight = new AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const directionLight = new DirectionalLight(0xffffff, 0.4);
    directionLight.position.set(-100, 100, -100);
    directionLight.target = new Object3D();
    this.scene.add(directionLight);
  }

  public update() {
    this.control.update();
    this.renderer.render(this.scene, this.camera);
  }

  getNavigationCallbacks() {
    const map = new Map<number, Function>();
    map.set(LOADING_XLSX_FILE, (result) => {
      this.graphData = result;
    });
    return map;
  }

  drawGraph = (type) => {
    this.clearGraphs();

    switch (type) {
      case GRAPH_TYPE.BAR_GRAPH:
        this.diagramsUtils.drawBarGraph(this.graphData, this.graphContainer);
        break;
      case GRAPH_TYPE.BAR_HISTOGRAMS:
        this.diagramsUtils.drawBarHistograms(
          this.graphData,
          this.graphContainer
        );
        break;
      case GRAPH_TYPE.MULTI_AXIS_CHARTS:
        this.diagramsUtils.drawMultiAxisChart(
          this.graphData,
          this.graphContainer
        );
        break;
      case GRAPH_TYPE.LINE_CHART:
        this.diagramsUtils.drawLineChart(this.graphData, this.graphContainer);
        break;
      case GRAPH_TYPE.PIE_CHARTS:
        this.diagramsUtils.drawPieCharts(this.graphData, this.graphContainer);
        break;
    }
  };

  clearGraphs() {
    this.graphContainer.clear();
  }
}
