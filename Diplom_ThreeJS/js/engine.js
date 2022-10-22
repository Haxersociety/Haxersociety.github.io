import {Data_controller} from "./controllers/data_controller.js";
import {View3d_controller} from "./controllers/view3d_controller.js";

export class Engine {

    constructor() {

        this.DataController = new Data_controller(this)
        this.View3DController = new View3d_controller(this)

    }

    init() {
        this.DataController.init && this.DataController.init()
        this.View3DController.init && this.View3DController.init()
    }

    update() {
        this.DataController.update && this.DataController.update()
        this.View3DController.update && this.View3DController.update()
    }

}