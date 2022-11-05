import {Data_controller} from "./controllers/data_controller.js";
import {View3d_controller} from "./controllers/view3d_controller.js";

export class Engine {

    constructor() {

        this.data = new Data_controller(this)
        this.view3D = new View3d_controller(this)

    }

    init() {
        this.data.init && this.data.init()
        this.view3D.init && this.view3D.init()
    }

    update() {
        this.data.update && this.data.update()
        this.view3D.update && this.view3D.update()
    }

}