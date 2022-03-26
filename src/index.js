import * as THREE from "../three/three.module.js";
import { OrbitControls } from "../three/OrbitControls.js";
import { vertexShader, fragmentShader } from "./shaders/main.js";

let capture = false;
export const capturer = new CCapture({
  format: "webm",
  workersPath: "ccapture/",
  verbose: true,
  framerate: 60,
  quality: 100,
});

class App {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer = new THREE.WebGLRenderer({
      // antialias: true,
      alpha: true,
      canvas: this.canvas,
    });
    this.renderer.setClearColor(0x000000);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      1000
    );
    this.camera.position.z = 10;

    this.scene = new THREE.Scene();

    // Orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.addObjects();
    // this.addLighting();
    // this.addSettings();

    // Resize event
    this.resize();
    window.addEventListener("resize", this.resize.bind(this), {
      passive: true,
    });

    // Render
    this.render();
  }

  /* Add Lighting */

  addSettings() {
    this.gui = new dat.GUI();
    this.settings = { progress: 0 };
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  /* Add Lighting */

  addLighting() {
    // ambient light
    this.light1 = new THREE.AmbientLight(0x404040);
    this.scene.add(this.light1);

    // point light
    this.light2 = new THREE.PointLight(0xffffff, 1, 100);
    this.light2.position.set(2, 2, 2);
    this.scene.add(this.light2);
  }

  /* Add Objects */

  addObjects() {
    this.geometry1 = new THREE.PlaneBufferGeometry(2, 2);
    this.uniforms1 = {
      uTime: { value: 0.0 },
      uProgress: { value: 0.0 },
    };
    this.material1 = new THREE.ShaderMaterial({
      uniforms: this.uniforms1,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      side: THREE.DoubleSide,
      // blending: THREE.AdditiveBlending,
      // wireframe: true,
    });
    this.mesh1 = new THREE.Mesh(this.geometry1, this.material1);
    this.scene.add(this.mesh1);
  }

  /* Resize */

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  /* Render loop */

  render() {
    this.renderer.render(this.scene, this.camera);
    // this.controls.update();
    requestAnimationFrame(() => {
      if (capture && this.uniforms1.uTime.value === 0.0) {
        capturer.start();
      }

      this.mesh1.rotation.y += 0.005;
      this.uniforms1.uTime.value += 0.005;
      // this.uniforms1.uProgress.value = this.settings.progress;
      this.render();

      if (capture) {
        capturer.capture(this.canvas);
      }
    });
  }
}

let app = new App();

let captureButton = document.querySelector("#toggle-capture");
let reloadButton = document.querySelector("#reload");

captureButton.addEventListener("click", toggleCapture);
reloadButton.addEventListener("click", cancelCapture);

function toggleCapture() {
  if (capture == false) {
    capture = true;
    app.uniforms1.uTime.value = 0.0;
    document.getElementById("toggle-capture").value = "Stop Capturing Frames";
  } else {
    capturer.stop();
    capturer.save();
  }
}

function cancelCapture() {
  location.reload();
}
