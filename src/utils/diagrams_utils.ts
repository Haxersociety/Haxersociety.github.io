import {
  BoxGeometry,
  ConeGeometry,
  Curve,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { PrimitiveUtils } from "./primitive_utils";
import { Text } from "troika-three-text";

export class DiagramsUtils {
  drawBarGraph(data, container: Group) {
    console.log("dataBarGraph: ", data);

    const columns: string[] = [];

    for (let column in data[0]) {
      columns.push(column);
    }

    const max = Math.max(...data.map((once_data) => +once_data[columns[1]]));

    const position = new Vector3();
    const step = 3;

    for (let onceData of data) {
      const value = +onceData[columns[1]];
      const height = (10 * value) / max;
      const material = new MeshStandardMaterial({
        color: PrimitiveUtils.getRandomColor(),
      });
      const mesh = PrimitiveUtils.getParallelepipedWithStroke({
        material,
        height,
        width: step - 0.5,
        position: position.clone().add(new Vector3(0, height / 2, 0)),
      });

      container.add(mesh);
      position.add(new Vector3(step, 0, 0));
    }
  }

  drawBarHistograms(data, container) {
    console.log("dataBarHistograms: ", data);

    const columns: string[] = [];

    for (let column in data[0]) {
      columns.push(column);
    }

    const max = Math.max(...data.map((once_data) => +once_data[columns[1]]));

    const position = new Vector3();
    const step = 3;

    for (let onceData of data) {
      const value = +onceData[columns[1]];
      const height = (10 * value) / max;
      const mesh = PrimitiveUtils.getParallelepipedWithStroke({
        height,
        width: step,
        position: position.clone().add(new Vector3(0, height / 2, 0)),
      });

      container.add(mesh);
      position.add(new Vector3(step, 0, 0));
    }
  }

  drawLineChart(data, container) {
    console.log("dataLineChart: ", data);

    const columns: string[] = [];

    for (let column in data[0]) {
      columns.push(column);
    }

    const max = Math.max(...data.map((once_data) => +once_data[columns[1]]));

    const color = PrimitiveUtils.getRandomColor();
    const dotMaterial = new MeshStandardMaterial({ color });
    const lineMaterial = new MeshStandardMaterial({ color });

    let posX = 0;

    const step = Math.ceil(max / 10);

    const positions = data.map((onceData) => {
      const pos = new Vector3(posX, (10 * +onceData[columns[1]]) / max, 0);
      posX += 5;
      return pos;
    });

    const values = data.map((onceData) => onceData[columns[0]]);

    const lineChart = this.getLineChart({
      positions,
      values,
      dotMaterial,
      lineMaterial,
      step,
    });

    container.add(lineChart);
  }

  drawMultiAxisChart(data, container) {
    console.log("dataMultiAxisChart: ", data);

    const columns: string[] = [];

    for (let column in data[0]) {
      columns.push(column);
    }

    let max = -Infinity;
    for (let i = 1; i < columns.length; i++) {
      max = Math.max(...data.map((once_data) => +once_data[columns[i]]), max);
    }

    const step = Math.ceil(max / 10);

    const chart = new Group();

    const values = data.map((onceData) => onceData[columns[0]]);

    for (let i = 1; i < columns.length; i++) {
      const color = PrimitiveUtils.getRandomColor();
      const dotMaterial = new MeshStandardMaterial({ color });
      const lineMaterial = new MeshStandardMaterial({ color });

      let posX = 0;

      const positions = data.map((onceData) => {
        const pos = new Vector3(posX, (10 * +onceData[columns[i]]) / max, 0);
        posX += 5;
        return pos;
      });

      const lineChart = this.getLineChart({
        positions,
        dotMaterial,
        lineMaterial,
        step,
        isGrid: i === 1,
        values: i === 1 ? values : []
      });

      chart.add(lineChart);

      const boxClue = new Mesh(new BoxGeometry(2, 1, 0.5), dotMaterial)
      boxClue.position.y = 7.5 - (columns.length - 1) + 2 * i;
      boxClue.position.x = posX + 2

      const textClue = PrimitiveUtils.getText({
        text: columns[i],
        color,
        position: new Vector3(posX + 3.5, 7.9 - (columns.length - 1) + 2 * i, 0)
      })
      chart.add(boxClue)
      chart.add(textClue)
    }

    container.add(chart);
  }

  getLineChart(options): Group {
    const radius = options.dotSize || 0.2;
    const positions: Vector3[] = options.positions || [];
    const dotMaterial =
      options.dotMaterial ||
      new MeshStandardMaterial({ color: PrimitiveUtils.getRandomColor() });
    const lineMaterial = options.lineMaterial || dotMaterial;
    const step = options.step || 1;
    const values = options.values || [];
    const isGrid = options.isGrid;

    const chart = new Group();

    for (let i = 0; i < positions.length; i++) {
      const dotGeometry = new SphereGeometry(radius, 10, 10, 0, Math.PI * 2);
      const dot = new Mesh(dotGeometry, dotMaterial);
      dot.position.copy(positions[i]);
      dot.userData.isIntersected = true;
      chart.add(dot);

      if (values.length) {
        const text = new Text();
        text.text = values[i];
        text.font =
          "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5g.woff";
        text.fontSize = 1;
        text.position.y = -0.3;
        text.position.x = positions[i].x + 0.3;
        text.rotation.z = Math.PI / 2.7;
        text.anchorX = "right";
        text.color = 0x0000aa;

        text.sync();
        chart.add(text);
      }

      if (i !== positions.length - 1) {
        const curve: Curve<Vector3> = new Curve();
        curve.getPoint = (t, optionalTarget = new Vector3()) =>
          optionalTarget.copy(positions[i].clone().lerp(positions[i + 1], t));
        const lineGeometry = new TubeGeometry(curve, 2, 0.05, 10, false);
        const lineMesh = new Mesh(lineGeometry, lineMaterial);
        chart.add(lineMesh);
      }
    }

    if (isGrid) {
      chart.add(
        this.getGrid({ x: positions[positions.length - 1].x + 5, y: 15 }, step)
      );
    }
    return chart;
  }

  drawPieCharts(data, container) {
    console.log("dataPieCharts: ", data);
    const columns: string[] = [];

    for (let column in data[0]) {
      columns.push(column);
    }

    const sum = data.reduce((acc, cur) => acc + +cur[columns[1]], 0);

    const sortData = data.sort((a, b) => +a[columns[1]] - b[columns[1]]);

    let currPos = 0;

    const pie = new Group();

    for (let onceData of sortData) {
      const length = (+onceData[columns[1]] * Math.PI * 2) / sum;
      const partPie = PrimitiveUtils.getPartOfPie({
        startPart: currPos,
        lengthPart: length,
      });
      currPos += length;
      pie.add(partPie);
    }

    pie.translateY(10);
    pie.rotateX((3 * Math.PI) / 2);

    container.add(pie);

    console.log(sortData);
  }

  getGrid(size, step: number) {
    const materialGrid = new MeshStandardMaterial({ color: 0x3388ff });
    const grid = new Group();

    const yLineGeometry = new BoxGeometry(0.1, size.y + 1, 0.1);
    const yLine = new Mesh(yLineGeometry, materialGrid);
    yLine.position.set(0, size.y / 2 - 0.5, 0);
    grid.add(yLine);

    const yArrowGeometry = new ConeGeometry(0.2, 0.5, 4, 1);
    const yArrow = new Mesh(yArrowGeometry, materialGrid);
    yArrow.position.set(0, size.y, 0);
    yArrow.rotateY(Math.PI / 4);
    grid.add(yArrow);

    const xLineGeometry = new BoxGeometry(0.1, size.x + 1, 0.1);
    const xLine = new Mesh(xLineGeometry, materialGrid);
    xLine.rotation.set(0, 0, Math.PI / 2);
    xLine.position.set(size.x / 2 - 0.5, 0, 0);
    grid.add(xLine);

    const xArrowGeometry = new ConeGeometry(0.2, 0.5, 4, 1);
    const xArrow = new Mesh(xArrowGeometry, materialGrid);
    xArrow.position.set(size.x, 0, 0);
    xArrow.rotateZ(-Math.PI / 2);
    xArrow.rotateY(Math.PI / 4);
    grid.add(xArrow);

    for (let i = 1; i < size.y; i++) {
      const materialLine = new MeshStandardMaterial({ color: 0x3388ff });
      const xLineGeometry = new BoxGeometry(0.03, size.x, 0.03);
      const xLine = new Mesh(xLineGeometry, materialLine);
      xLine.rotation.set(0, 0, Math.PI / 2);
      xLine.position.set(size.x / 2, i, 0);
      xLine.material.transparent = true;
      xLine.material.opacity = 0.4;
      grid.add(xLine);

      const text = new Text();
      text.text = i * step;
      text.fontSize = 0.7;
      text.position.y = i + 0.25;
      text.position.x = -0.3;
      text.anchorX = "right";
      text.color = 0x0000aa;

      text.sync();
      grid.add(text);
    }

    return grid;
  }

}
