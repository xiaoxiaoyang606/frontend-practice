// ===== 场景：黑色宇宙 =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// ===== 相机 =====
const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 8, 22);

// ===== 渲染器（抗锯齿）+ 挂到网页 =====
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== 鼠标环绕控制 =====
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// ===== 灯光：太阳是点光源 + 微弱环境光打底 =====
scene.add(new THREE.AmbientLight(0xffffff, 0.15));
const sunLight = new THREE.PointLight(0xffffff, 2, 200);
scene.add(sunLight);

// ===== 太阳：发光的橙黄球 =====
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffaa00 })
);
scene.add(sun);

// ===== 动画循环 =====
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  sun.rotation.y += 0.002;
  renderer.render(scene, camera);
};
animate();

// ===== 窗口适配 =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});