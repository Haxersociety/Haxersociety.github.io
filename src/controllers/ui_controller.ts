import { ExcelUtils } from "../utils/excel_utils";
import { CLOSE_ICON, GRAPH_TYPE, LOADING_XLSX_FILE } from "../utils/constants";

type graph = {
  imgPath: string;
  name: string;
  type: number;
};

const graphs: graph[] = [
  {
    name: "Столбчатая диаграмма",
    imgPath: "https://i.imgur.com/GIUdxmz.png",
    type: GRAPH_TYPE.BAR_GRAPH,
  },
  {
    name: "Линейная диаграмма",
    imgPath: "https://i.imgur.com/gqT2tT5.png",
    type: GRAPH_TYPE.LINE_CHART,
  },
  {
    name: "Гистограмма с несколькими осями",
    imgPath: "https://i.imgur.com/Pc6r8qs.png",
    type: GRAPH_TYPE.MULTI_AXIS_CHARTS,
  },
  {
    name: "Гистограмма",
    imgPath: "https://i.imgur.com/fk0quzF.png",
    type: GRAPH_TYPE.BAR_HISTOGRAMS,
  },
  {
    name: "Круговая диаграмма",
    imgPath: "https://i.imgur.com/9PG1ecy.png",
    type: GRAPH_TYPE.PIE_CHARTS,
  },
];

export class UIController {
  excelUtils: ExcelUtils;
  drawGraphCallback: Function;

  constructor() {
    this.excelUtils = new ExcelUtils();
  }

  openEditingWindow = () => {
    if (document.body.getElementsByClassName("download-window").length > 0)
      return;
    const window = document.createElement("div");
    window.setAttribute("class", "download-window");

    const closeButton = document.createElement("div");
    closeButton.setAttribute("class", "close-button");
    closeButton.innerHTML = CLOSE_ICON;
    closeButton.addEventListener("click", () => {
      document.body.removeChild(window);
    });
    window.appendChild(closeButton);

    window.appendChild(this.getDragAndDropContainer(window, this.stepChooseTypeGraphs));

    document.body.appendChild(window);
  };

  setNavigationCallbacks(callbacks: Map<number, Function>) {
    callbacks.forEach((value, key) => {
      switch (key) {
        case LOADING_XLSX_FILE:
          this.excelUtils.setLoadingCallback(value);
      }
    });
  }

  setCallbackDrawGraph(callback: Function = () => {}) {
    this.drawGraphCallback = callback;
  }

  getNavigationMenu() {
    const navigationBar = document.createElement("div");
    navigationBar.setAttribute("class", "navigation-bar");

    const downloadButton = document.createElement("button");
    downloadButton.setAttribute("class", "download-button");
    downloadButton.innerText = "Загрузить данные";
    downloadButton.addEventListener("click", this.openEditingWindow);

    navigationBar.appendChild(downloadButton);

    return navigationBar;
  }

  getDragAndDropContainer = (window: HTMLElement, downloadCallback: Function = () => {}) => {
    const dropContainer = document.createElement("div");
    dropContainer.setAttribute("class", "drop-container");
    dropContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropContainer.classList.add("drag-over");
    });
    dropContainer.addEventListener("dragleave", () => {
      dropContainer.classList.remove("drag-over");
    });
    dropContainer.addEventListener("click", () => {
      input.click();
      dropContainer.classList.remove("drag-over");
    });
    dropContainer.addEventListener("drop", (e) => {
      e.preventDefault();
      dropContainer.classList.remove("drag-over");
      const event = { target: undefined };
      event.target = e.dataTransfer;
      this.excelUtils.loadingJSONByXLSX(event);
      dropContainer.remove();
      downloadCallback(window);
    });

    const dropMessage = document.createElement("div");
    dropMessage.setAttribute("class", "drop-message");
    dropMessage.innerHTML =
      "Перетащите .xlsx файлы сюда или нажмите на область";
    dropContainer.appendChild(dropMessage);

    const input = document.createElement("input");
    input.setAttribute("class", "download-input");
    input.id = "fileUpload";
    input.type = "file";
    input.addEventListener("change", (event) => {
      this.excelUtils.loadingJSONByXLSX(event);
      dropContainer.remove();
      downloadCallback(window);
    });

    return dropContainer;
  };

  stepChooseTypeGraphs = (window: HTMLElement) => {
    const divChoose = document.createElement("div");
    divChoose.setAttribute("class", "choose-graph-container");

    window.appendChild(divChoose);

    const textChoose = document.createElement("p");
    textChoose.innerText = "Выберите тип графика";
    divChoose.appendChild(textChoose);

    const divSelectImage = document.createElement("div");
    divSelectImage.setAttribute("class", "select-graph-container");
    divChoose.appendChild(divSelectImage);
    for (let graph of graphs) {
      const divGraphElement = document.createElement("div");
      divGraphElement.setAttribute("class", "select-graph-item");
      divGraphElement.addEventListener("click", () => {
        window.remove();
        this.drawGraphCallback(graph.type);
      });

      const img = document.createElement("img");
      img.setAttribute("class", "img-select-graph");
      img.src = graph.imgPath;
      divGraphElement.appendChild(img);

      const text = document.createElement("p");
      text.innerText = graph.name;
      text.style.color = "black";
      text.style["fontSize"] = "10pt";
      divGraphElement.appendChild(text);

      divSelectImage.appendChild(divGraphElement);
    }
  };
}
