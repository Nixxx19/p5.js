# gsoc 2026 proposal
## full texture support for .mtl files in p5.js
**applicant:** **Nityam** ([@Nixxx19](https://github.com/Nixxx19))

**project size:** 300 hours

**mentors:** **Diya Solanki** ([@diyaayay](https://github.com/diyaayay)) & **Claudine Chen** ([@mingness](https://github.com/mingness))



***

# Section 1: Introduction

**Name:** Nityam

**GitHub:** [@Nixxx19](https://github.com/Nixxx19)

**Discourse:** [nixxx19](https://discourse.processing.org/u/nixxx19/summary)

**Discord:** nityam_33606

**Pronouns:** he/him

## 1.1 Short bio

i am a third-year computer science engineering student at Thapar University, Patiala. i am a systems-oriented developer and most of my work sits in Rust, TypeScript, and distributed systems, spanning multi-agent decision engines, CI/CD infrastructure, and real-time API services. i read research before i write code and i treat every codebase i work in like a production system.

alongside this, i take an elective in gaming and animation where i work with Blender, modelling and texturing characters for real pipelines. that elective pulled me into JavaScript and WebGL based creative coding tools, and i have been working with p5.js long enough to know its internals well. that combination of low-level systems thinking and hands-on 3D and creative coding work is what shapes how i approach problems.

## 1.2 Project abstract

p5.js currently flattens all geometry from a 3D model into one shape and renders it with a single texture. every model exported from blender, maya, sketchfab, or tinkercad with more than one material comes out as a flat grey blob with no error and no warning. the user did everything right. the library silently threw away the material information at parse time.

this project fixes that at the root. it rewrites the obj parser to preserve material boundaries, introduces a lightweight private data structure to carry per-material geometry and texture information, and extends the renderer to loop through each material group and draw it correctly. the result is that a fully textured multi-material model loads and renders as the artist intended. the user calls loadModel() exactly as before. nothing in the public api changes. every model that currently renders broken renders correctly.

## 1.3 Interests & skills

### 1.3.1 what i find most interesting about this project

what pulls me in is that the fix does not live in one place. it touches the parser, the data layer, and the GPU renderer all at once. most bugs are isolated. this one is not. you have to understand how an OBJ file encodes material boundaries, how that data survives the parse, and how WebGL actually binds textures at draw time before you can even describe what is broken. i genuinely love that kind of challenge. when i first started reading the source it took me a while, but the moment it clicked, everything started connecting. the existing PRs, the old issues, the design decisions that seemed unrelated at first — they all started pointing at the same root cause. it felt less like reading code and more like following a trail where every clue was already there. i find that kind of thing really fun. i cannot fake my way through it and i do not want to.

### 1.3.2 what i bring

technically i bring a systems background that makes me comfortable reading unfamiliar source code and tracing data through pipelines before touching anything. i have worked in Rust, TypeScript, and distributed systems long enough that reading a JavaScript renderer and following a buffer through it feels natural to me. i also bring real 3D context from my Blender coursework. i am not guessing at what artists need from this fix. i have hit the same wall myself.

non-technically i bring patience, good communication, and a dual perspective that i think is genuinely rare. i am both the person this bug hurt and the artist fixing it. i have been on the artist side — spending hours texturing a character in Blender and watching it come out wrong. i know exactly what that frustration feels like. that makes me care about getting this right in a way that goes beyond the technical challenge. i communicate clearly when something is complicated, which i think matters in open source where reviewers need to trust your reasoning not just your code. and i am honest about what i do not know. i do not oversell what i have built or pretend a proof of concept is a finished solution. i think that kind of straightforwardness saves everyone time.

### 1.3.3 what i want to develop

i want to learn how to write visual regression tests for 3D rendering. i know how to test backend systems and APIs but testing what a GPU actually draws is something i have not done at a production level and i want to. i also want to experience a full open source PR review cycle with senior maintainers on a widely used library. i have shipped PRs before but going through the full cycle with proper review, iteration, and merge on something this architectural is a different level and i am here for that. on the technical side i want to go deeper into GLSL and the shader pipeline because right now my WebGL knowledge stops at the JavaScript layer and i want to go further.

non-technically i want to learn how to break a large architectural change into reviewable chunks that do not overwhelm a reviewer. i have shipped individual fixes before but decomposing something this structural into a PR sequence that a maintainer can actually follow is a different skill entirely. and i want to learn how senior contributors think about API stability and backwards compatibility — when to expose something, when to keep it private, what the long-term cost of a decision is. that kind of judgment does not come from reading. it comes from being in the process with people who have thought about it for years.


***

# Section 2: Contribution & Open Source

**1. a contribution i am most proud of**

[PR #8666](https://github.com/processing/p5.js/pull/8666)

the contribution i am most proud of is PR #8666 on p5.js dev-2.0. while doing the deep source read for this proposal, i found a boolean logic error at lines 655-658. the hasColoredVertices === hasColorlessVertices condition caused blender, maya, tinkercad, and sketchfab exports to crash instead of loading gracefully. i opened the fix while doing the deep source read for this proposal, not as a separate investigation.

what i learned is that the best way to understand a codebase is to read it with the intention of using it, not just studying it. i was not hunting for bugs. i was following data through a pipeline. the bug appeared because i was paying attention, not because i was looking for it.

beyond code, i try to stay genuinely present in the community. when i filed [issue #8219](https://github.com/processing/p5.js/issues/8219) about the browser freeze for geometry over 65k vertices, i did not just report and leave. i had a back-and-forth with **dave** ([@davepagurek](https://github.com/davepagurek)) investigating whether libtess was hitting a hard index limit or simply slowing down on complex intersecting shapes, before eventually opening the fix. i have also filed several issues on the p5.js web editor after spotting security vulnerabilities and rough edges while contributing there. i think that kind of investigation work, digging into why something breaks and not just that it does, is where i naturally end up.

i am pretty hands-on when someone around me is stuck. i remember a friend trying to contribute to an open source project for the first time who kept hitting walls on the setup. i walked him through it step by step. watching it click for him felt more satisfying than most code i have shipped. that is part of why i filed [issue #3999](https://github.com/processing/p5.js-web-editor/issues/3999) on the web editor when i noticed the installation documentation was unclear about when to use Docker versus manual setup. someone else would have hit that same wall. fixing the documentation is the same instinct as helping the friend.

**2. a p5.js sketch i made that i am most satisfied with**

[Raymarched Anomaly Sketch](https://editor.p5js.org/nityamt199/sketches/N7Wov74qW)

**The Story & Motivation**

I’ve always been fascinated by astrophysics and classic sci-fi tropes—specifically the idea of ancient, hyper-advanced technology floating out in deep space. I wanted to create a scene that felt like you just stumbled upon a navigational beacon or a containment field holding a miniature singularity. 

But beyond the artistic vision, my primary motivation was to understand the WebGL rendering pipeline from the inside out. I wanted to build this entire 3D world—the morphing shapes, lighting, shadows, and reflections—using pure math in a fragment shader. There is no mesh data, no OBJ files, and no textures loaded from disk. The GPU simply runs the same GLSL code in parallel for every pixel on the screen, every single frame.

**Why I am most satisfied with it**

Building this forced me to understand exactly how rendering works under the hood. To make the singularity look realistic, I had to manually code:

* How a ray cast from the camera intersects a mathematical surface using **Signed Distance Fields (SDFs)**.
* How **soft shadows** are estimated by marching a ray toward a light and measuring its proximity to occluders.
* How **ambient occlusion** approximates indirect light by sampling the scene in a hemisphere around the surface normal.
* How **Fresnel reflectance** changes a surface's apparent color based on the viewing angle.

That deep, foundational understanding is what I am most proud of. It is exactly what later allowed me to read p5.js's WebGL source code and immediately spot a structural problem in their OBJ loader. Because I knew how the pipeline worked, I realized the entire scene resolves to one `gl.drawElements()` call, and a single draw call can only have one texture bound. Knowing that the fix requires a deeper architectural change rather than a quick patch is a direct result of the trial and error it took to build this raymarcher. This sketch is exactly how I got there.

**3. a p5.js sketch by someone else that inspires me**

[Growth by atzedent (Matthias Hurrle)](https://openprocessing.org/sketch/2679978)

the first time i ran it i just sat there for a while. it looks like coral shifting underwater. there is something genuinely calm about watching it, the way the patterns breathe and reorganise when you move the mouse. it does not feel like code. it feels like something that is alive and does not know you are watching it.

what got me was the gap between what it is and what it looks like. it is mathematics. it is a loop running in a browser tab. but it produces something that feels organic and unhurried in a way that most generative art does not. i kept wanting to understand the technique behind it, not to copy it, but because i could not figure out how something written in code could feel that peaceful. that curiosity is what creative coding does at its best. it makes you ask how, not just what.

**4. an open source project i use regularly**

[Blender](https://github.com/blender/blender)

i use Blender regularly as part of my gaming and animation elective. we model characters, rig them, texture them, and export them. Blender is fully open source under the GPL license and it is one of the best examples of open source done right — a tool that competes with expensive industry software purely because a community decided it should exist. the fact that the OBJ files i export from Blender are the exact files this project learns to handle correctly is not a coincidence. i came to this project from the Blender side first.

**5. what is most important to make open source accessible**

i think open source becomes truly accessible when three things are in place:

- the community has to feel safe. the biggest barrier is not technical, it is the fear of being dismissed. a welcoming environment that values patience and mentorship turns silent users into active contributors.
- the tooling has to be approachable. clear documentation and a setup process that does not break on the first try ensures people do not give up before writing their first line of code.
- the software itself has to be built for people who do not know how it works inside. complex functionality should be invisible by default so that a beginner is not blocked by what they do not yet understand.

i have tried my best to emphasize the same in my proposal, complex features happen under the hood. by prioritising zero regression architecture, a beginner can simply call loadModel() without worrying about GPU caching or breaking their existing sketches.

ultimately, an open source project is accessible when it is as intuitive to use as it is welcoming to build.


***

# Section 3: Proposed Work

## 3.1 synopsis

when a beginner downloads a 3d model from sketchfab, exports one from blender, maya, or tinkercad, and types `loadModel('robot.obj')` in p5.js, they expect their robot to look like the preview, textured, coloured per part, alive. instead they get a flat broken shape. the reason is a single architectural limitation: p5.js currently flattens all obj geometry into one vertex array and issues a single `gl.drawElements()` call with one texture bound. multi-material models are **silently destroyed at parse time**.

the difference is not subtle:

| before (p5.js today) | after (this project) |
|---|---|
| <p align="center"><img src="https://github.com/user-attachments/assets/c9649c7f-2f96-4213-a6ad-08f7132688f9" /></p> | <p align="center"><img src="https://github.com/user-attachments/assets/b283bc81-e1ee-4c68-8add-6d052804121f" /></p> |
| **[run it live](https://editor.p5js.org/nityamt199/sketches/me0kpve3H)** and this is what p5.js currently produces. same character, 12 material groups in the obj file, all of them collapsed into one flat grey material. hair, skin, jacket, eyes, shoes, completely indistinguishable. | **[run it live](https://editor.p5js.org/nityamt199/sketches/ZmVzb02vG)** and this is the poc with the slicer. same geometry, same user call, every material group renders with its own texture and colour. *(geometry assembled via `buildGeometry()` to simulate what the parser will produce - loading real `.obj`/`.mtl` files is detailed in sections 3.4.2 and 3.4.3)* |

both sketches use the exact same geometry and the exact same `model()` call. the only difference is whether the renderer knows how to loop through material slices.

what makes this worse is that **the failure is completely silent**. `loadModel()` resolves successfully and hands back a geometry object. the user stares at a grey blob and assumes they did something wrong. they eventually find out they need to open blender and bake textures. most of them give up long before that.

this project removes that wall **without changing a single line of user code**. under the hood, the parser is taught to slice geometry by material boundary, and the renderer is taught to loop through those slices, each with its own texture and material uniforms.

this is directly in line with p5.js's core value: reduce cognitive load, maximise access. a beginner should not have to open blender, learn uv-baking, or understand what a `uSampler` is. they should just be able to use art.


## 3.2 the problem, stated precisely

the diagram below shows where the data is lost. the obj file has all the material information including the usemtl boundaries, the map_Kd texture paths, the Kd colour values. parseMtl() reads them correctly. but parseObj() discards all the structure and dumps everything into one flat vertex array. by the time the data reaches the renderer, the material boundaries are completely gone and gl.drawElements() has nothing to work with except one flat blob.

this architectural limitation is on record. in [issue #6117](https://github.com/processing/p5.js/issues/6117), a community member asked directly why mtl files were being ignored. **dave** ([@davepagurek](https://github.com/davepagurek)) explained: `loadModel()` has no data structure capable of representing shape and materials as separate entities. that explanation is from 2022. this proposal is an attempt to address it directly.

<p align="center"><img width="697" height="654" alt="Screenshot 2026-03-22 at 4 00 34 PM" src="https://github.com/user-attachments/assets/e00c878e-492b-4ef1-96b7-7e02fa45a968" /></p>


## 3.3 my approach and the three options i considered

when i first approached this problem i identified three possible architectural solutions. **diya** ([@diyaayay](https://github.com/diyaayay))'s directive and **dave** ([@davepagurek](https://github.com/davepagurek))'s api feedback helped me narrow to the right one.

### 3.3.1 option a: new public p5.GeometryGroup class (rejected)

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

**diya** ([@diyaayay](https://github.com/diyaayay))'s feedback was explicit: "i'd generally lean toward keeping the grouping logic internal to the existing geometry pipeline unless a separate abstraction clearly improves maintainability. we would generally want to avoid breaking changes, since those are typically reserved for major releases." it also conflicts with **dave** ([@davepagurek](https://github.com/davepagurek))'s parity requirement since users should not have to call a different function for a multi-material model versus a single-material one.

### 3.3.2 option b: public geometry.materialGroups property (rejected)

add a public `materialGroups: Array` field to `p5.Geometry`. the renderer checks for it.

why i rejected it: pollutes the public geometry api. since p5.js documentation is generated from inline comments, a new public property would appear in the reference and create documentation debt. users could also accidentally break their sketch by reading or mutating `materialGroups` without understanding the consequences.

### 3.3.3 option c: private _materialSlices on p5.Geometry (chosen)

attach a private `_materialSlices` array to the geometry object returned by `loadModel()`. each entry is `{ geometry: p5.Geometry, materialProfile: {...} }`. the renderer checks for this private property. **the public geometry api is completely unchanged**.

why this is correct:

- **zero breaking changes**. `loadModel()` still returns `p5.Geometry`, `model()` signature unchanged
- follows p5.js convention: private fields use `_` prefix (`_hasFillTransparency`, `_hasStrokeTransparency`, etc.)
- aligns with **diya** ([@diyaayay](https://github.com/diyaayay))'s directive to keep grouping logic internal
- satisfies **dave** ([@davepagurek](https://github.com/davepagurek))'s api parity: `model(singleMaterialGeom)` and `model(multiMaterialGeom)` are the same call
- the fallback path (no `_materialSlices`) is the existing code with no modification
- closest to how processing4 handles it: `PShapeOBJ` builds an array of `PShape` children internally. each child holds one material group's geometry. the user-facing draw call (`shape(s)`) loops through those children automatically so the user never sees the internal structure. this is the exact pattern i am proposing for p5.js: `_materialSlices` as private internal children, `model()` looping through them, user api completely unchanged. **the fact that processing, the parent project, already solved this the same way is strong evidence the pattern is correct**.


the flowchart below shows how the renderer decides which path to take. if the geometry has no _materialSlices it falls through to the existing single draw call with **zero regression** for all existing sketches. if slices exist it loops through them, binding a new texture and material uniforms for each one before issuing its own gl.drawElements() call.

<p align="center"><img width="560" alt="Screenshot 2026-03-22 at 4 06 03 PM" src="https://github.com/user-attachments/assets/6c22918d-24cd-45d3-8159-a4bf58b617dd" /></p>



## 3.4 technical architecture

### 3.4.1 Phase 1 — community bonding & design decisions

i have researched each of these thoroughly and have a clear position on each one. each decision touches the public api or shader pipeline and should have explicit sign-off from the team before i write production code. i want to align early rather than surface surprises at pr review.

**decision 1: draw order for transparent slices**

when a slice has `d < 1.0` (transparent), correct rendering requires back-to-front draw order. i have thought through three options:

option a: sort transparent slices at load time based on estimated depth from the geometry bounds.

option b: document that artists should order transparent faces last in their obj export, which is what most 3d tools already do by convention.

option c: expose a `loadModel('file.obj', { sortTransparent: true })` option for users who need it.

my current position is option b for v1, because it adds zero complexity, it matches what artists already do in blender and maya, and option c can follow as a documented enhancement. i want to confirm with **diya** ([@diyaayay](https://github.com/diyaayay)) and **claudine** ([@mingness](https://github.com/mingness)) that this matches how the team thinks about v1 scope before committing.

**decision 2: buildGeometry() material boundary detection**

should mid-draw material state changes automatically create a new slice (always-on), or should this be an opt-in flag?

i prefer always-on. the overhead is o(1) per draw call since it is just comparing a few uniform values against the previous call. most sketches that use `buildGeometry()` do not change materials mid-draw, so the detection cost is nearly always zero. an opt-in flag adds api surface area without meaningful benefit. i want to run this past **dave** ([@davepagurek](https://github.com/davepagurek)) since it touches the behaviour of an existing api. if the team prefers opt-in, i will ship the `buildGeometry()` integration as a separate pr after the core multi-material fix lands - phase 5 is already labelled as an extra deliverable, so the main timeline is not affected either way.

**decision 3: texture loading, eager vs lazy**

i prefer eager loading. all `map_*` textures get loaded inside `loadModel()`, which the user awaits in `async setup()`. since dev-2.0 awaits `setup()` before starting the draw loop, everything is ready before `draw()` starts. this is the simplest mental model and consistent with how dev-2.0 handles all async asset loading.

lazy loading (loading on first render) would reduce startup time for models with many materials but adds state tracking, potential one-frame flicker, and more error-handling surface area. i think that tradeoff is not worth it for a first implementation. lazy loading can be a follow-up once the eager path is stable.

**decision 4: private field convention**

should `_materialSlices` use the `_` prefix convention (as most private fields in this codebase do) or es2022 `#` private fields?

i checked the codebase and the `_` convention is overwhelmingly dominant. `#` private fields appear in almost none of the existing code. my preference is to match the existing convention and use `_materialSlices` for consistency, but i will follow whatever the team decides here since it is a style question not a technical one.

**decision 5: pbr properties like metalness (**dave** ([@davepagurek](https://github.com/davepagurek))'s point)**

**dave** ([@davepagurek](https://github.com/davepagurek)) specifically mentioned metalness alongside specularMaterial and textures as things that could not currently be swapped inside one geometry. the classic mtl format does not have a metalness field at all, it predates pbr pipelines entirely. so this raises a real question: should the materialProfile schema be extended to support pbr properties beyond what the mtl spec defines?

my position is to not include metalness in this gsoc project, and here is why i came to that conclusion. the mtl format covers `Kd`, `Ks`, `Ka`, `Ns`, `d`, `map_Kd`, `map_Ks`, `map_Bump` and a handful of others. that is already a full project's worth of work to parse, load, and bind correctly. metalness in the pbr sense comes from gltf and other modern formats which have a completely different pipeline. trying to bolt it onto the mtl materialProfile now would mean designing a schema that serves two different file format families at once, which is the kind of thing that produces awkward apis.

what i will do instead is design the materialProfile object to be extensible from the start. the schema is a plain javascript object, so adding `metalness: null` as a field in a follow-on pr is trivial once someone decides what source format should populate it. i will also file a github issue at the end of gsoc that formally tracks pbr materialProfile extensions so the conversation happens in the right place.

i want to confirm with **dave** ([@davepagurek](https://github.com/davepagurek)) that this sequencing makes sense, since he was the one who raised it. before gsoc ends i will open a github issue formally tracking pbr materialProfile extensions (metalness, roughness, gltf alignment) so the conversation has a home and other contributors can pick it up.

the architecture described in this proposal is my strongest current recommendation based on the codebase reading, the poc, and the mentor conversations so far. that said, i fully expect the implementation details to evolve once the wider team weighs in during pr review. that is a normal and healthy part of contributing to an open source project and i am ready to adapt as reviewers surface things i have not anticipated.

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

### 3.4.2 Phase 2 — extend parseMtl()

**parseMtl() extended:**
```
current:  Kd, Ka, Ks, map_Kd (stored but unused)
proposed: Kd, Ka, Ks, Ns, d, illum + map_Kd, map_Ka, map_Ks, map_Bump, map_Ns
          all map_* values trigger loadImage() inside loadModel(), awaited in
          async setup(), so all textures are resolved before draw() starts
```

two options for when `map_Kd` textures are loaded from `parseMtl()`:

**option a: eager loading (chosen):** all `map_*` paths trigger `loadImage()` calls inside `loadModel()`. in dev-2.0, `preload()` is replaced by `async setup()` - the user writes `await loadModel(...)` and `draw()` does not start until `setup()` resolves. **textures are guaranteed ready before the first frame**. no complexity.

**option b: lazy loading (not chosen):** load textures on first render. reduces initial load time for large models with many materials but adds state tracking and potential one-frame flicker.

i propose option a for this project. option b can be a follow-up optimisation with a cache.

the async coordination works as follows: `loadModel()` is already an `async` function. `parseMtl()` is a private module-level function with no sketch instance access - it returns raw texture path strings, exactly as it returns `texturePath` today. `fn.loadModel()`, which has sketch instance access via `this`, iterates those paths after `parseMtl()` resolves and calls `this.loadImage()` on each one, pushing the returned promise into a flat array. before `loadModel()` resolves, it awaits `Promise.all(texturePromises)`. this guarantees every slice's textures are fully decoded before `loadModel()` returns. since the user writes `let model = await loadModel(...)` inside `async setup()`, and dev-2.0's runtime awaits `setup()` before starting the draw loop, all textures are guaranteed ready before the first frame - **no race condition, no flicker**. the old `_incrementPreload`/`_decrementPreload` counter system from p5.js 1.x does not exist in dev-2.0 and is not needed here.

### 3.4.3 Phase 3 — rewrite parseObj() slicer

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

### 3.4.4 Phase 4 — extend Renderer3D.model()

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

### 3.4.5 Phase 5 — buildGeometry() integration

**dave** ([@davepagurek](https://github.com/davepagurek)) noted: "similarly for building groups by using `buildGeometry` and swapping between things we can't currently support in one geometry, like textures, but also things like metalness, specularMaterial, etc."

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

### 3.4.6 error handling & failure modes

three failure modes and how the implementation handles each:

**mtl file missing:** `parseMtl()` is only called when the obj parser finds an `mtllib` directive and the fetch succeeds. if the fetch fails, the model loads as single-material geometry using the existing single-draw path - same behaviour as today, **zero regression**.

**texture path 404:** if a `loadImage()` call for a `map_*` path fails, that slice's texture field is set to `null`. the renderer already has a fallback for `map_Kd === null`: it applies `diffuseColor` as `ambientMaterial` instead. a 404'd texture degrades to a flat-coloured slice rather than a broken render. a `console.warn()` is issued with the failed path - **unlike today where this failure is completely silent**.

**partial mtl (mixed textured and untextured slices):** each slice is resolved independently. slices with a valid `map_Kd` get a texture. slices without one (or whose texture failed) get `diffuseColor`. **no slice's failure affects any other slice**.

the diagram below shows all three layers together: parser, data, and renderer, and how they connect. the parser produces the slices, the data layer holds them privately on the geometry object, and the renderer loops through them at draw time. each layer is independently testable and the public api never changes.

<p align="center"><img width="568" height="577" alt="Screenshot 2026-03-22 at 4 11 16 PM" src="https://github.com/user-attachments/assets/14c64665-824a-412b-8b91-5eef523e0a49" /></p>

### 3.4.7 Phase 6 — visual tests, unit tests, fixture files

testing a 3d renderer is fundamentally different from testing logic code. the output is pixels produced by a gpu, and gpu output can vary slightly across machines and drivers. p5.js handles this with a screenshot comparison approach that renders a sketch headlessly and diffs pixels against a stored reference image within a configurable tolerance. phase 6 delivers three categories of tests.

**visual regression tests (screenshot comparison)**

the existing p5.js visual test infrastructure in `test/unit/visual/` renders sketches via a headless browser and compares the output pixel-by-pixel against reference images stored in the repository. i will add visual tests covering:

- a multi-material model with 3+ distinct materials renders each part with the correct texture and colour. the reference image is captured once and committed. future runs must match within tolerance.
- a single-material model rendered via the new code path produces output identical to the pre-gsoc reference. this is the zero-regression proof: the fallback path (`no _materialSlices`) must be pixel-identical to the old code.
- a model with a missing texture path renders with flat `diffuseColor` per affected slice rather than crashing or going entirely grey. the `console.warn()` must be emitted.
- a model with mixed textured and untextured slices renders correctly: textured slices show their texture, untextured slices show their `diffuseColor`.

**unit tests (parser logic)**

visual tests validate the final render. unit tests validate each layer independently, without a gpu.

`parseMtl()` unit tests:
- all standard mtl tokens (`Kd`, `Ka`, `Ks`, `Ns`, `d`, `illum`, `map_Kd`, `map_Ka`, `map_Ks`, `map_Bump`, `map_Ns`) are parsed and stored on the material object correctly.
- a mtl file with only `Kd` (the current common case) still parses without error.
- a malformed mtl file (missing values, unknown tokens) does not throw — unknown tokens are silently skipped, same as the current behaviour.

`parseObj()` slicer unit tests:
- a two-material obj produces exactly 2 entries in `_materialSlices`, each with the correct vertex count.
- a single-material obj produces no `_materialSlices` on the parent geometry (falls through to existing single-draw path).
- face indices in each slice are local to that slice — no global index bleed between slices.
- uv coordinates are correctly remapped: a vertex that shared a global `vt` index with another slice gets its own per-slice local uv index.
- `computeNormals()` is called per slice when the obj file has no `vn` lines, matching the existing fallback.

**fixture obj/mtl files**

the test suite requires small, deterministic fixture files committed to `test/unit/assets/`. i will create:

| fixture | purpose |
|---|---|
| `multi_material_2.obj` + `.mtl` | minimal 2-material model (two cubes, two materials, one texture each) — primary test case |
| `multi_material_12.obj` + `.mtl` | 12-material model matching the poc character — stress test for buffer caching |
| `single_material.obj` + `.mtl` | 1 material — regression: must use existing single-draw path, not multi-draw |
| `no_mtl.obj` | obj with no `mtllib` directive — regression: loads as untextured geometry, no error |
| `missing_texture.obj` + `.mtl` | mtl references a texture path that does not exist — validates 404 degradation and `console.warn()` |
| `no_normals.obj` + `.mtl` | obj with no `vn` lines — validates `computeNormals()` fallback per slice |

the two-material fixture is hand-authored to be minimal and deterministic. the 12-material fixture is exported from blender to represent a real-world workflow. all fixture files are committed as plain text and kept under 50kb total.

### 3.4.8 Phase 7 — documentation

p5.js documentation is generated from inline jsdoc comments in the source files. the reference pages at p5js.org are built directly from these comments, so jsdoc changes are not cosmetic — they change what users read when they look up a function.

**`loadModel()` — `src/webgl/loading.js`**

the current jsdoc for `loadModel()` says nothing about material files. a user reading the reference today has no way to know that `.mtl` files are supported at all, let alone what the current limitations are. after this project, the documentation needs to:

- clearly state that multi-material `.obj` files with associated `.mtl` files are fully supported.
- document that all textures referenced in the `.mtl` file are loaded automatically — the user does not need to call `loadImage()` separately.
- document the `async setup()` pattern: the user should `await loadModel(...)` inside `async setup()` so that all textures are resolved before `draw()` starts.
- document graceful degradation: if the `.mtl` file is missing or a texture path is invalid, `loadModel()` still resolves successfully — it does not throw.
- include a runnable reference example showing a multi-material model loading correctly with one line of user code.

**`model()` — `src/core/p5.Renderer3D.js`**

the current jsdoc for `model()` documents a single geometry argument. after the change, `model()` transparently handles both single and multi-material geometry. the documentation update:

- makes clear that `model()` works identically for single and multi-material models — the call signature does not change.
- notes that material and texture state from the `.mtl` file is applied automatically per material group. the user does not need to call `texture()` or `specularMaterial()` manually before calling `model()` when using a loaded `.obj` file.

**`buildGeometry()` — `src/core/p5.Renderer3D.js`**

after phase 5, `buildGeometry()` can capture material boundaries automatically when `texture()` or `specularMaterial()` is called mid-draw. the documentation update:

- documents the new behaviour with a code example showing two materials inside one `buildGeometry()` call.
- notes that the resulting geometry can be passed directly to `model()` and renders correctly.

**reference page examples**

each reference page in p5.js includes a live runnable example embedded in the page. i will write examples for all three functions that can be run directly in the p5.js web editor. the examples will use publicly hosted texture images so they work without any local file setup. the `loadModel()` example will load a real multi-material model hosted at a stable url and demonstrate the before/after difference in a single sketch.

### 3.4.9 Phase 8 — api parity audit, edge cases, performance & follow-up issues

phase 8 is not a cleanup phase. it is a deliberate audit pass that treats the implementation as a black box and systematically tests every assumption made during development. it is also where the project formally hands off unfinished work to the wider community through github issues.

**api parity audit**

**dave** ([@davepagurek](https://github.com/davepagurek))'s core requirement was that `model()` must behave identically for single and multi-material geometry from the user's perspective. the audit verifies this across every context where `model()` can be called:

- inside `push()`/`pop()`: material state set before `model()` must be fully restored after. verified with a sketch that sets `texture(myTex)`, calls `model(multiMaterial)`, then draws another shape that must still use `myTex`.
- with the `count` parameter (webgl2 instanced rendering): `model(geom, 12)` must work for multi-material geometry the same way it works for single-material geometry.
- with `orbitControl()`: the multi-draw loop must not interfere with the camera transform applied before rendering.
- inside another `buildGeometry()` call: `model()` called inside a `buildGeometry()` callback must add the geometry correctly regardless of whether it has `_materialSlices`.
- with `lights()`, `directionalLight()`, `pointLight()`: lighting must apply correctly to each slice, not just the first one.

**edge case testing**

beyond the fixture files from phase 6, the audit covers edge cases that are hard to anticipate during implementation:

- obj with `usemtl` referencing a material name not defined in the `.mtl` file. the slicer must handle a missing material lookup gracefully — fall back to default material rather than throwing.
- obj with duplicate `usemtl` names (same material used in two non-contiguous face groups). each occurrence creates its own slice. the result is two slices with the same `materialProfile` but separate vertex arrays. this is correct and intentional — the gpu needs separate draw calls for non-contiguous geometry.
- mtl file with windows-style path separators (`\`) in texture paths. `path.normalize()` or equivalent must handle both unix and windows separators since artists export from different operating systems.
- very large model (100+ material groups): gpu buffer cache must handle 100+ separate `gid` entries without memory issues. the `_getOrMakeCachedBuffers()` function uses a hash map keyed on `gid` — this scales linearly and has no known upper limit, but it should be verified empirically.
- model rendered inside `pg.drawingContext` (a `p5.Graphics` object): the renderer instance is different from the main canvas renderer. the multi-draw path must work correctly in this context since users frequently render models to offscreen graphics buffers.

**performance**

the per-slice architecture introduces `n` gpu buffer cache lookups and `n` draw calls per frame, where `n` is the number of material groups. for typical models (5–20 materials), this is negligible. for extreme cases (100+ materials), it is worth measuring.

i will benchmark frame rate for a 12-slice model at 60fps against a baseline single-material model across three environments: chrome on desktop, firefox on desktop, and safari on mac. if any environment shows more than 10% frame rate regression for a 12-slice model compared to a single-material model, i will investigate whether the buffer cache lookup is the bottleneck or whether the draw call overhead itself is the issue.

the gpu buffer upload (via `_getOrMakeCachedBuffers()`) happens exactly once per slice — on the first frame after `loadModel()` resolves. subsequent frames only issue draw calls against already-uploaded buffers. this is the same behaviour as a single geometry today. the audit will include a frame counter that confirms no re-upload happens on frame 2 and beyond.

**follow-up github issues**

before gsoc ends, i will file the following github issues to formally track work that is out of scope for this project but directly adjacent to it:

| issue | description |
|---|---|
| `map_Ks` shader binding | specular map parsed and stored in `materialProfile` but not bound to a shader uniform. requires adding a `uSpecularSampler` uniform to `src/webgl/shaders/` and wiring it in `_setFillUniforms()`. |
| `map_Bump` / normal mapping | bump/normal map parsed and stored but not applied. requires a `uNormalSampler` uniform and a normal-mapping calculation in the fragment shader. significant shader work. |
| lazy texture loading | eager loading is simple and correct for v1. lazy loading (load on first render) reduces startup time for models with many materials. requires a `textureLoaded` flag per slice and a deferred `loadImage()` call. |
| pbr materialProfile extension | `metalness`, `roughness`, and `ao` are not in the classic mtl spec but are present in gltf and modern pipelines. the materialProfile schema should be extended to support these once gltf loading is on the roadmap. |
| gltf format support | gltf is the modern replacement for obj/mtl, with built-in pbr materials. a separate `loadModel()` code path for `.gltf` files would reuse the `_materialSlices` architecture established by this project. |

each issue will include a link back to the relevant section of this proposal so future contributors have full context on the design decisions already made.

## 3.5 proof of concept

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


## 3.6 expected outcomes

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


## 3.7 accessibility angle

p5.js's mission is access and inclusion. **kit** ([@ksen0](https://github.com/ksen0)) made this explicit in the session: "all new proposals should make the argument of how the new feature improves access and inclusion." this project has a direct and concrete answer to that.

sketchfab is the world's largest free 3d asset library. it has millions of downloadable models spanning art, culture, science, education, and games. the majority of those models are exported as obj plus mtl, the most common interchange format. every single one of those models has multiple materials. and every single one of them renders as a flat grey blob in p5.js today. the same is true for any model exported from blender, maya, or tinkercad - the obj/mtl format is universal across all 3d tools and p5.js breaks all of them the same way.

the problem is made worse by how it fails. `loadModel()` returns successfully with no error and no warning. the user did everything right. **the failure is completely silent**.

who exactly gets blocked by this today:

**students in 3d and animation courses.** this is my own situation. i take an elective where we model, rig, and texture characters in blender and then bring them into creative coding environments. every student in that class who tries to use p5.js hits the same wall. the character they spent hours texturing comes out grey and flat. p5.js is supposed to be the gentle on-ramp to creative coding. right now it is a dead end for anyone coming from a 3d background.

**educators building 3d assignments.** a teacher who designs a unit around loading and animating a sketchfab, blender, or maya model cannot know in advance that every model will break. the failure is silent and the fix (baking textures in blender) requires software the students do not have and a skill set that takes hundreds of hours to learn. the assignment has to be redesigned or abandoned.

**artists and makers who are not software engineers.** p5.js is specifically designed for people who create, not people who debug rendering pipelines. an artist who downloads a model from sketchfab or exports one from blender, maya, or tinkercad and calls `loadModel()` is doing exactly what the documentation says to do. the broken result looks like their fault. many of them conclude p5.js cannot do 3d and stop.

**beginners on the p5.js web editor.** p5.js 2.0 becomes the default in the web editor in august 2026. every beginner who opens the editor after that date and tries 3d will hit this wall on day one, with no error message and no path forward.

the specific gatekeeper this project removes:

1. user finds a model on sketchfab or exports one from blender, maya, or tinkercad
2. loads it in p5.js with `loadModel()` (one line, as documented)
3. model renders broken, no error, user is confused
4. user searches and finds they need to bake textures in blender
5. blender has a learning curve of hundreds of hours and is not installed by default anywhere
6. user gives up and abandons the 3d direction entirely

after this project: step 3 renders correctly. steps 4, 5, and 6 do not happen. **the creative coding on-ramp stays open**.

an educator can now assign any sketchfab model as a starting point without pre-processing. a student opens the p5.js web editor, loads the model, and sees the jacket the right colour and the skin the right tone on the first run - exactly as the artist exported it from blender. no blender install, no bake textures step, no silent failure. that is what this project actually delivers.

this failure is independently documented by users who have no connection to each other. in [this discourse thread from 2019](https://discourse.processing.org/t/load-obj-model-with-mtl-file-and-jpg-texture/4634), multiple users reported that `loadModel()` loads the mesh but ignores the texture entirely  - the only workaround discovered was to manually `loadImage()` and flip the texture vertically via `createGraphics`. in [this thread](https://discourse.processing.org/t/how-can-i-color-or-texture-each-faces-of-a-loaded-obj-file/12688), a user asked specifically how to colour each face of a loaded obj file  - the answer was that there is no native solution. same wall, different years, different people. the fix never came because it required an architectural change, not a patch.


## 3.8 why i chose this project and what i bring to it

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
- referenced pr #6710 (original mtl implementation by **diya** ([@diyaayay](https://github.com/diyaayay)) and **dave** ([@davepagurek](https://github.com/davepagurek))), issue #6924 (formal feature request tracking what is missing), processing4's `PShapeOBJ.java` (reference implementation for the internal children pattern)
- working poc built on dev-2.0 apis (`buildGeometry()`) before writing this proposal, not after
- direct conversations with **diya** ([@diyaayay](https://github.com/diyaayay)), **dave** ([@davepagurek](https://github.com/davepagurek)), and **kit** ([@ksen0](https://github.com/ksen0)) that shaped the architecture documented in sections 5.1.3 and 3.3



***

# Section 4: Timeline

## 4.1 scope and why this is 300 hours

the gsoc idea page lists this as 175h or 300h. i am proposing 300h because:

1. the parser rewrite is non-trivial. vertex deduplication, uv mapping, and face winding all need to work correctly per-slice.
2. visual tests for 3d rendering are significantly more complex than unit tests.
3. after the feedback i received, i plan to allocate time to read all geometry-related references and file issues for unimplemented apis so other contributors can continue the work after gsoc.
4. the `buildGeometry()` integration (phase 5) is an extra deliverable not in the original spec.

| phase | work | weeks | hours | buffer (hrs) |
|---|---|---|---|---|
| Phase 1 | community bonding: study all geometry apis, read processing4's PShapeOBJ.java, draft architecture doc, get sign-off from **diya** ([@diyaayay](https://github.com/diyaayay)), **claudine** ([@mingness](https://github.com/mingness)) → §3.4.1 | week 1-2 | 40h | 5h |
| Phase 2 | extend `parseMtl()`: all mtl tokens and texture loading pipeline → §3.4.2 | week 3-5 | 35h | 5h |
| Phase 3 | rewrite `parseObj()` slicer: per-material vertex buckets, uv mapping per slice, face-index localisation → §3.4.4, §3.4.6 | week 6-8 | 55h | 15h |
| community checkpoint | post working slicer demo sketch on Discourse and Discord for community testing. gather feedback before renderer work begins. | end of week 8 | - | - |
| Phase 4 | extend `Renderer3D.model()`: multi-draw loop, per-slice material binding, buffer cache per slice → §3.4.4, §3.4.6 | week 9-11 | 50h | 15h |
| community checkpoint | post full multi-material render demo on Discourse with real sketchfab model. open for community feedback before visual testing phase begins. | end of week 11 | - | - |
| Phase 5 | `buildGeometry()` mid-draw material boundary detection → §3.4.5 | week 12-13 | 35h | 5h |
| Phase 6 | visual tests (screenshot comparison), unit tests, fixture obj/mtl files → §3.4.7 | week 14-16 | 40h | 5h |
| Phase 7 | docs: jsdoc for `loadModel()`, `model()`, `buildGeometry()`; reference page examples → §3.4.8 | week 17-18 | 25h | 5h |
| Phase 8 | api parity audit, edge cases, performance, create follow-up issues for unimplemented features → §3.4.9 | week 19-20 | 20h | 5h |
| **core total** | | **week 1-20** | **300h** | **60h** |
| overflow + stretch | if any phase runs over, absorb up to 25h of slippage here. if on schedule, stretch goal priority: (1) better error messages when map_Kd path is missing, (2) additional test fixtures with real sketchfab models, (3) pbr property stubs on materialProfile for follow-on contributors | week 21-22 | up to 25h | - |
| **gsoc total** | | **22 weeks** | **300h** | - |

the buffer column is not additional time on top of 300 hours. it is already counted inside each phase's hours. for example, phase 3 is allocated 55h total, out of which 15h is breathing room for code review cycles, unexpected edge cases, and pr iteration. the remaining 40h is the actual implementation work. every phase is structured this way. the total project hours stay at 300h.

phases 3 and 4 carry the most risk since the vertex deduplication logic and the renderer buffer cache both have non-obvious interactions with the rest of the geometry pipeline. this is why their buffer is 15h each instead of 5h. if a phase finishes under estimate, the saved hours roll into phase 6 since testing can always absorb more time. if phase 3 still overruns despite the buffer, phase 5 (`buildGeometry()` boundary detection) is the first candidate to defer - it is an extra deliverable beyond the original spec and can ship as a follow-up pr without affecting the core multi-material fix. if both phases 3 and 4 overrun, phase 6 testing is reduced to core regression tests only - the visual screenshot comparison suite is deferred to a follow-up pr. **the core deliverables (parser, data layer, renderer) are never at risk**.

weeks 21 and 22 are the final two weeks of the 22-week gsoc window. no new work is scheduled here. if a phase earlier in the timeline ran longer than expected, these weeks absorb that slip without any risk to the final deliverables. if all phases finished on time, these weeks become stretch goal time for features that are out of scope for v1 but worth filing as follow-up issues.



***

# Section 5: Research


## 5.1 background and what i already know

### 5.1.1 the existing implementation (pr #6710, merged by **diya** ([@diyaayay](https://github.com/diyaayay)) and **dave** ([@davepagurek](https://github.com/davepagurek)))

i read through the entire pr #6710 (.mtl color support, merged 2024) to understand where the current code sits:

- `parseMtl()` parses `Kd`, `Ka`, `Ks`, and `map_Kd` (texture path stored but never used)
- `parseObj()` reads `usemtl` tokens and bakes the `Kd` diffuse colour into `model.vertexColors` as flat rgba values
- the result is a single `p5.Geometry` with per-vertex colour but no texture, a lossy representation
- `map_Ka`, `map_Ks`, `map_Bump`, `map_Ns`, `d`, `illum` are **silently ignored**

issue #6924 (filed by sableraf) formally tracks what's missing. this project resolves it completely.

the collapsing approach introduced by #6710 had immediate side effects  - pr #6921 was filed and fixed within the same release cycle because vertex deduplication was destroying texture coordinates for models where vertices are shared across faces. davepagurek's fix in pr #6923 explicitly documents how the single-array design makes per-material texture assignment structurally impossible. the architecture that caused #6921 is the same architecture this project replaces.

### 5.1.2 what i found in the dev-2.0 codebase

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
- **dave** ([@davepagurek](https://github.com/davepagurek))'s comment on the pr architecture: "if `loadModel` could load a group or a single geometry, we'd want them to behave as similarly to each other as possible, so if you draw a single geometry with `model`, then one would expect that to work for a group too."

### 5.1.3 how mentor and community feedback shaped this proposal

the proposal you are reading is not the first version. it went through real iterations based on direct mentor feedback, community-reported issues, and public discourse conversations, and that process is worth documenting because it changed the architecture.

when i first shared a prototype sketch with **kit** ([@ksen0](https://github.com/ksen0)), she noticed it was running on p5.js 1.x. her exact note was that `beginGeometry` and `endGeometry` do not exist in dev-2.0. i went back and read the dev-2.0 webgl source directly at `src/core/p5.Renderer3D.js`. that is where i found `buildGeometry(callback)` as the replacement. i rebuilt the entire poc from scratch using this api. that process is what revealed the full extent of what had changed in the 2.0 renderer and why the architecture needs to be designed specifically for it, not retrofitted from 1.x thinking. that same sketch also helped **kit** ([@ksen0](https://github.com/ksen0)) identify a mistake in the new p5.js 2.0 reference, which she filed as issue #8631. it is a small thing, but it is a reminder that sharing early work in public spaces produces real signal even before a line of gsoc code is written.

in 2022, **diya** ([@diyaayay](https://github.com/diyaayay)) opened pr #7176, exploring this exact feature space with a `p5.Material` + `p5.Group` class hierarchy to decouple geometry from material state. **dave** ([@davepagurek](https://github.com/davepagurek)) noted: *"the direction is right but needs more design work."* that earlier exploration informed the architecture of this proposal directly. **diya**'s choice to mentor this proposal reflects genuine continuity in the community's investment in this problem. and in issue #6670, **dave** ([@davepagurek](https://github.com/davepagurek)) wrote in 2022: *"we'd need a new class containing multiple p5.Geometry objects with material settings for each."* `_materialSlices` is a direct response to that design question, which has remained open since 2022.

when i asked **diya** ([@diyaayay](https://github.com/diyaayay)) about the approach for this proposal, she pushed back on any design that would expose a new public class. her feedback was clear: keep the grouping logic inside the existing pipeline, avoid anything that looks like a breaking change. that is what killed option a (new `p5.GeometryGroup` class) and sent me toward `_materialSlices` as a private field.

**dave** ([@davepagurek](https://github.com/davepagurek)) confirmed the overall direction was right and added one more constraint: api parity. `model()` must behave identically for single and multi-material geometry. that became the core test for every architectural decision in section 3.3.

**diya** ([@diyaayay](https://github.com/diyaayay)) also asked directly whether each slice would carry its own complete material object, including `map_Ks`, `map_Bump`, and other mtl texture maps, not just the diffuse texture. that question is why section 3.4.1 defines a full `materialProfile` schema rather than just storing a single texture reference per slice.

**connie** ([@khanniie](https://github.com/khanniie)) mentioned that the strongest proposals have three things: personal enthusiasm for the subject matter, a poc with real code, and evidence of previous contributions. that framing helped me make sure all three are visible in this proposal.

beyond the mentors, the community has independently reported this same failure repeatedly. issue #7346 (obj models not displaying materials even when `normalMaterial()` is called explicitly) and issue #4032 (`texture()` not working for loaded model objects) are both filed by regular p5.js users who hit the wall without knowing why. this proposal addresses the root cause that both of those issues trace back to: the obj parser discards material boundaries before the renderer ever sees them. **the fact that unrelated users filed the same bug independently, years apart, is the clearest possible signal that the fix belongs in the core library**.

### 5.1.4 previous attempts and why they stalled

this is not a new problem, and this proposal builds on prior exploration. three contributors investigated this before and each identified the right problem area. each attempt contributed to the understanding of what a complete architecture needs to look like. `_materialSlices` is an attempt to answer the design question that each of those efforts raised.

| pr | author | year | what it tried | why it stalled |
|---|---|---|---|---|
| [#7176](https://github.com/processing/p5.js/pull/7176) | diya | 2022 | `p5.Material` + `p5.Group` class hierarchy to decouple geometry from material state | **dave**: *"direction is right but needs more design work"*  - closed |
| [#7072](https://github.com/processing/p5.js/pull/7072) | rohanjulka19 | 2022 | per-material texture mappings stored in `p5.Geometry`, index buffer re-rendered per texture | **dave** raised class design concerns about splitting `p5.Geometry`  - stalled open |
| [#8675](https://github.com/processing/p5.js/pull/8675) | aakritithecoder | 2024 | `map_Ka`, `map_Ks`, `map_Bump` parsing added to `parseMtl()` | closed by **kit** for missing tests and wrong branch  - no architecture |

the common thread: every attempt ran into the same design question **dave** named in [issue #6670](https://github.com/processing/p5.js/issues/6670) in 2022  - *"we'd need a new class containing multiple p5.Geometry objects with material settings for each."* `_materialSlices` is this proposal's answer to that question.

### 5.1.5 my existing contribution

i have an open pr (#8666) on `dev-2.0` that fixes a crash in `parseObj()` at lines 655-658. the `hasColoredVertices === hasColorlessVertices` boolean logic error caused blender, maya, tinkercad, and sketchfab exports to throw instead of loading gracefully. i found this bug while reading `parseObj()` specifically to understand the code i would be working on for this project. it was not a separate investigation, it came directly out of the deep read i did for the proposal. this is also why i know exactly where the slicer needs to be inserted in that function.


***

# Section 6: Practicalities

**eligibility**

i have read the GSoC Rules 7.1 carefully and confirm that i am eligible to participate as a GSoC contributor.

**AI disclosure**

AI tools were used in this proposal for formatting assistance and English grammar corrections only. all technical research, source code reading, architecture decisions, proof of concept, and pull request code are entirely my own work.

**availability**

i have kept this summer open specifically for this project. there are no internships, courses, or side commitments lined up — so the coding period gets my undivided attention. this is not a backup plan; i want to ship something real that p5.js users will actually benefit from, and i intend to treat it with the same seriousness i would give a full-time job.

i am free every day of the week, from 4:00 PM IST to 11:00 PM IST (10:30 AM UTC to 5:30 PM UTC), and i can stretch that window when needed to sync with mentors in different time zones. i prefer to communicate early when something is unclear rather than go quiet — so the team will always know where things stand. written updates or live calls both work well for me; i will follow whatever rhythm the mentors prefer.

