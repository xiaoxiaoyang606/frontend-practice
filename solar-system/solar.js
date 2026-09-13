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
// ===== 行星数据：大小 / 距太阳距离 / 颜色 / 公转速度 =====
const planetData = [
  { size: 0.25, distance: 3.5,  color: 0xb0a18f, speed: 0.020 },
  { size: 0.45, distance: 5.0,  color: 0xe6c27a, speed: 0.015 },
  { size: 0.5,  distance: 6.8,  color: 0x3a7bd5, speed: 0.010 },
  { size: 0.35, distance: 8.6,  color: 0xc1440e, speed: 0.008 },
  { size: 1.1,  distance: 11.5, color: 0xd8a878, speed: 0.005 },
  { size: 0.9,  distance: 14.5, color: 0xe3d5a3, speed: 0.0035, ring: true }
];

const planetPivots = [];

planetData.forEach(d => {
  // 每颗行星配一个看不见的"公转轴"，轴在太阳中心
  const pivot = new THREE.Group();
  scene.add(pivot);

  // 行星：受光照的标准材质（和太阳的自发光材质不同）
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(d.size, 32, 32),
    new THREE.MeshStandardMaterial({ color: d.color })
  );
  planet.position.x = d.distance;   // 挂在轴的旁边，离中心 distance 远
  pivot.add(planet);

  // 土星专属：金色光环，套在行星身上并倾斜
  if (d.ring) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(d.size * 1.6, 0.08, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0xc9b886 })
    );
    ring.rotation.x = Math.PI / 2.2;
    planet.add(ring);
  }

  // 公转轨道：一个躺平的细圆环
  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(d.distance, 0.02, 8, 128),
    new THREE.MeshBasicMaterial({ color: 0x444444 })
  );
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);

  planetPivots.push({ pivot, planet, speed: d.speed });
});
// ===== 星空：800 颗随机分布的白点 =====
const starGeometry = new THREE.BufferGeometry();
const starPositions = [];
for (let i = 0; i < 800; i++) {
  // 在半径 80~400 的大球壳内随机撒点
  const r = 80 + Math.random() * 320;
  const theta = Math.random() * Math.PI * 2;      // 水平方向随机角
  const phi = Math.acos(2 * Math.random() - 1);   // 竖直方向随机角
  starPositions.push(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}
starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starPositions, 3)
);
const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 })
);
scene.add(stars);
// ===== 动画循环 =====
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  sun.rotation.y += 0.002;
    planetPivots.forEach(p => {
    p.pivot.rotation.y += p.speed;  // 公转轴转 → 行星绕太阳画圈
    p.planet.rotation.y += 0.01;    // 行星自己也自转
  });
  renderer.render(scene, camera);
};
animate();

// ===== 窗口适配 =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});