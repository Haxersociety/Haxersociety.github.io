import { App } from "./app";
const app = new App();
function animate() {
    requestAnimationFrame(animate);
    app.update();
}
animate();
//# sourceMappingURL=index.js.map
