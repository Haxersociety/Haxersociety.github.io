import {Engine} from "./engine.js";

let engine = new Engine()

init();
update();

function init() {
    engine.init();
}

function update() {
    engine.update();
    requestAnimationFrame(update);
}