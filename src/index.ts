import { App } from "./app";

const app = new App();

const animate = () => {
  requestAnimationFrame(animate);
  app.update();
}

animate();
