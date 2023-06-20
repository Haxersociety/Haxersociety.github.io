import * as XLSX from "xlsx";

export class ExcelUtils {
  loadingCallback: Function;

  setLoadingCallback(callback) {
    this.loadingCallback = callback;
  }

  loadingJSONByXLSX = (event) => {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let fileReader = new FileReader();
        fileReader.onload = (event) => {
          let data = event.target.result;

          let workbook = XLSX.read(data, {
            type: "binary",
          });
          workbook.SheetNames.forEach((sheet) => {
            let jsonObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            this.loadingCallback && this.loadingCallback(jsonObject);
          });
        };
        fileReader.readAsBinaryString(file);
      }
    }
  };
}
