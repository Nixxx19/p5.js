# gsoc 2026 proposal
## full texture support for .mtl files in p5.js
**applicant:** nityam (github: nixxx19)

**project size:** 300 hours

**mentors:** diya solanki & claudine chen


## 1. synopsis

when a beginner downloads a 3d model from sketchfab and types `loadModel('robot.obj')` in p5.js, they expect their robot to look like the preview, textured, coloured per part, alive. instead they get a flat broken shape. the reason is a single architectural limitation: p5.js currently flattens all obj geometry into one vertex array and issues a single `gl.drawElements()` call with one texture bound. multi-material models are silently destroyed at parse time.

the difference is not subtle:

| before (p5.js today) | after (this project) |
|---|---|
| <p align="center"><img src="https://github.com/user-attachments/assets/c9649c7f-2f96-4213-a6ad-08f7132688f9" /></p> | <p align="center"><img src="https://github.com/user-attachments/assets/b283bc81-e1ee-4c68-8add-6d052804121f" /></p> |
| **[run it live](https://editor.p5js.org/nityamt199/sketches/me0kpve3H)** and this is what p5.js currently produces. same character, 12 material groups in the obj file, all of them collapsed into one flat grey material. hair, skin, jacket, eyes, shoes, completely indistinguishable. | **[run it live](https://editor.p5js.org/nityamt199/sketches/ZmVzb02vG)** and this is the poc with the slicer. same geometry, same user call, every material group renders with its own texture and colour. *(geometry assembled via `buildGeometry()` to simulate what the parser will produce - loading real `.obj`/`.mtl` files is detailed in section 5.2)* |

both sketches use the exact same geometry and the exact same `model()` call. the only difference is whether the renderer knows how to loop through material slices.

what makes this worse is that the failure is completely silent. `loadModel()` resolves successfully and hands back a geometry object. the user stares at a grey blob and assumes they did something wrong. they eventually find out they need to open blender and bake textures. most of them give up long before that.

this project removes that wall without changing a single line of user code. under the hood, the parser is taught to slice geometry by material boundary, and the renderer is taught to loop through those slices, each with its own texture and material uniforms.

this is directly in line with p5.js's core value: reduce cognitive load, maximise access. a beginner should not have to open blender, learn uv-baking, or understand what a `uSampler` is. they should just be able to use art.


## 2. background and what i already know

### 2.1 the existing implementation (pr #6710, merged by diya and dave)

i read through the entire pr #6710 (.mtl color support, merged 2024) to understand where the current code sits:

- `parseMtl()` parses `Kd`, `Ka`, `Ks`, and `map_Kd` (texture path stored but never used)
- `parseObj()` reads `usemtl` tokens and bakes the `Kd` diffuse colour into `model.vertexColors` as flat rgba values
- the result is a single `p5.Geometry` with per-vertex colour but no texture, a lossy representation
- `map_Ka`, `map_Ks`, `map_Bump`, `map_Ns`, `d`, `illum` are silently ignored

issue #6924 (filed by sableraf) formally tracks what's missing. this project resolves it completely.

### 2.2 what i found in the dev-2.0 codebase

i studied the following files directly in the `dev-2.0` branch:

| file | what i looked at |
|---|---|
| `src/webgl/loading.js` | `parseObj()`, `parseMtl()`, `model()`, the entire vertex-deduplication pipeline |
| `src/core/p5.Renderer3D.js` | `model()`, `_drawGeometry()`, `_drawFills()`, `buildGeometry()` |
| `src/webgl/p5.RendererGL.js` | `_drawBuffers()`, the single `gl.drawElements()` call |
| `src/webgl/p5.Geometry.js` | all 20 properties of the geometry class |
| `src/webgl/material.js` | `fn.texture()`, global texture state |
| `src/webgl/p5.Shader.js` | `bindTextures()`, confirms one global texture per draw call |

key findings:

- `beginGeometry()` and `endGeometry()` are not exposed as public user-facing functions in dev-2.0. they exist as internal renderer methods but there is no `fn.beginGeometry` or `fn.endGeometry`. the user-facing replacement is `buildGeometry(callback)`, which calls them internally. i built my entire poc using this api to ensure the proposal aligns with the new 2.0 architecture.
- `_materialSlices`, `materialGroups`, `subGeometries`, none of these exist on `Geometry`. this is the gap to fill.
- `model()` in dev-2.0 accepts `(model, count=1)` where `count` is for webgl2 instanced rendering.
- dave's comment on the pr architecture: "if `loadModel` could load a group or a single geometry, we'd want them to behave as similarly to each other as possible, so if you draw a single geometry with `model`, then one would expect that to work for a group too."

### 2.3 how mentor feedback shaped this proposal

the proposal you are reading is not the first version. it went through real iterations based on direct mentor feedback and that process is worth documenting because it changed the architecture.

when i first shared a prototype sketch with kit, she noticed it was running on p5.js 1.x. her exact note was that `beginGeometry` and `endGeometry` do not exist in dev-2.0. i went back and read the dev-2.0 webgl source directly at `src/core/p5.Renderer3D.js`. that is where i found `buildGeometry(callback)` as the replacement. i rebuilt the entire poc from scratch using this api. that process is what revealed the full extent of what had changed in the 2.0 renderer and why the architecture needs to be designed specifically for it, not retrofitted from 1.x thinking.

when i asked diya about the approach, she pushed back on any design that would expose a new public class. her feedback was clear: keep the grouping logic inside the existing pipeline, avoid anything that looks like a breaking change. that is what killed option a (new `p5.GeometryGroup` class) and sent me toward `_materialSlices` as a private field.

dave confirmed the overall direction was right and added one more constraint: api parity. `model()` must behave identically for single and multi-material geometry. that became the core test for every architectural decision in section 4.

diya also asked directly whether each slice would carry its own complete material object, including `map_Ks`, `map_Bump`, and other mtl texture maps, not just the diffuse texture. that question is why section 5.1 defines a full `materialProfile` schema rather than just storing a single texture reference per slice.

connie mentioned that the strongest proposals have three things: personal enthusiasm for the subject matter, a poc with real code, and evidence of previous contributions. that framing helped me make sure all three are visible in this proposal.

### 2.4 my existing contribution

i have an open pr (#8666) on `dev-2.0` that fixes a crash in `parseObj()` at lines 655-658. the `hasColoredVertices === hasColorlessVertices` boolean logic error caused blender and sketchfab exports to throw instead of loading gracefully. i found this bug while reading `parseObj()` specifically to understand the code i would be working on for this project. it was not a separate investigation, it came directly out of the deep read i did for the proposal. this is also why i know exactly where the slicer needs to be inserted in that function.


## 3. the problem, stated precisely

the diagram below shows where the data is lost. the obj file has all the material information including the usemtl boundaries, the map_Kd texture paths, the Kd colour values. parseMtl() reads them correctly. but parseObj() discards all the structure and dumps everything into one flat vertex array. by the time the data reaches the renderer, the material boundaries are completely gone and gl.drawElements() has nothing to work with except one flat blob.

<p align="center"><img width="697" height="654" alt="Screenshot 2026-03-22 at 4 00 34 PM" src="https://github.com/user-attachments/assets/e00c878e-492b-4ef1-96b7-7e02fa45a968" /></p>


## 4. my approach and the three options i considered

when i first approached this problem i identified three possible architectural solutions. diya's directive and dave's api feedback helped me narrow to the right one.

### option a: new public p5.GeometryGroup class (rejected)

create a new class that wraps an array of `p5.Geometry` objects. `loadModel()` returns a `p5.GeometryGroup` when it detects multiple materials. overload `model()` to accept either type.

why i rejected it: this is a breaking change. any code doing `instanceof p5.Geometry` checks would fail. concretely:

```javascript
// option a - user code must branch on return type:
let geom = loadModel('robot.obj'); // now returns p5.GeometryGroup, not p5.Geometry
model(geom);                       // breaks - model() only accepts p5.Geometry

// option c - user code unchanged:
let geom = loadModel('robot.obj'); // still returns p5.Geometry
model(geom);                       // works for 1 or 12 materials, same call
```

diya's feedback was explicit: "i'd generally lean toward keeping the grouping logic internal to the existing geometry pipeline unless a separate abstraction clearly improves maintainability. we would generally want to avoid breaking changes, since those are typically reserved for major releases." it also conflicts with dave's parity requirement since users should not have to call a different function for a multi-material model versus a single-material one.

### option b: public geometry.materialGroups property (rejected)

add a public `materialGroups: Array` field to `p5.Geometry`. the renderer checks for it.

why i rejected it: pollutes the public geometry api. since p5.js documentation is generated from inline comments, a new public property would appear in the reference and create documentation debt. users could also accidentally break their sketch by reading or mutating `materialGroups` without understanding the consequences.

### option c: private _materialSlices on p5.Geometry (chosen)

attach a private `_materialSlices` array to the geometry object returned by `loadModel()`. each entry is `{ geometry: p5.Geometry, materialProfile: {...} }`. the renderer checks for this private property. the public geometry api is completely unchanged.

why this is correct:

- zero breaking changes. `loadModel()` still returns `p5.Geometry`, `model()` signature unchanged
- follows p5.js convention: private fields use `_` prefix (`_hasFillTransparency`, `_hasStrokeTransparency`, etc.)
- aligns with diya's directive to keep grouping logic internal
- satisfies dave's api parity: `model(singleMaterialGeom)` and `model(multiMaterialGeom)` are the same call
- the fallback path (no `_materialSlices`) is the existing code with no modification
- closest to how processing4 handles it: `PShapeOBJ` builds an array of `PShape` children internally. each child holds one material group's geometry. the user-facing draw call (`shape(s)`) loops through those children automatically so the user never sees the internal structure. this is the exact pattern i am proposing for p5.js: `_materialSlices` as private internal children, `model()` looping through them, user api completely unchanged. the fact that processing, the parent project, already solved this the same way is strong evidence the pattern is correct.


the flowchart below shows how the renderer decides which path to take. if the geometry has no _materialSlices it falls through to the existing single draw call with zero regression for all existing sketches. if slices exist it loops through them, binding a new texture and material uniforms for each one before issuing its own gl.drawElements() call.

<p align="center"><img width="560" alt="Screenshot 2026-03-22 at 4 06 03 PM" src="https://github.com/user-attachments/assets/6c22918d-24cd-45d3-8159-a4bf58b617dd" /></p>



## 5. technical architecture

### 5.1 data structure

```javascript
// what loadModel() returns (p5.Geometry, unchanged public api)
{
  // all existing public geometry fields, untouched:
  vertices: [...],
  faces: [...],
  uvs: [...],
  vertexColors: [],
  vertexNormals: [...],

  // new: private array of material slices (only present on multi-material models)
  _materialSlices: [
    {
      geometry: p5.Geometry,       // sub-geometry for this material's faces
      materialProfile: {
        name:          'DenimJacket',
        diffuseColor:  [r, g, b],  // Kd
        ambientColor:  [r, g, b],  // Ka
        specularColor: [r, g, b],  // Ks
        shininess:     32,          // Ns
        opacity:       1.0,         // d
        illumination:  2,           // illum
        map_Kd:        p5.Image,    // loaded diffuse texture
        map_Ks:        p5.Image,    // loaded specular map (null if absent) - stored in v1, shader binding deferred
        map_Bump:      p5.Image,    // loaded bump/normal map (null if absent) - stored in v1, shader binding deferred
        map_Ka:        p5.Image,    // loaded ambient map (null if absent) - stored in v1, shader binding deferred
        map_Ns:        p5.Image,    // loaded shininess map (null if absent) - stored in v1, shader binding deferred
      }
    },
    // one entry per usemtl group in the obj file
  ]
}
```

`map_Kd` is the only map bound to the shader in v1 - the current `_setFillUniforms()` has a single `uSampler` uniform. `map_Ks`, `map_Bump`, `map_Ka`, and `map_Ns` are parsed and stored in `materialProfile` so they are available for follow-on work, but binding them requires adding new uniforms to the shader, which is out of scope for this project. a github issue will be filed at the end of gsoc to track that extension.

### 5.2 parser changes (loading.js)

**parseMtl() extended:**
```
current:  Kd, Ka, Ks, map_Kd (stored but unused)
proposed: Kd, Ka, Ks, Ns, d, illum + map_Kd, map_Ka, map_Ks, map_Bump, map_Ns
          all map_* values trigger loadImage() inside loadModel(), awaited in
          async setup(), so all textures are resolved before draw() starts
```

**parseObj() the slicer:**

the current single-pass approach that dumps all vertices into one array is replaced by a slice-aware pass:

```
when parseObj() encounters a "usemtl <name>" token:
  1. finalise the current slice (close its vertex/face arrays)
  2. look up <name> in the materials dict from parseMtl()
  3. open a new sub-geometry builder for the new material
  4. continue parsing, vertices, uvs, normals go into this slice's arrays

on end-of-file:
  5. finalise the last open slice. if slice.geometry.vertexNormals is empty
     (obj file had no vn lines), call slice.geometry.computeNormals() - same
     fallback the current single-geometry path applies at line 652 of loading.js
  6. if only 1 slice exists, attach nothing (use existing single-draw path)
  7. if more than 1 slices, attach array as parent._materialSlices
```

the vertex-deduplication logic (`usedVerts` map, keyed by `vertexString + material`) already exists in the current code. the slicer reuses this: each slice has its own `usedVerts` scope so face indices are local to the slice.

uv re-indexing: obj uv coordinates (`vt`) are stored in a single global list and face tokens reference into it with global indices (e.g. `f 1/3/1 2/5/2` means vertex 1 with uv 3). when slicing by `usemtl` boundary, each slice has its own local vertex array starting at index 0. the slicer remaps every global `vt` reference to a per-slice local index as it copies vertices into each slice's array. this is the same index-localisation step already performed for vertex positions and normals, applied equally to uvs.

draw order: slices are inserted in obj file order, which matches the artist's 3d software export order. no automatic depth sorting for opaque meshes since the depth buffer handles occlusion correctly for opaque geometry automatically.

`_makeTriangleEdges()`: in the current code, `loadModel()` calls `model._makeTriangleEdges()` on the parent geometry after `parseObj()` returns. this generates stroke geometry (line vertices, tangents, caps, joins). in the sliced design, all vertices live in sub-geometries - the parent has none - so the existing single call produces nothing. the slicer will call `_makeTriangleEdges()` on each slice's sub-geometry individually before attaching it to `_materialSlices`.

`hasColoredVertices` / `hasColorlessVertices`: the current `parseObj()` tracks these two flags across all vertices and throws if both are false or both are true (the bug pr #8666 fixes). the per-slice design eliminates this check entirely - each slice only contains vertices from one material, so they are either all-colored or all-colorless by construction. the mixed state that causes the throw cannot occur per slice. this means the slicer also resolves the underlying condition that made pr #8666 necessary.

### 5.3 renderer changes (p5.Renderer3D.js)

the existing `model()` method in `Renderer3D`:
```javascript
model(model, count = 1) {
  if (model.vertices.length > 0) {
    if (this.geometryBuilder) {
      this.geometryBuilder.addRetained(model);
    } else {
      if (!this.geometryInHash(model.gid)) {
        model._edgesToVertices();
        this._getOrMakeCachedBuffers(model);
      }
      this._drawGeometry(model, { count });
    }
  }
}
```

extended model():
```javascript
model(model, count = 1) {
  if (model._materialSlices && model._materialSlices.length > 1) {
    // new: multi-draw path, loop through slices
    if (this.geometryBuilder) {
      // inside buildGeometry() - geometry only, material state not preserved.
      // GeometryBuilder.addGeometry() flattens vertices into one combined geometry
      // and discards texture/material per slice. full multi-material support inside
      // buildGeometry() is Phase 5's scope; this path handles geometry capture only.
      for (const slice of model._materialSlices) {
        this.geometryBuilder.addRetained(slice.geometry);
      }
    } else {
      for (const slice of model._materialSlices) {
        this.push();                                      // save caller's material state
        if (!this.geometryInHash(slice.geometry.gid)) {
          slice.geometry._edgesToVertices();
          this._getOrMakeCachedBuffers(slice.geometry);  // upload VBOs on first draw
        }
        this._applyMaterialProfile(slice.materialProfile);
        this._drawGeometry(slice.geometry, { count });
        this.pop();                                       // restore caller's material state
      }
    }
  } else {
    // existing: single-draw path, no change, no regression
    if (model.vertices.length > 0) {
      if (this.geometryBuilder) {
        this.geometryBuilder.addRetained(model);
      } else {
        if (!this.geometryInHash(model.gid)) {
          model._edgesToVertices();
          this._getOrMakeCachedBuffers(model);
        }
        this._drawGeometry(model, { count });
      }
    }
  }
}
```

`_applyMaterialProfile()` will call `this.texture()`, `this.specularMaterial()`, `this.ambientMaterial()`, `this.shininess()` with values from the `materialProfile`, the same functions users call today. if `map_Kd` is absent from a slice, the slicer falls back to `diffuseColor` as `ambientMaterial` - the same fallback the poc uses today. under the hood, each slice results in one `gl.drawElements()` call with its own texture unit bound, replacing the single call that currently covers the whole model.

the per-slice draw loop uses `push()`/`pop()` rather than a custom `_resetMaterialProfile()`. this is necessary to preserve whatever material state the caller had set before calling `model()` - for example, if the user called `texture(myTex)` before `model(robot)`, a null-reset would silently destroy `myTex` and break any geometry drawn after the call. `push()` saves the full renderer state before each slice, `pop()` restores it after. the poc already uses this pattern correctly and the production implementation follows it for the same reason.

the per-slice gpu buffer caching works as follows: each slice's sub-geometry is a separate `p5.Geometry` object with its own `gid`. `_getOrMakeCachedBuffers()` keys the buffer cache on `gid`, so 12 slices produce 12 separate gpu buffer objects - uploaded once on first draw and reused on every subsequent frame, the same caching behaviour as a single geometry today but applied per slice.

when `_applyMaterialProfile()` calls `this.texture()`, it sets the renderer's active texture state. `_drawGeometry()` then calls `_drawFills()`, which calls `shader.bindTextures()` and then `_drawBuffers()`. `_drawBuffers()` issues `gl.drawElements()` - the existing shader binding machinery in `p5.Shader.js` is reused unchanged. the new path calls it once per slice instead of once per model.

### 5.4 buildGeometry() integration (dave's suggestion)

dave noted: "similarly for building groups by using `buildGeometry` and swapping between things we can't currently support in one geometry, like textures, but also things like metalness, specularMaterial, etc."

in phase 5 of the project, i will extend `buildGeometry()` so that if a user calls `texture()` or `specularMaterial()` mid-draw, a new slice boundary is automatically created:

```javascript
// user code, no new api, just works:
let myModel = buildGeometry(() => {
  texture(woodTex);
  box(100);                  // slice 1: wood texture

  texture(metalTex);
  sphere(40);                // slice 2: metal texture
});
model(myModel);              // renders both slices correctly
```

this is detected internally by diffing material state in `GeometryBuilder`. this is ambitious but achievable and extends the fix from imported models to procedurally built ones.

since this touches the behaviour of an existing api, i will prioritise confirming alignment with the core team during community bonding before writing any production code for this phase.

### 5.5 texture loading, eager vs lazy

two options for when `map_Kd` textures are loaded from `parseMtl()`:

eager (my preference for v1): all `map_*` paths trigger `loadImage()` calls inside `loadModel()`. in dev-2.0, `preload()` is replaced by `async setup()` - the user writes `await loadModel(...)` and `draw()` does not start until `setup()` resolves. textures are guaranteed ready before the first frame. no complexity.

lazy: load textures on first render. reduces initial load time for large models with many materials but adds state tracking and potential one-frame flicker.

i propose eager loading for this project. lazy loading can be a follow-up optimisation with a cache.

the async coordination works as follows: `loadModel()` is already an `async` function. `parseMtl()` is a private module-level function with no sketch instance access - it returns raw texture path strings, exactly as it returns `texturePath` today. `fn.loadModel()`, which has sketch instance access via `this`, iterates those paths after `parseMtl()` resolves and calls `this.loadImage()` on each one, pushing the returned promise into a flat array. before `loadModel()` resolves, it awaits `Promise.all(texturePromises)`. this guarantees every slice's textures are fully decoded before `loadModel()` returns. since the user writes `let model = await loadModel(...)` inside `async setup()`, and dev-2.0's runtime awaits `setup()` before starting the draw loop, all textures are guaranteed ready before the first frame - no race condition, no flicker. the old `_incrementPreload`/`_decrementPreload` counter system from p5.js 1.x does not exist in dev-2.0 and is not needed here.

### 5.6 error handling

three failure modes and how the implementation handles each:

**mtl file missing:** `parseMtl()` is only called when the obj parser finds an `mtllib` directive and the fetch succeeds. if the fetch fails, the model loads as single-material geometry using the existing single-draw path - same behaviour as today, zero regression.

**texture path 404:** if a `loadImage()` call for a `map_*` path fails, that slice's texture field is set to `null`. the renderer already has a fallback for `map_Kd === null`: it applies `diffuseColor` as `ambientMaterial` instead. a 404'd texture degrades to a flat-coloured slice rather than a broken render. a `console.warn()` is issued with the failed path - unlike today where this failure is completely silent.

**partial mtl (mixed textured and untextured slices):** each slice is resolved independently. slices with a valid `map_Kd` get a texture. slices without one (or whose texture failed) get `diffuseColor`. no slice's failure affects any other slice.

the diagram below shows all three layers together: parser, data, and renderer, and how they connect. the parser produces the slices, the data layer holds them privately on the geometry object, and the renderer loops through them at draw time. each layer is independently testable and the public api never changes.

<p align="center"><img width="568" height="577" alt="Screenshot 2026-03-22 at 4 11 16 PM" src="https://github.com/user-attachments/assets/14c64665-824a-412b-8b91-5eef523e0a49" /></p>


## 6. proof of concept

i built a working poc to validate all three layers of this architecture before writing this proposal. you can run it here:

**https://editor.p5js.org/nityamt199/sketches/ZmVzb02vG**

the poc uses `buildGeometry()` from dev-2.0 to simulate what `parseObj()` will produce internally. here is how each part maps to the real implementation:

**slice construction (mirrors what parseObj will do at each usemtl boundary)**

```javascript
// each slice = one usemtl block from a real obj file
// buildGeometry captures the draw calls into a p5.Geometry object
// this is what parseObj will produce internally per material group
const shirtSlice = {
  geom: buildGeometry(() => {
    // torso
    box(86, 100, 40);
    // arms
    push(); translate(-55,-3, 0); rotateZ( 0.42); box(30, 90, 30); pop();
    push(); translate( 55, -3, 0); rotateZ(-0.42); box(30, 90, 30); pop();
    // legs connected directly to bottom of shirt torso
    push(); translate(-20, 65, 0); box(24, 30, 28); pop();
    push(); translate( 20, 65, 0); box(24, 30, 28); pop();
  }),
  // materialProfile mirrors what parseMtl reads from a .mtl file
  // map_Kd = diffuse texture, specularColor = Ks, shininess = Ns
  materialProfile: {
    name: 'CottonShirt',
    diffuseColor: [0.86, 0.82, 0.71],
    specularColor: [0.1, 0.1, 0.1],
    shininess: 8,
    map_Kd: cottonTex,
    noStroke: true
  }
};
```

**attaching slices to the parent geometry (the data layer)**

```javascript
// this bounding box simulates what loadModel returns today
// in the real impl loadModel returns this with _materialSlices already attached
myModel = buildGeometry(() => { box(160, 300, 55); });

// _materialSlices is the private array on p5.Geometry
// underscore keeps it internal so zero public api changes
// order here matches the usemtl order in the obj file
myModel._materialSlices = [
  shirtSlice, jacketSlice,
  headSlice,
  eyeWhitesSlice, irisSlice, pupilsSlice, eyeShineSlice,
  eyebrowsSlice, noseSlice, lipsSlice,
  hairSlice,
  shoeSlice
];
```

**the multi draw renderer (the renderer layer)**

```javascript
// this is the renderer layer, lives inside Renderer3D.model() in the real impl
// if no slices found it falls back to the existing single draw call
// so every sketch that doesnt use multi material keeps working exactly the same
function drawMultiMaterial(geom) {
  if (!geom._materialSlices) { model(geom); return; }

  for (const slice of geom._materialSlices) {
    push();

    if (slice.materialProfile.noStroke) noStroke();

    // bind the texture if we have one, otherwise fall back to solid color
    // this is where map_Kd from the mtl file gets applied per slice
    if (slice.materialProfile.map_Kd) {
      texture(slice.materialProfile.map_Kd);
    } else {
      const [r, g, b] = slice.materialProfile.diffuseColor;
      ambientMaterial(r * 255, g * 255, b * 255);
    }

    // Ns value from the mtl file
    shininess(slice.materialProfile.shininess);

    // one draw call per slice, this is what bypasses the single texture limit
    model(slice.geom);
    pop();
  }
}
```

the poc renders 12 separate material slices (shirt, jacket, head, eyes, irises, pupils, eye shine, eyebrows, nose, lips, hair, shoes) each with their own texture or colour. this is completely impossible with the current p5.js renderer. the poc proves the architecture works end to end in dev-2.0.

the poc intentionally uses `buildGeometry()` instead of `loadModel()` to isolate and validate the three-layer architecture independently. it answers the question "do the layers work together?" - the parser, data layer, and renderer all behave as the proposal describes. the implementation phases will extend this to handle the full `loadModel()` path including real obj/mtl files, uv mapping edge cases, and face winding.


## 7. scope and why this is 300 hours

the gsoc idea page lists this as 175h or 300h. i am proposing 300h because:

1. the parser rewrite is non-trivial. vertex deduplication, uv mapping, and face winding all need to work correctly per-slice.
2. visual tests for 3d rendering are significantly more complex than unit tests.
3. after the feedback i received, i plan to allocate time to read all geometry-related references and file issues for unimplemented apis so other contributors can continue the work after gsoc.
4. the `buildGeometry()` integration (phase 4) is an extra deliverable not in the original spec.

| phase | work | weeks | hours | buffer (hrs) |
|---|---|---|---|---|
| 1 | community bonding: study all geometry apis, read processing4's PShapeOBJ.java, draft architecture doc, get sign-off from diya, claudine | week 1-2 | 40h | 5h |
| 2 | extend `parseMtl()`: all mtl tokens and texture loading pipeline | week 3-5 | 35h | 5h |
| 3 | rewrite `parseObj()` slicer: per-material vertex buckets, uv mapping per slice, face-index localisation | week 6-8 | 55h | 15h |
| 4 | extend `Renderer3D.model()`: multi-draw loop, per-slice material binding, buffer cache per slice | week 9-11 | 50h | 15h |
| 5 | `buildGeometry()` mid-draw material boundary detection | week 12-13 | 35h | 5h |
| 6 | visual tests (screenshot comparison), unit tests, fixture obj/mtl files | week 14-16 | 40h | 5h |
| 7 | docs: jsdoc for `loadModel()`, `model()`, `buildGeometry()`; reference page examples | week 17-18 | 25h | 5h |
| 8 | api parity audit, edge cases, performance, create follow-up issues for unimplemented features | week 19-20 | 20h | 5h |
| **core total** | | **week 1-20** | **300h** | **60h** |
| overflow + stretch | if any phase runs over, absorb up to 25h of slippage here. if on schedule, stretch goal priority: (1) better error messages when map_Kd path is missing, (2) additional test fixtures with real sketchfab models, (3) pbr property stubs on materialProfile for follow-on contributors | week 21-22 | up to 25h | - |
| **gsoc total** | | **22 weeks** | **300h** | - |

the buffer column is not additional time on top of 300 hours. it is already counted inside each phase's hours. for example, phase 3 is allocated 55h total, out of which 15h is breathing room for code review cycles, unexpected edge cases, and pr iteration. the remaining 40h is the actual implementation work. every phase is structured this way. the total project hours stay at 300h.

phases 3 and 4 carry the most risk since the vertex deduplication logic and the renderer buffer cache both have non-obvious interactions with the rest of the geometry pipeline. this is why their buffer is 15h each instead of 5h. if a phase finishes under estimate, the saved hours roll into phase 6 since testing can always absorb more time. if phase 3 still overruns despite the buffer, phase 5 (`buildGeometry()` boundary detection) is the first candidate to defer - it is an extra deliverable beyond the original spec and can ship as a follow-up pr without affecting the core multi-material fix. if both phases 3 and 4 overrun, phase 6 testing is reduced to core regression tests only - the visual screenshot comparison suite is deferred to a follow-up pr. the core deliverables (parser, data layer, renderer) are never at risk.

weeks 21 and 22 are the final two weeks of the 22-week gsoc window. no new work is scheduled here. if a phase earlier in the timeline ran longer than expected, these weeks absorb that slip without any risk to the final deliverables. if all phases finished on time, these weeks become stretch goal time for features that are out of scope for v1 but worth filing as follow-up issues.


## 8. expected outcomes

by the end of gsoc:

- merged: extended `parseMtl()` that parses all standard mtl tokens
- merged: new slicer in `parseObj()` producing `_materialSlices`
- merged: extended `Renderer3D.model()` with multi-draw loop
- merged (if phase 5 not deferred): `buildGeometry()` material boundary detection
- merged: visual tests with real multi-material obj fixtures
- merged: full jsdoc and reference page examples
- filed: github issues for remaining unimplemented mtl features so other contributors can continue
- demo: a public-facing sketch that loads a real sketchfab model and renders it correctly with one line of user code

what the user sees after this project:
```javascript
// before: broken, flat blob, wrong colours, no textures
// after:  works, each material part has its own texture and colour
let robot = loadModel('robot.obj');  // loadModel unchanged
function draw() {
  model(robot);                      // model() unchanged
}
```


## 9. accessibility angle

p5.js's mission is access and inclusion. kit made this explicit in the session: "all new proposals should make the argument of how the new feature improves access and inclusion." this project has a direct and concrete answer to that.

sketchfab is the world's largest free 3d asset library. it has millions of downloadable models spanning art, culture, science, education, and games. the majority of those models are exported as obj plus mtl, the most common interchange format. every single one of those models has multiple materials. and every single one of them renders as a flat grey blob in p5.js today.

the problem is made worse by how it fails. `loadModel()` returns successfully with no error and no warning. the user did everything right. p5.js is being used in classrooms, creative coding workshops, and by artists who are not software engineers. educators who build 3d assignments around p5.js hit this wall every time a student tries to load a real model.

the specific gatekeeper this project removes:

1. user finds a model on sketchfab (free, one click download)
2. loads it in p5.js with `loadModel()` (one line, as documented)
3. model renders broken, no error, user is confused
4. user searches and finds they need to bake textures in blender
5. blender has a learning curve of hundreds of hours and is not installed by default anywhere
6. user gives up and abandons the 3d direction entirely

after this project: step 3 renders correctly. steps 4, 5, 6 do not happen.


## 10. why i chose this project and what i bring to it

i take an elective in gaming and animation as part of my coursework. that course lives in blender. we model things, rig them, texture them, and export them. i got used to working with multi-material meshes where the jacket is one material, the skin is another, the shoes are another, and blender keeps them all separate because that is how you actually build things. when i started bringing those models into p5.js for creative coding projects, i hit the wall immediately. the same character i had spent hours texturing in blender came out as a single flat grey blob. no error. nothing. i genuinely thought i was exporting wrong. i tried different export settings, re-checked my uv maps, re-exported with different obj options, checked the file in a different viewer to confirm the textures were actually there. they were. i then opened the obj file in a text editor and saw all the `usemtl` groups exactly where they should be. the `map_Kd` paths were in the mtl file. everything was correct. that was when i opened `loading.js` directly and traced what `parseObj()` actually does with a `usemtl` token. i found it reads the material name, looks it up, bakes just the `Kd` colour into `vertexColors`, and then discards the boundary entirely. the texture path is stored by `parseMtl()` but never handed to the renderer. that single read told me exactly what was broken and exactly where.

that experience is the real origin of this proposal. i am not proposing this because it looked like an interesting gsoc issue. i ran into this wall personally, in a real workflow, coming from a course that specifically teaches the pipeline this bug breaks. i know what it feels like to be on the other side of it and i know exactly which step in the pipeline swallows the material data. every student in that class who tries to bring their blender work into p5.js hits the same wall. fixing this means they don't have to.

when i saw this listed as a gsoc project i already knew the pain point from the user side. what i did next was go read the source to understand the technical side. i read pr #6710 end to end, traced the entire pipeline from `loadModel()` down to `gl.drawElements()`, opened the dev-2.0 branch and read six files in detail. i found a real crash bug in `parseObj()` while doing that read and opened pr #8666 to fix it. by the time i started writing this proposal i had a working poc that proved the three-layer architecture was sound in dev-2.0.

that combination of hitting the problem as a user, going deep into the source as a developer, and building something before proposing it is what makes me confident i can deliver this. this proposal is rooted in a deep line-by-line understanding of the current rendering pipeline.

**contributions across the p5.js ecosystem:**

i have contributed across the full p5.js ecosystem before this gsoc application, not just the specific file this project touches.

**p5.js core (2 open prs):**
- **pr #8666:** fixes the `parseObj()` crash for mixed-material obj models. in the exact file this gsoc project modifies. this is directly in the 3d/webgl rendering path.
- **pr #8555:** fixes a browser freeze when tessellating geometry over 50k vertices. a webgl renderer fix in the same rendering layer this project works in. both open prs are in the core 3d pipeline - not peripheral fixes.

**p5.js web editor (13 merged prs):**
the web editor is where beginners actually write their p5.js code. i have 13 merged contributions there covering security fixes (oauth, bcrypt, mass assignment vulnerabilities), performance (502 timeout on project downloads, zip streaming), accessibility (aria-live on form errors), and ux (signup flow when email verification fails). the range matters because it shows i understand the environment where the user experiences this bug, not just the renderer layer where it originates.

some of the specific merged prs: #3968 (private assets authorization), #3967 (input validation), #3966 (google oauth email validation), #3897 (async bcrypt), #3892 (github oauth fix), #3884 (aria-live accessibility), #3862 (zip download timeout).

that is 15 prs across the core library, the webgl renderer, and the editor. i have genuine familiarity with the codebase and the contribution workflow.

**other technical background:**
- full pipeline trace: `loadModel()` to `parseMtl()`, `parseObj()`, `p5.Geometry`, `Renderer3D.model()`, `_drawBuffers()`, `gl.drawElements()`, all read in source not docs
- referenced pr #6710 (original mtl implementation by diya and dave), issue #6924 (formal feature request tracking what is missing), processing4's `PShapeOBJ.java` (reference implementation for the internal children pattern)
- working poc built on dev-2.0 apis (`buildGeometry()`) before writing this proposal, not after
- direct conversations with diya, dave, and kit that shaped the architecture documented in sections 2.3 and 4


## 11. architectural decisions for the community bonding period

i have researched each of these thoroughly and have a clear position on each one. each decision touches the public api or shader pipeline and should have explicit sign-off from the team before i write production code. i want to align early rather than surface surprises at pr review.

**decision 1: draw order for transparent slices**

when a slice has `d < 1.0` (transparent), correct rendering requires back-to-front draw order. i have thought through three options:

option a: sort transparent slices at load time based on estimated depth from the geometry bounds.

option b: document that artists should order transparent faces last in their obj export, which is what most 3d tools already do by convention.

option c: expose a `loadModel('file.obj', { sortTransparent: true })` option for users who need it.

my current position is option b for v1, because it adds zero complexity, it matches what artists already do in blender and maya, and option c can follow as a documented enhancement. i want to confirm with diya and claudine that this matches how the team thinks about v1 scope before committing.

**decision 2: buildGeometry() material boundary detection**

should mid-draw material state changes automatically create a new slice (always-on), or should this be an opt-in flag?

i prefer always-on. the overhead is o(1) per draw call since it is just comparing a few uniform values against the previous call. most sketches that use `buildGeometry()` do not change materials mid-draw, so the detection cost is nearly always zero. an opt-in flag adds api surface area without meaningful benefit. i want to run this past dave since it touches the behaviour of an existing api. if the team prefers opt-in, i will ship the `buildGeometry()` integration as a separate pr after the core multi-material fix lands - phase 5 is already labelled as an extra deliverable, so the main timeline is not affected either way.

**decision 3: texture loading, eager vs lazy**

i prefer eager loading. all `map_*` textures get loaded inside `loadModel()`, which the user awaits in `async setup()`. since dev-2.0 awaits `setup()` before starting the draw loop, everything is ready before `draw()` starts. this is the simplest mental model and consistent with how dev-2.0 handles all async asset loading.

lazy loading (loading on first render) would reduce startup time for models with many materials but adds state tracking, potential one-frame flicker, and more error-handling surface area. i think that tradeoff is not worth it for a first implementation. lazy loading can be a follow-up once the eager path is stable.

**decision 4: private field convention**

should `_materialSlices` use the `_` prefix convention (as most private fields in this codebase do) or es2022 `#` private fields?

i checked the codebase and the `_` convention is overwhelmingly dominant. `#` private fields appear in almost none of the existing code. my preference is to match the existing convention and use `_materialSlices` for consistency, but i will follow whatever the team decides here since it is a style question not a technical one.

**decision 5: pbr properties like metalness (dave's point)**

dave specifically mentioned metalness alongside specularMaterial and textures as things that could not currently be swapped inside one geometry. the classic mtl format does not have a metalness field at all, it predates pbr pipelines entirely. so this raises a real question: should the materialProfile schema be extended to support pbr properties beyond what the mtl spec defines?

my position is to not include metalness in this gsoc project, and here is why i came to that conclusion. the mtl format covers `Kd`, `Ks`, `Ka`, `Ns`, `d`, `map_Kd`, `map_Ks`, `map_Bump` and a handful of others. that is already a full project's worth of work to parse, load, and bind correctly. metalness in the pbr sense comes from gltf and other modern formats which have a completely different pipeline. trying to bolt it onto the mtl materialProfile now would mean designing a schema that serves two different file format families at once, which is the kind of thing that produces awkward apis.

what i will do instead is design the materialProfile object to be extensible from the start. the schema is a plain javascript object, so adding `metalness: null` as a field in a follow-on pr is trivial once someone decides what source format should populate it. i will also file a github issue at the end of gsoc that formally tracks pbr materialProfile extensions so the conversation happens in the right place.

i want to confirm with dave that this sequencing makes sense, since he was the one who raised it. before gsoc ends i will open a github issue formally tracking pbr materialProfile extensions (metalness, roughness, gltf alignment) so the conversation has a home and other contributors can pick it up.

the architecture described in this proposal is my strongest current recommendation based on the codebase reading, the poc, and the mentor conversations so far. that said, i fully expect the implementation details to evolve once the wider team weighs in during pr review. that is a normal and healthy part of contributing to an open source project and i am ready to adapt as reviewers surface things i have not anticipated.
