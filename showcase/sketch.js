// p5.js 2.0 — multi-material .obj / .mtl showcase
// One file. One loadModel(). One model() call. Seven materials.
// Every texture map type the .mtl format defines, all applied automatically.
//
// drag to orbit   ·   press SPACE to strip the materials

const BASE = 'https://cdn.jsdelivr.net/gh/Nixxx19/p5.js@pr-assets/showcase/';

let withMaterials, withoutMaterials, showMaterials = true;

async function setup() {
  createCanvas(1000, 380, WEBGL);

  // this is the whole thing. the .mtl beside it, and every texture
  // the .mtl names, are found and applied on their own.
  withMaterials = await loadModel(BASE + 'showcase.obj');

  // the same geometry with the mtllib line removed, for the before/after
  withoutMaterials = await loadModel(BASE + 'showcase_nomtl.obj');
}

function draw() {
  if (!withMaterials) return;

  background(12, 12, 16);
  orbitControl(1, 1, 0.2);
  noStroke();

  ambientLight(88);
  directionalLight(255, 246, 232, -0.35, -0.5, -0.78);
  directionalLight(105, 140, 205, 0.72, -0.12, 0.3);
  pointLight(255, 252, 246, 0, -380, 700);

  rotateX(-0.16);
  rotateY(sin(millis() / 4000) * 0.14);
  scale(52);

  model(showMaterials ? withMaterials : withoutMaterials);
}

function keyPressed() {
  if (key === ' ') showMaterials = !showMaterials;
}

/*
  left to right, one material each, straight out of the .mtl:

  1  map_Kd    painted tiles              the only map p5 used to support
  2  map_Ks    scratched steel            only the scratches are glossy
  3  map_Ka    ambient gradient           ambient response varies per pixel
  4  map_Ns    checkered shininess        tight highlights next to broad ones
  5  map_Bump  brick relief  (-bm 2.6)    brightness read as height
  6  norm      dimples                    a real tangent-space normal map
  7  (none)    brass                      just Kd / Ks / Ns, no textures
*/
