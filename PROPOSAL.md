# GSoC 2026 proposal
## Full texture support for .mtl files in p5.js
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

I am a third-year computer science engineering student at Thapar University, Patiala. I am a systems-oriented developer and most of my work sits in Rust, TypeScript, and distributed systems, spanning multi-agent decision engines, CI/CD infrastructure, and real-time API services. I read research before I write code and I treat every codebase I work in like a production system.

Alongside this, I take an elective in gaming and animation where I work with Blender, modelling and texturing characters for real pipelines. That elective pulled me into JavaScript and WebGL based creative coding tools, and I have been working with p5.js long enough to know its internals well. That combination of low-level systems thinking and hands-on 3D and creative coding work is what shapes how I approach problems.

## 1.2 Project abstract

P5.js currently flattens all geometry from a 3D model into one shape and renders it with a single texture. Every model exported from blender, maya, sketchfab, or tinkercad with more than one material comes out as a flat grey blob with no error and no warning. The user did everything right. The library silently threw away the material information at parse time.

This project fixes that at the root. It rewrites the obj parser to preserve material boundaries, introduces a lightweight private data structure to carry per-material geometry and texture information, and extends the renderer to loop through each material group and draw it correctly. The result is that a fully textured multi-material model loads and renders as the artist intended. The user calls loadModel() exactly as before. Nothing in the public api changes. Every model that currently renders broken renders correctly.

## 1.3 Interests & skills

### 1.3.1 What I find most interesting about this project

What pulls me in is that the fix does not live in one place. It touches the parser, the data layer, and the GPU renderer all at once. Most bugs are isolated. This one is not. You have to understand how an OBJ file encodes material boundaries, how that data survives the parse, and how WebGL actually binds textures at draw time before you can even describe what is broken. I genuinely love that kind of challenge. When I first started reading the source it took me a while, but the moment it clicked, everything started connecting. The existing PRs, the old issues, the design decisions that seemed unrelated at first, they all started pointing at the same root cause. It felt less like reading code and more like following a trail where every clue was already there. I find that kind of thing really fun. I cannot fake my way through it and I do not want to.

### 1.3.2 What I bring

Technically I bring a systems background that makes me comfortable reading unfamiliar source code and tracing data through pipelines before touching anything. I have worked in Rust, TypeScript, and distributed systems long enough that reading a JavaScript renderer and following a buffer through it feels natural to me. I also bring real 3D context from my Blender coursework. I am not guessing at what artists need from this fix. I have hit the same wall myself.

Non-technically I bring patience, good communication, and a dual perspective that I think is genuinely rare. I am both the person this bug hurt and the artist fixing it. I have been on the artist side, spending hours texturing a character in Blender and watching it come out wrong. I know exactly what that frustration feels like. That makes me care about getting this right in a way that goes beyond the technical challenge. I communicate clearly when something is complicated, which I think matters in open source where reviewers need to trust your reasoning not just your code. And I am honest about what I do not know. I do not oversell what I have built or pretend a proof of concept is a finished solution. I think that kind of straightforwardness saves everyone time.

### 1.3.3 What I want to develop

I want to learn how to write visual regression tests for 3D rendering. I know how to test backend systems and APIs but testing what a GPU actually draws is something I have not done at a production level and I want to. I also want to experience a full open source PR review cycle with senior maintainers on a widely used library. I have shipped PRs before but going through the full cycle with proper review, iteration, and merge on something this architectural is a different level and I am here for that. On the technical side I want to go deeper into GLSL and the shader pipeline because right now my WebGL knowledge stops at the JavaScript layer and I want to go further.

Non-technically I want to learn how to break a large architectural change into reviewable chunks that do not overwhelm a reviewer. I have shipped individual fixes before but decomposing something this structural into a PR sequence that a maintainer can actually follow is a different skill entirely. And I want to learn how senior contributors think about API stability and backwards compatibility, when to expose something, when to keep it private, what the long-term cost of a decision is. That kind of judgment does not come from reading. It comes from being in the process with people who have thought about it for years.


***

# Section 2: Contribution & Open Source

## 2.1 A contribution I am most proud of

[PR #8666](https://github.com/processing/p5.js/pull/8666)

The contribution I am most proud of is PR #8666 on p5.js dev-2.0. While doing the deep source read for this proposal, I found a boolean logic error at lines 655-658. The hasColoredVertices === hasColorlessVertices condition caused blender, maya, tinkercad, and sketchfab exports to crash instead of loading gracefully. I opened the fix while doing the deep source read for this proposal, not as a separate investigation.

What I learned is that the best way to understand a codebase is to read it with the intention of using it, not just studying it. I was not hunting for bugs. I was following data through a pipeline. The bug appeared because I was paying attention, not because I was looking for it.

Beyond code, I try to stay genuinely present in the community. When I filed [issue #8219](https://github.com/processing/p5.js/issues/8219) about the browser freeze for geometry over 65k vertices, I did not just report and leave. I had a back-and-forth with **Dave** ([@davepagurek](https://github.com/davepagurek)) investigating whether libtess was hitting a hard index limit or simply slowing down on complex intersecting shapes, before eventually opening the fix. I have also filed several issues on the p5.js web editor after spotting security vulnerabilities and rough edges while contributing there. I think that kind of investigation work, digging into why something breaks and not just that it does, is where I naturally end up.

I am pretty hands-on when someone around me is stuck. I remember a friend trying to contribute to an open source project for the first time who kept hitting walls on the setup. I walked him through it step by step. Watching it click for him felt more satisfying than most code I have shipped. That is part of why I filed [issue #3999](https://github.com/processing/p5.js-web-editor/issues/3999) on the web editor when I noticed the installation documentation was unclear about when to use Docker versus manual setup. Someone else would have hit that same wall. Fixing the documentation is the same instinct as helping the friend.

## 2.2 A p5.js sketch I made that I am most satisfied with

[Raymarched Anomaly Sketch](https://editor.p5js.org/nityamt199/sketches/N7Wov74qW)

### The story and motivation

I’ve always been fascinated by astrophysics and classic sci-fi tropes, specifically the idea of ancient, hyper-advanced technology floating out in deep space. I wanted to create a scene that felt like you just stumbled upon a navigational beacon or a containment field holding a miniature singularity. 

But beyond the artistic vision, my primary motivation was to understand the WebGL rendering pipeline from the inside out. I wanted to build this entire 3D world (the morphing shapes, lighting, shadows, and reflections) using pure math in a fragment shader. There is no mesh data, no OBJ files, and no textures loaded from disk. The GPU simply runs the same GLSL code in parallel for every pixel on the screen, every single frame.

### Why I am most satisfied with it

Building this forced me to understand exactly how rendering works under the hood. To make the singularity look realistic, I had to manually code:

* How a ray cast from the camera intersects a mathematical surface using **Signed Distance Fields (SDFs)**.
* How **soft shadows** are estimated by marching a ray toward a light and measuring its proximity to occluders.
* How **ambient occlusion** approximates indirect light by sampling the scene in a hemisphere around the surface normal.
* How **Fresnel reflectance** changes a surface's apparent color based on the viewing angle.

That deep, foundational understanding is what I am most proud of. It is exactly what later allowed me to read p5.js's WebGL source code and immediately spot a structural problem in their OBJ loader. Because I knew how the pipeline worked, I realized the entire scene resolves to one `gl.drawElements()` call, and a single draw call can only have one texture bound. Knowing that the fix requires a deeper architectural change rather than a quick patch is a direct result of the trial and error it took to build this raymarcher. This sketch is exactly how I got there.

## 2.3 A p5.js sketch by someone else that inspires me

[Growth by atzedent (Matthias Hurrle)](https://openprocessing.org/sketch/2679978)

The first time I ran it I just sat there for a while. It looks like coral shifting underwater. There is something genuinely calm about watching it, the way the patterns breathe and reorganise when you move the mouse. It does not feel like code. It feels like something that is alive and does not know you are watching it.

What got me was the gap between what it is and what it looks like. It is mathematics. It is a loop running in a browser tab. But it produces something that feels organic and unhurried in a way that most generative art does not. I kept wanting to understand the technique behind it, not to copy it, but because I could not figure out how something written in code could feel that peaceful. That curiosity is what creative coding does at its best. It makes you ask how, not just what.

## 2.4 An open source project I use regularly

[Blender](https://github.com/blender/blender)

I use Blender regularly as part of my gaming and animation elective. We model characters, rig them, texture them, and export them. Blender is fully open source under the GPL license and it is one of the best examples of open source done right, a tool that competes with expensive industry software purely because a community decided it should exist. The fact that the OBJ files I export from Blender are the exact files this project learns to handle correctly is not a coincidence. I came to this project from the Blender side first.

## 2.5 What is most important to make open source accessible

I think open source becomes truly accessible when three things are in place:

- The community has to feel safe. The biggest barrier is not technical, it is the fear of being dismissed. A welcoming environment that values patience and mentorship turns silent users into active contributors.
- The tooling has to be approachable. Clear documentation and a setup process that does not break on the first try ensures people do not give up before writing their first line of code.
- The software itself has to be built for people who do not know how it works inside. Complex functionality should be invisible by default so that a beginner is not blocked by what they do not yet understand.

I have tried my best to emphasize the same in my proposal, complex features happen under the hood. By prioritising zero regression architecture, a beginner can simply call loadModel() without worrying about GPU caching or breaking their existing sketches.

Ultimately, an open source project is accessible when it is as intuitive to use as it is welcoming to build.


***

# Section 3: Proposed Work

## 3.1 Synopsis

When a beginner downloads a 3d model from sketchfab, exports one from blender, maya, or tinkercad, and types `loadModel('robot.obj')` in p5.js, they expect their robot to look like the preview, textured, coloured per part, alive. Instead they get a flat broken shape. The reason is a single architectural limitation: p5.js currently flattens all obj geometry into one vertex array and issues a single `gl.drawElements()` call with one texture bound. Multi-material models are **silently destroyed at parse time**.

The difference is not subtle:

| before (p5.js today) | after (this project) |
|---|---|
| <p align="center"><img src="https://github.com/user-attachments/assets/c9649c7f-2f96-4213-a6ad-08f7132688f9" /></p> | <p align="center"><img src="https://github.com/user-attachments/assets/b283bc81-e1ee-4c68-8add-6d052804121f" /></p> |
| **[run it live](https://editor.p5js.org/nityamt199/sketches/me0kpve3H)** and this is what p5.js currently produces. Same character, 12 material groups collapsed into one flat grey shape. The failure is completely silent. | **[run it live](https://editor.p5js.org/nityamt199/sketches/ZmVzb02vG)** and this is the poc with the slicer. Same geometry, same user call, every material group renders with its own texture and colour. |

Both sketches use the exact same geometry and the exact same `model()` call. The only difference is whether the renderer knows how to loop through material slices.

What makes this worse is that **the failure is completely silent**. `loadModel()` resolves successfully and hands back a geometry object. The user stares at a grey blob and assumes they did something wrong. They eventually find out they need to open blender and bake textures. Most of them give up long before that.

This project removes that wall **without changing a single line of user code**. Under the hood, the parser is taught to slice geometry by material boundary, and the renderer is taught to loop through those slices, each with its own texture and material uniforms.

This is directly in line with p5.js's core value: reduce cognitive load, maximise access. A beginner should not have to open blender, learn uv-baking, or understand what a `uSampler` is. They should just be able to use art.


## 3.2 The problem, stated precisely

The diagram below shows where the data is lost. The obj file has all the material information including the usemtl boundaries, the map_Kd texture paths, the Kd colour values. ParseMtl() reads them correctly. But parseObj() discards all the structure and dumps everything into one flat vertex array. By the time the data reaches the renderer, the material boundaries are completely gone and gl.drawElements() has nothing to work with except one flat blob.

This architectural limitation is on record. In [issue #6117](https://github.com/processing/p5.js/issues/6117), a community member asked directly why mtl files were being ignored. **Dave** ([@davepagurek](https://github.com/davepagurek)) explained: `loadModel()` has no data structure capable of representing shape and materials as separate entities. That explanation is from 2022. This proposal is an attempt to address it directly.

<p align="center"><img width="697" height="654" alt="Screenshot 2026-03-22 at 4 00 34 PM" src="https://github.com/user-attachments/assets/e00c878e-492b-4ef1-96b7-7e02fa45a968" /></p>


## 3.3 My approach and the three options I considered

When I first approached this problem I identified three possible architectural solutions. **Diya** ([@diyaayay](https://github.com/diyaayay))'s directive and **Dave** ([@davepagurek](https://github.com/davepagurek))'s api feedback helped me narrow to the right one.

### 3.3.1 Option a: new public p5.GeometryGroup class (rejected)

Create a new class that wraps an array of `p5.Geometry` objects. `loadModel()` returns a `p5.GeometryGroup` when it detects multiple materials. Overload `model()` to accept either type.

Why I rejected it: this is a breaking change. Any code doing `instanceof p5.Geometry` checks would fail. Concretely:

```javascript
// option a - user code must branch on return type:
let geom = loadModel('robot.obj'); // now returns p5.GeometryGroup, not p5.Geometry
model(geom);                       // breaks - model() only accepts p5.Geometry

// option c - user code unchanged:
let geom = loadModel('robot.obj'); // still returns p5.Geometry
model(geom);                       // works for 1 or 12 materials, same call
```

**Diya** ([@diyaayay](https://github.com/diyaayay))'s feedback was explicit: "I'd generally lean toward keeping the grouping logic internal to the existing geometry pipeline unless a separate abstraction clearly improves maintainability. We would generally want to avoid breaking changes, since those are typically reserved for major releases." it also conflicts with **Dave** ([@davepagurek](https://github.com/davepagurek))'s parity requirement since users should not have to call a different function for a multi-material model versus a single-material one.

### 3.3.2 Option b: public geometry.materialGroups property (rejected)

Add a public `materialGroups: Array` field to `p5.Geometry`. The renderer checks for it.

Why I rejected it: pollutes the public geometry api. Since p5.js documentation is generated from inline comments, a new public property would appear in the reference and create documentation debt. Users could also accidentally break their sketch by reading or mutating `materialGroups` without understanding the consequences.

### 3.3.3 Option c: private _materialSlices on p5.Geometry (chosen)

Attach a private `_materialSlices` array to the geometry object returned by `loadModel()`. Each entry is `{ geometry: p5.Geometry, materialProfile: {...} }`. The renderer checks for this private property. **the public geometry api is completely unchanged**.

Why this is correct:

- **zero breaking changes**. `loadModel()` still returns `p5.Geometry`, `model()` signature unchanged
- Follows p5.js convention: private fields use `_` prefix (`_hasFillTransparency`, `_hasStrokeTransparency`, etc.)
- Aligns with **Diya** ([@diyaayay](https://github.com/diyaayay))'s directive to keep grouping logic internal
- Satisfies **Dave** ([@davepagurek](https://github.com/davepagurek))'s api parity: `model(singleMaterialGeom)` and `model(multiMaterialGeom)` are the same call
- The fallback path (no `_materialSlices`) is the existing code with no modification
- Closest to how processing4 handles it: `PShapeOBJ` builds an array of `PShape` children internally. Each child holds one material group's geometry. The user-facing draw call (`shape(s)`) loops through those children automatically so the user never sees the internal structure. This is the exact pattern I am proposing for p5.js: `_materialSlices` as private internal children, `model()` looping through them, user api completely unchanged. **the fact that processing, the parent project, already solved this the same way is strong evidence the pattern is correct**.


The flowchart below shows how the renderer decides which path to take. If the geometry has no _materialSlices it falls through to the existing single draw call with **zero regression** for all existing sketches. If slices exist it loops through them, binding a new texture and material uniforms for each one before issuing its own gl.drawElements() call.

<p align="center"><img width="560" alt="Screenshot 2026-03-22 at 4 06 03 PM" src="https://github.com/user-attachments/assets/6c22918d-24cd-45d3-8159-a4bf58b617dd" /></p>



## 3.4 Technical architecture

### 3.4.1 Phase 1: community bonding & design decisions

I have researched each of these thoroughly and have a clear position on each one. Each decision touches the public api or shader pipeline and should have explicit sign-off from the team before I write production code. I want to align early rather than surface surprises at pr review.

#### Decision 1: Draw order for transparent slices

When a slice has `d < 1.0` (transparent), correct rendering requires back-to-front draw order. I have thought through three options:

Option a: sort transparent slices at load time based on estimated depth from the geometry bounds.

Option b: document that artists should order transparent faces last in their obj export, which is what most 3d tools already do by convention.

Option c: expose a `loadModel('file.obj', { sortTransparent: true })` option for users who need it.

My current position is option b for v1, because it adds zero complexity, it matches what artists already do in blender and maya, and option c can follow as a documented enhancement. I want to confirm with **Diya** ([@diyaayay](https://github.com/diyaayay)) and **Claudine** ([@mingness](https://github.com/mingness)) that this matches how the team thinks about v1 scope before committing.

#### Decision 2: buildGeometry() material boundary detection

Should mid-draw material state changes automatically create a new slice (always-on), or should this be an opt-in flag?

I prefer always-on. The overhead is o(1) per draw call since it is just comparing a few uniform values against the previous call. Most sketches that use `buildGeometry()` do not change materials mid-draw, so the detection cost is nearly always zero. An opt-in flag adds api surface area without meaningful benefit. I want to run this past **Dave** ([@davepagurek](https://github.com/davepagurek)) since it touches the behaviour of an existing api. If the team prefers opt-in, I will ship the `buildGeometry()` integration as a separate pr after the core multi-material fix lands - phase 5 is already labelled as an extra deliverable, so the main timeline is not affected either way.

#### Decision 3: Texture loading, eager vs lazy

I prefer eager loading. All `map_*` textures get loaded inside `loadModel()`, which the user awaits in `async setup()`. Since dev-2.0 awaits `setup()` before starting the draw loop, everything is ready before `draw()` starts. This is the simplest mental model and consistent with how dev-2.0 handles all async asset loading.

Lazy loading (loading on first render) would reduce startup time for models with many materials but adds state tracking, potential one-frame flicker, and more error-handling surface area. I think that tradeoff is not worth it for a first implementation. Lazy loading can be a follow-up once the eager path is stable.

#### Decision 4: Private field convention

Should `_materialSlices` use the `_` prefix convention (as most private fields in this codebase do) or es2022 `#` private fields?

I checked the codebase and the `_` convention is overwhelmingly dominant. `#` private fields appear in almost none of the existing code. My preference is to match the existing convention and use `_materialSlices` for consistency, but I will follow whatever the team decides here since it is a style question not a technical one.

#### Decision 5: PBR properties like metalness

**Dave** ([@davepagurek](https://github.com/davepagurek)) specifically mentioned metalness alongside specularMaterial and textures as things that could not currently be swapped inside one geometry. The classic mtl format does not have a metalness field at all, it predates pbr pipelines entirely. So this raises a real question: should the materialProfile schema be extended to support pbr properties beyond what the mtl spec defines?

My position is to not include metalness in this gsoc project, and here is why I came to that conclusion. The mtl format covers `Kd`, `Ks`, `Ka`, `Ns`, `d`, `map_Kd`, `map_Ks`, `map_Bump` and a handful of others. That is already a full project's worth of work to parse, load, and bind correctly. Metalness in the pbr sense comes from gltf and other modern formats which have a completely different pipeline. Trying to bolt it onto the mtl materialProfile now would mean designing a schema that serves two different file format families at once, which is the kind of thing that produces awkward apis.

What I will do instead is design the materialProfile object to be extensible from the start. The schema is a plain javascript object, so adding `metalness: null` as a field in a follow-on pr is trivial once someone decides what source format should populate it. I will also file a github issue at the end of gsoc that formally tracks pbr materialProfile extensions so the conversation happens in the right place.

I want to confirm with **Dave** ([@davepagurek](https://github.com/davepagurek)) that this sequencing makes sense, since he was the one who raised it. Before gsoc ends I will open a github issue formally tracking pbr materialProfile extensions (metalness, roughness, gltf alignment) so the conversation has a home and other contributors can pick it up.

The architecture described in this proposal is my strongest current recommendation based on the codebase reading, the poc, and the mentor conversations so far. That said, I fully expect the implementation details to evolve once the wider team weighs in during pr review. That is a normal and healthy part of contributing to an open source project and I am ready to adapt as reviewers surface things I have not anticipated.

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

`map_Kd` is the only map bound to the shader in v1 - the current `_setFillUniforms()` has a single `uSampler` uniform. `map_Ks`, `map_Bump`, `map_Ka`, and `map_Ns` are parsed and stored in `materialProfile` so they are available for follow-on work, but binding them requires adding new uniforms to the shader, which is out of scope for this project. A github issue will be filed at the end of gsoc to track that extension.

### 3.4.2 Phase 2: extend parseMtl()

#### parseMtl() extended
```
current:  Kd, Ka, Ks, map_Kd (stored but unused)
proposed: Kd, Ka, Ks, Ns, d, illum + map_Kd, map_Ka, map_Ks, map_Bump, map_Ns
          all map_* values trigger loadImage() inside loadModel(), awaited in
          async setup(), so all textures are resolved before draw() starts
```

Two options for when `map_Kd` textures are loaded from `parseMtl()`:

**option a: eager loading (chosen):** all `map_*` paths trigger `loadImage()` calls inside `loadModel()`. In dev-2.0, `preload()` is replaced by `async setup()` - the user writes `await loadModel(...)` and `draw()` does not start until `setup()` resolves. **textures are guaranteed ready before the first frame**. No complexity.

**option b: lazy loading (not chosen):** load textures on first render. Reduces initial load time for large models with many materials but adds state tracking and potential one-frame flicker.

I propose option a for this project. Option b can be a follow-up optimisation with a cache.

The async coordination works as follows: `loadModel()` is already an `async` function. `parseMtl()` is a private module-level function with no sketch instance access - it returns raw texture path strings, exactly as it returns `texturePath` today. `fn.loadModel()`, which has sketch instance access via `this`, iterates those paths after `parseMtl()` resolves and calls `this.loadImage()` on each one, pushing the returned promise into a flat array. Before `loadModel()` resolves, it awaits `Promise.all(texturePromises)`. This guarantees every slice's textures are fully decoded before `loadModel()` returns. Since the user writes `let model = await loadModel(...)` inside `async setup()`, and dev-2.0's runtime awaits `setup()` before starting the draw loop, all textures are guaranteed ready before the first frame - **no race condition, no flicker**. The old `_incrementPreload`/`_decrementPreload` counter system from p5.js 1.x does not exist in dev-2.0 and is not needed here.

### 3.4.3 Phase 3: rewrite parseObj() slicer

#### parseObj() the slicer

The current single-pass approach that dumps all vertices into one array is replaced by a slice-aware pass:

```
when parseObj() encounters a "usemtl <name>" token:
  1. Finalise the current slice (close its vertex/face arrays)
  2. Look up <name> in the materials dict from parseMtl()
  3. Open a new sub-geometry builder for the new material
  4. Continue parsing, vertices, uvs, normals go into this slice's arrays

on end-of-file:
  5. Finalise the last open slice. If slice.geometry.vertexNormals is empty
     (obj file had no vn lines), call slice.geometry.computeNormals() - same
     fallback the current single-geometry path applies at line 652 of loading.js
  6. If only 1 slice exists, attach nothing (use existing single-draw path)
  7. If more than 1 slices, attach array as parent._materialSlices
```

The vertex-deduplication logic (`usedVerts` map, keyed by `vertexString + material`) already exists in the current code. The slicer reuses this: each slice has its own `usedVerts` scope so face indices are local to the slice.

Uv re-indexing: obj uv coordinates (`vt`) are stored in a single global list and face tokens reference into it with global indices (e.g. `f 1/3/1 2/5/2` means vertex 1 with uv 3). When slicing by `usemtl` boundary, each slice has its own local vertex array starting at index 0. The slicer remaps every global `vt` reference to a per-slice local index as it copies vertices into each slice's array. This is the same index-localisation step already performed for vertex positions and normals, applied equally to uvs.

Draw order: slices are inserted in obj file order, which matches the artist's 3d software export order. No automatic depth sorting for opaque meshes since the depth buffer handles occlusion correctly for opaque geometry automatically.

`_makeTriangleEdges()`: in the current code, `loadModel()` calls `model._makeTriangleEdges()` on the parent geometry after `parseObj()` returns. This generates stroke geometry (line vertices, tangents, caps, joins). In the sliced design, all vertices live in sub-geometries - the parent has none - so the existing single call produces nothing. The slicer will call `_makeTriangleEdges()` on each slice's sub-geometry individually before attaching it to `_materialSlices`.

`hasColoredVertices` / `hasColorlessVertices`: the current `parseObj()` tracks these two flags across all vertices and throws if both are false or both are true (the bug pr #8666 fixes). The per-slice design eliminates this check entirely - each slice only contains vertices from one material, so they are either all-colored or all-colorless by construction. The mixed state that causes the throw cannot occur per slice. This means the slicer also resolves the underlying condition that made pr #8666 necessary.

### 3.4.4 Phase 4: extend Renderer3D.model()

The existing `model()` method in `Renderer3D`:
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

Extended model():
```javascript
model(model, count = 1) {
  if (model._materialSlices && model._materialSlices.length > 1) {
    // new: multi-draw path, loop through slices
    if (this.geometryBuilder) {
      // inside buildGeometry() - geometry only, material state not preserved.
      // GeometryBuilder.addGeometry() flattens vertices into one combined geometry
      // and discards texture/material per slice. Full multi-material support inside
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

`_applyMaterialProfile()` will call `this.texture()`, `this.specularMaterial()`, `this.ambientMaterial()`, `this.shininess()` with values from the `materialProfile`, the same functions users call today. If `map_Kd` is absent from a slice, the slicer falls back to `diffuseColor` as `ambientMaterial` - the same fallback the poc uses today. Under the hood, each slice results in one `gl.drawElements()` call with its own texture unit bound, replacing the single call that currently covers the whole model.

The per-slice draw loop uses `push()`/`pop()` rather than a custom `_resetMaterialProfile()`. This is necessary to preserve whatever material state the caller had set before calling `model()` - for example, if the user called `texture(myTex)` before `model(robot)`, a null-reset would silently destroy `myTex` and break any geometry drawn after the call. `push()` saves the full renderer state before each slice, `pop()` restores it after. The poc already uses this pattern correctly and the production implementation follows it for the same reason.

The per-slice gpu buffer caching works as follows: each slice's sub-geometry is a separate `p5.Geometry` object with its own `gid`. `_getOrMakeCachedBuffers()` keys the buffer cache on `gid`, so 12 slices produce 12 separate gpu buffer objects - uploaded once on first draw and reused on every subsequent frame, the same caching behaviour as a single geometry today but applied per slice.

When `_applyMaterialProfile()` calls `this.texture()`, it sets the renderer's active texture state. `_drawGeometry()` then calls `_drawFills()`, which calls `shader.bindTextures()` and then `_drawBuffers()`. `_drawBuffers()` issues `gl.drawElements()` - the existing shader binding machinery in `p5.Shader.js` is reused unchanged. The new path calls it once per slice instead of once per model.

### 3.4.5 Phase 5: buildGeometry() integration

**Dave** ([@davepagurek](https://github.com/davepagurek)) noted: "similarly for building groups by using `buildGeometry` and swapping between things we can't currently support in one geometry, like textures, but also things like metalness, specularMaterial, etc."

In phase 5 of the project, I will extend `buildGeometry()` so that if a user calls `texture()` or `specularMaterial()` mid-draw, a new slice boundary is automatically created:

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

This is detected internally by diffing material state in `GeometryBuilder`. This is ambitious but achievable and extends the fix from imported models to procedurally built ones.

Since this touches the behaviour of an existing api, I will prioritise confirming alignment with the core team during community bonding before writing any production code for this phase.

### 3.4.6 Phase 6: visual tests, unit tests, fixture files

Testing a 3d renderer is fundamentally different from testing logic code. The output is pixels produced by a gpu, and gpu output can vary slightly across machines and drivers. P5.js handles this with a screenshot comparison approach that renders a sketch headlessly and diffs pixels against a stored reference image within a configurable tolerance. Phase 6 delivers three categories of tests.

#### Visual regression tests (screenshot comparison)

The existing p5.js visual test infrastructure in `test/unit/visual/` renders sketches via a headless browser and compares the output pixel-by-pixel against reference images stored in the repository. I will add visual tests covering:

- A multi-material model with 3+ distinct materials renders each part with the correct texture and colour. The reference image is captured once and committed. Future runs must match within tolerance.
- A single-material model rendered via the new code path produces output identical to the pre-gsoc reference. This is the zero-regression proof: the fallback path (`no _materialSlices`) must be pixel-identical to the old code.
- A model with a missing texture path renders with flat `diffuseColor` per affected slice rather than crashing or going entirely grey. The `console.warn()` must be emitted.
- A model with mixed textured and untextured slices renders correctly: textured slices show their texture, untextured slices show their `diffuseColor`.

#### Unit tests (parser logic)

Visual tests validate the final render. Unit tests validate each layer independently, without a gpu.

`parseMtl()` unit tests:
- All standard mtl tokens (`Kd`, `Ka`, `Ks`, `Ns`, `d`, `illum`, `map_Kd`, `map_Ka`, `map_Ks`, `map_Bump`, `map_Ns`) are parsed and stored on the material object correctly.
- A mtl file with only `Kd` (the current common case) still parses without error.
- A malformed mtl file (missing values, unknown tokens) does not throw, unknown tokens are silently skipped, same as the current behaviour.

`parseObj()` slicer unit tests:
- A two-material obj produces exactly 2 entries in `_materialSlices`, each with the correct vertex count.
- A single-material obj produces no `_materialSlices` on the parent geometry (falls through to existing single-draw path).
- Face indices in each slice are local to that slice, no global index bleed between slices.
- Uv coordinates are correctly remapped: a vertex that shared a global `vt` index with another slice gets its own per-slice local uv index.
- `computeNormals()` is called per slice when the obj file has no `vn` lines, matching the existing fallback.

#### Fixture obj/mtl files

The test suite requires small, deterministic fixture files committed to `test/unit/assets/`. I will create:

| fixture | purpose |
|---|---|
| `multi_material_2.obj` + `.mtl` | minimal 2-material model (two cubes, two materials, one texture each), primary test case |
| `multi_material_12.obj` + `.mtl` | 12-material model matching the poc character, stress test for buffer caching |
| `single_material.obj` + `.mtl` | 1 material, regression: must use existing single-draw path, not multi-draw |
| `no_mtl.obj` | obj with no `mtllib` directive, regression: loads as untextured geometry, no error |
| `missing_texture.obj` + `.mtl` | mtl references a texture path that does not exist, validates 404 degradation and `console.warn()` |
| `no_normals.obj` + `.mtl` | obj with no `vn` lines, validates `computeNormals()` fallback per slice |

The two-material fixture is hand-authored to be minimal and deterministic. The 12-material fixture is exported from blender to represent a real-world workflow. All fixture files are committed as plain text and kept under 50kb total.

### 3.4.7 Phase 7: documentation

P5.js documentation is generated from inline jsdoc comments in the source files. The reference pages at p5js.org are built directly from these comments, so jsdoc changes are not cosmetic, they change what users read when they look up a function.

#### `loadModel()` in `src/webgl/loading.js`

The current jsdoc for `loadModel()` says nothing about material files. A user reading the reference today has no way to know that `.mtl` files are supported at all, let alone what the current limitations are. After this project, the documentation needs to:

- Clearly state that multi-material `.obj` files with associated `.mtl` files are fully supported.
- Document that all textures referenced in the `.mtl` file are loaded automatically, the user does not need to call `loadImage()` separately.
- Document the `async setup()` pattern: the user should `await loadModel(...)` inside `async setup()` so that all textures are resolved before `draw()` starts.
- Document graceful degradation: if the `.mtl` file is missing or a texture path is invalid, `loadModel()` still resolves successfully, it does not throw.
- Include a runnable reference example showing a multi-material model loading correctly with one line of user code.

#### `model()` in `src/core/p5.Renderer3D.js`

The current jsdoc for `model()` documents a single geometry argument. After the change, `model()` transparently handles both single and multi-material geometry. The documentation update:

- Makes clear that `model()` works identically for single and multi-material models, the call signature does not change.
- Notes that material and texture state from the `.mtl` file is applied automatically per material group. The user does not need to call `texture()` or `specularMaterial()` manually before calling `model()` when using a loaded `.obj` file.

#### `buildGeometry()` in `src/core/p5.Renderer3D.js`

After phase 5, `buildGeometry()` can capture material boundaries automatically when `texture()` or `specularMaterial()` is called mid-draw. The documentation update:

- Documents the new behaviour with a code example showing two materials inside one `buildGeometry()` call.
- Notes that the resulting geometry can be passed directly to `model()` and renders correctly.

#### Reference page examples

Each reference page in p5.js includes a live runnable example embedded in the page. I will write examples for all three functions that can be run directly in the p5.js web editor. The examples will use publicly hosted texture images so they work without any local file setup. The `loadModel()` example will load a real multi-material model hosted at a stable url and demonstrate the before/after difference in a single sketch.

### 3.4.8 Phase 8: API parity audit, edge cases, performance & follow-up issues

Phase 8 is not a cleanup phase. It is a deliberate audit pass that treats the implementation as a black box and systematically tests every assumption made during development. It is also where the project formally hands off unfinished work to the wider community through github issues.

#### API parity audit

**Dave** ([@davepagurek](https://github.com/davepagurek))'s core requirement was that `model()` must behave identically for single and multi-material geometry from the user's perspective. The audit verifies this across every context where `model()` can be called:

- Inside `push()`/`pop()`: material state set before `model()` must be fully restored after. Verified with a sketch that sets `texture(myTex)`, calls `model(multiMaterial)`, then draws another shape that must still use `myTex`.
- With the `count` parameter (webgl2 instanced rendering): `model(geom, 12)` must work for multi-material geometry the same way it works for single-material geometry.
- With `orbitControl()`: the multi-draw loop must not interfere with the camera transform applied before rendering.
- Inside another `buildGeometry()` call: `model()` called inside a `buildGeometry()` callback must add the geometry correctly regardless of whether it has `_materialSlices`.
- With `lights()`, `directionalLight()`, `pointLight()`: lighting must apply correctly to each slice, not just the first one.

#### Edge case testing

Beyond the fixture files from phase 6, the audit covers edge cases that are hard to anticipate during implementation:

- Obj with `usemtl` referencing a material name not defined in the `.mtl` file. The slicer must handle a missing material lookup gracefully, fall back to default material rather than throwing.
- Obj with duplicate `usemtl` names (same material used in two non-contiguous face groups). Each occurrence creates its own slice. The result is two slices with the same `materialProfile` but separate vertex arrays. This is correct and intentional, the gpu needs separate draw calls for non-contiguous geometry.
- Mtl file with windows-style path separators (`\`) in texture paths. `path.normalize()` or equivalent must handle both unix and windows separators since artists export from different operating systems.
- Very large model (100+ material groups): gpu buffer cache must handle 100+ separate `gid` entries without memory issues. The `_getOrMakeCachedBuffers()` function uses a hash map keyed on `gid`, this scales linearly and has no known upper limit, but it should be verified empirically.
- Model rendered inside `pg.drawingContext` (a `p5.Graphics` object): the renderer instance is different from the main canvas renderer. The multi-draw path must work correctly in this context since users frequently render models to offscreen graphics buffers.

#### Performance

The per-slice architecture introduces `n` gpu buffer cache lookups and `n` draw calls per frame, where `n` is the number of material groups. For typical models (5–20 materials), this is negligible. For extreme cases (100+ materials), it is worth measuring.

I will benchmark frame rate for a 12-slice model at 60fps against a baseline single-material model across three environments: chrome on desktop, firefox on desktop, and safari on mac. If any environment shows more than 10% frame rate regression for a 12-slice model compared to a single-material model, I will investigate whether the buffer cache lookup is the bottleneck or whether the draw call overhead itself is the issue.

The gpu buffer upload (via `_getOrMakeCachedBuffers()`) happens exactly once per slice, on the first frame after `loadModel()` resolves. Subsequent frames only issue draw calls against already-uploaded buffers. This is the same behaviour as a single geometry today. The audit will include a frame counter that confirms no re-upload happens on frame 2 and beyond.

#### Follow-up GitHub issues

Before gsoc ends, I will file the following github issues to formally track work that is out of scope for this project but directly adjacent to it:

| issue | description |
|---|---|
| `map_Ks` shader binding | specular map parsed and stored in `materialProfile` but not bound to a shader uniform. Requires adding a `uSpecularSampler` uniform to `src/webgl/shaders/` and wiring it in `_setFillUniforms()`. |
| `map_Bump` / normal mapping | bump/normal map parsed and stored but not applied. Requires a `uNormalSampler` uniform and a normal-mapping calculation in the fragment shader. Significant shader work. |
| lazy texture loading | eager loading is simple and correct for v1. Lazy loading (load on first render) reduces startup time for models with many materials. Requires a `textureLoaded` flag per slice and a deferred `loadImage()` call. |
| pbr materialProfile extension | `metalness`, `roughness`, and `ao` are not in the classic mtl spec but are present in gltf and modern pipelines. The materialProfile schema should be extended to support these once gltf loading is on the roadmap. |
| gltf format support | gltf is the modern replacement for obj/mtl, with built-in pbr materials. A separate `loadModel()` code path for `.gltf` files would reuse the `_materialSlices` architecture established by this project. |

Each issue will include a link back to the relevant section of this proposal so future contributors have full context on the design decisions already made.

### 3.4.9 Error handling & failure modes

Three failure modes and how the implementation handles each:

**mtl file missing:** `parseMtl()` is only called when the obj parser finds an `mtllib` directive and the fetch succeeds. If the fetch fails, the model loads as single-material geometry using the existing single-draw path - same behaviour as today, **zero regression**.

**texture path 404:** if a `loadImage()` call for a `map_*` path fails, that slice's texture field is set to `null`. The renderer already has a fallback for `map_Kd === null`: it applies `diffuseColor` as `ambientMaterial` instead. A 404'd texture degrades to a flat-coloured slice rather than a broken render. A `console.warn()` is issued with the failed path - **unlike today where this failure is completely silent**.

**partial mtl (mixed textured and untextured slices):** each slice is resolved independently. Slices with a valid `map_Kd` get a texture. Slices without one (or whose texture failed) get `diffuseColor`. **no slice's failure affects any other slice**.

The diagram below shows all three layers together: parser, data, and renderer, and how they connect. The parser produces the slices, the data layer holds them privately on the geometry object, and the renderer loops through them at draw time. Each layer is independently testable and the public api never changes.

<p align="center"><img width="568" height="577" alt="Screenshot 2026-03-22 at 4 11 16 PM" src="https://github.com/user-attachments/assets/14c64665-824a-412b-8b91-5eef523e0a49" /></p>

## 3.5 Tech stack, libraries, and tools

| Category | Tool / technology | Role |
|---|---|---|
| Language | JavaScript (ES2022) | All implementation code lives in the p5.js source |
| Rendering API | WebGL2 (via p5.js's WebGL renderer) | `gl.drawElements()`, buffer uploads, texture binding |
| Core library | p5.js `dev-2.0` branch | Target codebase; all changes stay within this branch |
| File formats | Wavefront OBJ + MTL | The formats this project teaches p5.js to parse correctly |
| Unit testing | Mocha + Chai (p5.js's existing test suite) | Parser logic tests for `parseMtl()` and `parseObj()` |
| Visual testing | Headless browser + screenshot comparison (p5.js's existing visual test infra) | Pixel-level regression tests for multi-material renders |
| Build system | p5.js's existing Rollup-based build | No changes to the build pipeline |
| Runtime targets | Chrome, Firefox, Safari (desktop) | Benchmark and CI coverage |

**No new dependencies are added.** Every tool listed above is either already in p5.js's dependency tree or is a browser-native API. The implementation is entirely self-contained within the existing codebase.

## 3.6 Potential roadblocks

### Roadblock 1: Vertex deduplication vs. per-slice UV mapping

The current `parseObj()` deduplicates vertices globally across all material groups before building the geometry. When the slicer splits geometry per material boundary, UVs assigned to shared vertices may conflict between slices — a vertex shared by two material groups carries only one UV coordinate in the deduplicated array, but each slice may expect a different UV for that vertex. Resolving this requires localising vertex deduplication to within each slice, so shared vertices are re-indexed independently per material group rather than globally. This is the core technical risk of Phase 3 and the primary reason its buffer is 15h rather than 5h. The proof of concept in section 3.7 validates that the per-slice approach is geometrically sound before this becomes production code.

### Roadblock 2: GPU buffer cache behaviour with many slices

`_getOrMakeCachedBuffers()` in `p5.RendererGL` caches uploaded GPU buffers keyed on a geometry ID (`gid`). It was designed around single-geometry models. For a model with 20+ material groups, every slice needs its own cache entry. The risk is that many small cache entries per model cause unexpected memory growth or cache eviction behaviour in long-running sketches where models are loaded and unloaded repeatedly. Phase 8 includes an empirical test with a 100+ material group model to verify the cache scales linearly without memory issues. If a problem is found, the mitigation is to namespace slice `gid` values under the parent model's `gid` and evict all slices together when the parent is evicted.

### Roadblock 3: Visual test infrastructure for 3D rendering

p5.js's screenshot comparison test infrastructure is more established for 2D than for WebGL/3D. GPU-rendered output varies slightly across machines, drivers, and browsers, so a fixed pixel-perfect comparison will produce false failures. The existing visual test setup uses a configurable tolerance threshold to handle this, but that threshold has been tuned for 2D output. Phase 6 may require calibrating or extending the tolerance configuration for 3D scenes before the actual multi-material tests can be written. If the infrastructure turns out to need significant work, the visual regression tests are scoped down to the most critical cases (correct texture per slice, correct colour fallback) and the remaining coverage is filed as a follow-up issue.

## 3.7 Proof of concept

I built a working poc to validate all three layers of this architecture before writing this proposal. You can run it here:

**https://editor.p5js.org/nityamt199/sketches/ZmVzb02vG**

The poc uses `buildGeometry()` from dev-2.0 to simulate what `parseObj()` will produce internally. Here is how each part maps to the real implementation:

### Slice construction

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

### Attaching slices to the parent geometry

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

### The multi-draw renderer

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

The poc renders 12 separate material slices (shirt, jacket, head, eyes, irises, pupils, eye shine, eyebrows, nose, lips, hair, shoes) each with their own texture or colour. This is completely impossible with the current p5.js renderer. The poc proves the architecture works end to end in dev-2.0.

The poc intentionally uses `buildGeometry()` instead of `loadModel()` to isolate and validate the three-layer architecture independently. It answers the question "do the layers work together?" - the parser, data layer, and renderer all behave as the proposal describes. The implementation phases will extend this to handle the full `loadModel()` path including real obj/mtl files, uv mapping edge cases, and face winding.


## 3.8 Expected outcomes

By the end of gsoc:

- Merged: extended `parseMtl()` that parses all standard mtl tokens
- Merged: new slicer in `parseObj()` producing `_materialSlices`
- Merged: extended `Renderer3D.model()` with multi-draw loop
- Merged (if phase 5 not deferred): `buildGeometry()` material boundary detection
- Merged: visual tests with real multi-material obj fixtures
- Merged: full jsdoc and reference page examples
- Filed: github issues for remaining unimplemented mtl features so other contributors can continue
- Demo: a public-facing sketch that loads a real sketchfab model and renders it correctly with one line of user code

What the user sees after this project:
```javascript
// before: broken, flat blob, wrong colours, no textures
// after:  works, each material part has its own texture and colour
let robot = loadModel('robot.obj');  // loadModel unchanged
function draw() {
  model(robot);                      // model() unchanged
}
```


## 3.9 Accessibility angle

P5.js's mission is access and inclusion. **Kit** ([@ksen0](https://github.com/ksen0)) made this explicit in the session: "all new proposals should make the argument of how the new feature improves access and inclusion." this project has a direct and concrete answer to that.

Sketchfab is the world's largest free 3d asset library. It has millions of downloadable models spanning art, culture, science, education, and games. The majority of those models are exported as obj plus mtl, the most common interchange format. Every single one of those models has multiple materials. And every single one of them renders as a flat grey blob in p5.js today. The same is true for any model exported from blender, maya, or tinkercad - the obj/mtl format is universal across all 3d tools and p5.js breaks all of them the same way.

The problem is made worse by how it fails. `loadModel()` returns successfully with no error and no warning. The user did everything right. **the failure is completely silent**.

Who exactly gets blocked by this today:

**students in 3d and animation courses.** this is my own situation. I take an elective where we model, rig, and texture characters in blender and then bring them into creative coding environments. Every student in that class who tries to use p5.js hits the same wall. The character they spent hours texturing comes out grey and flat. P5.js is supposed to be the gentle on-ramp to creative coding. Right now it is a dead end for anyone coming from a 3d background.

**educators building 3d assignments.** a teacher who designs a unit around loading and animating a sketchfab, blender, or maya model cannot know in advance that every model will break. The failure is silent and the fix (baking textures in blender) requires software the students do not have and a skill set that takes hundreds of hours to learn. The assignment has to be redesigned or abandoned.

**artists and makers who are not software engineers.** p5.js is specifically designed for people who create, not people who debug rendering pipelines. An artist who downloads a model from sketchfab or exports one from blender, maya, or tinkercad and calls `loadModel()` is doing exactly what the documentation says to do. The broken result looks like their fault. Many of them conclude p5.js cannot do 3d and stop.

**beginners on the p5.js web editor.** p5.js 2.0 becomes the default in the web editor in august 2026. Every beginner who opens the editor after that date and tries 3d will hit this wall on day one, with no error message and no path forward.

The specific gatekeeper this project removes:

1. User finds a model on sketchfab or exports one from blender, maya, or tinkercad
2. Loads it in p5.js with `loadModel()` (one line, as documented)
3. Model renders broken, no error, user is confused
4. User searches and finds they need to bake textures in blender
5. Blender has a learning curve of hundreds of hours and is not installed by default anywhere
6. User gives up and abandons the 3d direction entirely

After this project: step 3 renders correctly. Steps 4, 5, and 6 do not happen. **the creative coding on-ramp stays open**.

An educator can now assign any sketchfab model as a starting point without pre-processing. A student opens the p5.js web editor, loads the model, and sees the jacket the right colour and the skin the right tone on the first run - exactly as the artist exported it from blender. No blender install, no bake textures step, no silent failure. That is what this project actually delivers.

This failure is independently documented by users who have no connection to each other. In [this discourse thread from 2019](https://discourse.processing.org/t/load-obj-model-with-mtl-file-and-jpg-texture/4634), multiple users reported that `loadModel()` loads the mesh but ignores the texture entirely  - the only workaround discovered was to manually `loadImage()` and flip the texture vertically via `createGraphics`. In [this thread](https://discourse.processing.org/t/how-can-I-color-or-texture-each-faces-of-a-loaded-obj-file/12688), a user asked specifically how to colour each face of a loaded obj file  - the answer was that there is no native solution. Same wall, different years, different people. The fix never came because it required an architectural change, not a patch.


## 3.10 Why I chose this project and what I bring to it

I take an elective in gaming and animation as part of my coursework. That course lives in blender. We model things, rig them, texture them, and export them. I got used to working with multi-material meshes where the jacket is one material, the skin is another, the shoes are another, and blender keeps them all separate because that is how you actually build things. When I started bringing those models into p5.js for creative coding projects, I hit the wall immediately. The same character I had spent hours texturing in blender came out as a single flat grey blob. No error. nothing. I genuinely thought I was exporting wrong. I tried different export settings, re-checked my uv maps, re-exported with different obj options, checked the file in a different viewer to confirm the textures were actually there. They were. I then opened the obj file in a text editor and saw all the `usemtl` groups exactly where they should be. The `map_Kd` paths were in the mtl file. Everything was correct. That was when I opened `loading.js` directly and traced what `parseObj()` actually does with a `usemtl` token. I found it reads the material name, looks it up, bakes just the `Kd` colour into `vertexColors`, and then discards the boundary entirely. The texture path is stored by `parseMtl()` but never handed to the renderer. That single read told me exactly what was broken and exactly where.

That experience is the real origin of this proposal. I am not proposing this because it looked like an interesting gsoc issue. I ran into this wall personally, in a real workflow, coming from a course that specifically teaches the pipeline this bug breaks. I know what it feels like to be on the other side of it and I know exactly which step in the pipeline swallows the material data. Every student in that class who tries to bring their blender work into p5.js hits the same wall. Fixing this means they don't have to.

When I saw this listed as a gsoc project I already knew the pain point from the user side. What I did next was go read the source to understand the technical side. I read pr #6710 end to end, traced the entire pipeline from `loadModel()` down to `gl.drawElements()`, opened the dev-2.0 branch and read six files in detail. I found a real crash bug in `parseObj()` while doing that read and opened pr #8666 to fix it. By the time I started writing this proposal I had a working poc that proved the three-layer architecture was sound in dev-2.0.

That combination of hitting the problem as a user, going deep into the source as a developer, and building something before proposing it is what makes me confident I can deliver this. This proposal is rooted in a deep line-by-line understanding of the current rendering pipeline.

### Contributions across the p5.js ecosystem

I have contributed across the full p5.js ecosystem before this gsoc application, not just the specific file this project touches.

#### p5.js core (2 open PRs)
- **pr #8666:** fixes the `parseObj()` crash for mixed-material obj models. In the exact file this gsoc project modifies. This is directly in the 3d/webgl rendering path.
- **pr #8555:** fixes a browser freeze when tessellating geometry over 50k vertices. A webgl renderer fix in the same rendering layer this project works in. Both open prs are in the core 3d pipeline - not peripheral fixes.

#### p5.js web editor (13 merged PRs)
The web editor is where beginners actually write their p5.js code. I have 13 merged contributions there covering security fixes (oauth, bcrypt, mass assignment vulnerabilities), performance (502 timeout on project downloads, zip streaming), accessibility (aria-live on form errors), and ux (signup flow when email verification fails). The range matters because it shows I understand the environment where the user experiences this bug, not just the renderer layer where it originates.

Some of the specific merged prs: #3968 (private assets authorization), #3967 (input validation), #3966 (google oauth email validation), #3897 (async bcrypt), #3892 (github oauth fix), #3884 (aria-live accessibility), #3862 (zip download timeout).

That is 15 prs across the core library, the webgl renderer, and the editor. I have genuine familiarity with the codebase and the contribution workflow.

### Other technical background
- Full pipeline trace: `loadModel()` to `parseMtl()`, `parseObj()`, `p5.Geometry`, `Renderer3D.model()`, `_drawBuffers()`, `gl.drawElements()`, all read in source not docs
- Referenced pr #6710 (original mtl implementation by **Diya** ([@diyaayay](https://github.com/diyaayay)) and **Dave** ([@davepagurek](https://github.com/davepagurek))), issue #6924 (formal feature request tracking what is missing), processing4's `PShapeOBJ.java` (reference implementation for the internal children pattern)
- Working poc built on dev-2.0 apis (`buildGeometry()`) before writing this proposal, not after
- Direct conversations with **Diya** ([@diyaayay](https://github.com/diyaayay)), **Dave** ([@davepagurek](https://github.com/davepagurek)), and **Kit** ([@ksen0](https://github.com/ksen0)) that shaped the architecture documented in sections 5.1.3 and 3.3



***

# Section 4: Timeline

## 4.1 Scope and why this is 300 hours

The gsoc idea page lists this as 175h or 300h. I am proposing 300h because:

1. The parser rewrite is non-trivial. Vertex deduplication, uv mapping, and face winding all need to work correctly per-slice.
2. Visual tests for 3d rendering are significantly more complex than unit tests.
3. After the feedback I received, I plan to allocate time to read all geometry-related references and file issues for unimplemented apis so other contributors can continue the work after gsoc.
4. The `buildGeometry()` integration (phase 5) is an extra deliverable not in the original spec.

## 4.2 Phase overview

| Phase | Work | Weeks | Hours | Buffer |
|---|---|---|---|---|
| Phase 1 | Community bonding: study all geometry APIs, read processing4's PShapeOBJ.java, draft architecture doc, get sign-off from mentors → §3.4.1 | 1-2 | 40h | 5h |
| Phase 2 | Extend `parseMtl()`: all mtl tokens and texture loading pipeline → §3.4.2, §3.4.9 | 3-5 | 35h | 5h |
| Phase 3 | Rewrite `parseObj()` slicer: per-material vertex buckets, uv mapping per slice, face-index localisation → §3.4.3, §3.4.9 | 6-8 | 55h | 15h |
| Phase 4 | Extend `Renderer3D.model()`: multi-draw loop, per-slice material binding, buffer cache per slice → §3.4.4, §3.4.9 | 9-11 | 50h | 15h |
| Phase 5 | `buildGeometry()` mid-draw material boundary detection → §3.4.5 | 12-13 | 35h | 5h |
| Phase 6 | Visual tests (screenshot comparison), unit tests, fixture obj/mtl files → §3.4.6 | 14-16 | 40h | 5h |
| Phase 7 | Docs: JSDoc for `loadModel()`, `model()`, `buildGeometry()`; reference page examples → §3.4.7 | 17-18 | 25h | 5h |
| Phase 8 | API parity audit, edge cases, performance, follow-up issues → §3.4.8 | 19-20 | 20h | 5h |
| **Core total** | | **Weeks 1-20** | **300h** | **60h** |
| Overflow / stretch | Absorb slippage or pursue: (1) better error messages for missing `map_Kd`, (2) additional real-model fixtures, (3) PBR property stubs on `materialProfile` | 21-22 | up to 25h | - |

Weeks 21 and 22 are the final two weeks of the 22-week GSoC window. No new work is scheduled here. If a phase earlier in the timeline ran longer than expected, these weeks absorb that slip without any risk to the final deliverables. If all phases finished on time, these weeks become stretch goal time for features that are out of scope for v1 but worth filing as follow-up issues. The "up to 25h" shown for overflow is the available capacity of those two weeks, not an addition to the 300h commitment — the total committed hours remain 300h regardless.

The buffer column is not additional time on top of 300 hours. It is already counted inside each phase's hours. Phase 3 is allocated 55h total, of which 15h is breathing room for code review cycles, unexpected edge cases, and PR iteration. Every phase is structured this way. The total stays at 300h.

Phases 3 and 4 carry the most risk because the vertex deduplication logic and the renderer buffer cache both have non-obvious interactions with the rest of the geometry pipeline. If a phase finishes under estimate, saved hours roll into Phase 6, since testing can always absorb more time. If Phase 3 still overruns, Phase 5 (`buildGeometry()` boundary detection) is the first candidate to defer since it is an extra deliverable beyond the original spec. **The core deliverables (parser, data layer, renderer) are never at risk.**

## 4.3 Community feedback plan

I will post two public community checkpoints during the coding period, both on the p5.js Discourse forum and the Discord server, and cross-link them on the relevant GitHub issue (#6924).

**Checkpoint 1 — end of week 8 (after Phase 3):** I will post a runnable p5.js web editor sketch demonstrating the working slicer. Community members can fork the sketch and test it with their own models by swapping the geometry arrays. I will ask specifically: does your model produce the correct number of slices? Are any material boundaries merged incorrectly? Feedback collected here directly shapes Phase 6. Any model that fails to slice correctly becomes a fixture file. Any edge case I had not anticipated gets added to Phase 8's testing checklist. If the feedback reveals a structural problem in the slicer, Phase 4's 15h buffer absorbs the fix before renderer work begins.

**Checkpoint 2 — end of week 11 (after Phase 4):** I will post a full end-to-end render demo using a real multi-material model from Sketchfab, showing the before and after in a single sketch. I will ask: does it render correctly in your browser? Does it work with your own Blender or Tinkercad export? Feedback here feeds directly into Phase 8's edge case list. Models that fail to render correctly become additional fixture files or audit targets. Any performance concern raised by the community gets added to the Phase 8 benchmark.

Between checkpoints, I will stay active in the p5.js Discord #webgl channel and reply to any questions on the GitHub issue thread. I prefer to communicate early when something is unclear, so mentors and the community will always know where the implementation stands.

## 4.4 Week-by-week timeline

| Week | Phase | Minimum outcome | Stretch goal if on schedule |
|---|---|---|---|
| 1 | Phase 1 | Read all geometry APIs in dev-2.0, trace full pipeline from `loadModel()` to `gl.drawElements()`, set up dev environment | Read processing4's `PShapeOBJ.java` and draft `materialProfile` schema |
| 2 | Phase 1 | Architecture doc finalised, design decisions 1-5 presented to mentors for sign-off (§3.4.1) | First `parseMtl()` token list drafted and shared with mentors |
| 3 | Phase 2 | `parseMtl()` extended to parse all mtl tokens: `Kd`, `Ka`, `Ks`, `Ns`, `d`, `illum`, `map_Kd`, `map_Ka`, `map_Ks`, `map_Bump` | `materialProfile` schema reviewed and approved by mentors |
| 4 | Phase 2 | `loadImage()` calls wired for all `map_*` paths inside `loadModel()`, `Promise.all()` awaited correctly | Unit tests for `parseMtl()` token parsing passing |
| 5 | Phase 2 | `parseMtl()` PR-ready: all error modes handled (missing mtl file, 404 texture path) (§3.4.9) | `parseObj()` slicer design drafted |
| 6 | Phase 3 | `parseObj()` `usemtl` boundary detection working, vertex data bucketed per material slice | UV coordinate assignment correct per slice |
| 7 | Phase 3 | Face-index localisation per slice complete, normals and UVs correct, `_materialSlices` array assembled on `p5.Geometry` | All existing single-material obj fixtures still pass (zero regression verified) |
| 8 | Phase 3 + checkpoint | `parseObj()` slicer complete and verified with real Blender and Sketchfab exports. **Community checkpoint 1**: post slicer demo on Discourse and Discord | Incorporate early community feedback, add any reported failure cases as fixture files |
| 9 | Phase 4 | `Renderer3D.model()` multi-draw loop in place, iterating `_materialSlices` | Per-slice `diffuseColor` and `specularColor` binding working |
| 10 | Phase 4 | Per-slice texture binding (`map_Kd`) working, GPU buffer cache per slice in place | `push()`/`pop()` material state restoration verified for multi-material models |
| 11 | Phase 4 + checkpoint | Full end-to-end multi-material render working with real obj/mtl files. **Community checkpoint 2**: post full demo on Discourse with a real Sketchfab model | Incorporate feedback, fix any community-reported rendering edge cases within Phase 4 buffer |
| 12 | Phase 5 | `GeometryBuilder` material boundary detection logic in place, detecting `texture()` and `specularMaterial()` changes mid-draw | `_materialSlices` produced correctly from `buildGeometry()` |
| 13 | Phase 5 | `buildGeometry()` integration complete, `model(geom)` renders procedural multi-material geometry correctly | Unit tests for boundary detection passing, PR ready for review |
| 14 | Phase 6 | Visual regression test infrastructure set up, first reference screenshot captured and committed for a multi-material model | 3+ visual tests covering different configurations (3 materials, 12 materials, untextured slices) |
| 15 | Phase 6 | Unit tests for `parseMtl()` and `parseObj()` slicer complete, all fixture files passing | Fixture files for all 3 error modes (missing mtl, 404 texture, partial mtl) |
| 16 | Phase 6 | All visual and unit tests passing on CI, all error handling paths covered | Additional fixture files from real Sketchfab and Blender exports |
| 17 | Phase 7 | JSDoc for `loadModel()` updated: multi-material support, texture loading, `async setup()` pattern, graceful degradation | JSDoc for `model()` updated with multi-material behaviour note |
| 18 | Phase 7 | JSDoc for `buildGeometry()` updated, runnable reference page examples written for all 3 functions | Discourse/Discord post announcing the feature with a tutorial sketch |
| 19 | Phase 8 | API parity audit complete across `push()`/`pop()`, instanced rendering, `orbitControl()`, `lights()`, `p5.Graphics` | Edge case testing: non-contiguous `usemtl`, Windows path separators, 100+ material groups |
| 20 | Phase 8 | Performance benchmark complete (12-slice model across Chrome, Firefox, Safari), 5 follow-up GitHub issues filed with full context | Final PR polished and code review feedback addressed |
| 21-22 | Overflow | Absorb any slippage from earlier phases without risk to final deliverables | If on schedule: better error messages for missing `map_Kd`, additional real-model fixtures, or PBR property stubs on `materialProfile` |

Weeks 21 and 22 are the final two weeks of the 22-week GSoC window. No new work is scheduled here. If a phase earlier in the timeline ran longer than expected, these weeks absorb that slip without any risk to the final deliverables. If all phases finished on time, these weeks become stretch goal time for features that are out of scope for v1 but worth filing as follow-up issues.



***

# Section 5: Research


## 5.1 Background and what I already know

### 5.1.1 The existing implementation (pr #6710, merged by **Diya** ([@diyaayay](https://github.com/diyaayay)) and **Dave** ([@davepagurek](https://github.com/davepagurek)))

I read through the entire pr #6710 (.mtl color support, merged 2024) to understand where the current code sits:

- `parseMtl()` parses `Kd`, `Ka`, `Ks`, and `map_Kd` (texture path stored but never used)
- `parseObj()` reads `usemtl` tokens and bakes the `Kd` diffuse colour into `model.vertexColors` as flat rgba values
- The result is a single `p5.Geometry` with per-vertex colour but no texture, a lossy representation
- `map_Ka`, `map_Ks`, `map_Bump`, `map_Ns`, `d`, `illum` are **silently ignored**

Issue #6924 (filed by sableraf) formally tracks what's missing. This project resolves it completely.

The collapsing approach introduced by #6710 had immediate side effects  - pr #6921 was filed and fixed within the same release cycle because vertex deduplication was destroying texture coordinates for models where vertices are shared across faces. Davepagurek's fix in pr #6923 explicitly documents how the single-array design makes per-material texture assignment structurally impossible. The architecture that caused #6921 is the same architecture this project replaces.

### 5.1.2 What I found in the dev-2.0 codebase

I studied the following files directly in the `dev-2.0` branch:

| file | what I looked at |
|---|---|
| `src/webgl/loading.js` | `parseObj()`, `parseMtl()`, `model()`, the entire vertex-deduplication pipeline |
| `src/core/p5.Renderer3D.js` | `model()`, `_drawGeometry()`, `_drawFills()`, `buildGeometry()` |
| `src/webgl/p5.RendererGL.js` | `_drawBuffers()`, the single `gl.drawElements()` call |
| `src/webgl/p5.Geometry.js` | all 20 properties of the geometry class |
| `src/webgl/material.js` | `fn.texture()`, global texture state |
| `src/webgl/p5.Shader.js` | `bindTextures()`, confirms one global texture per draw call |

Key findings:

- `beginGeometry()` and `endGeometry()` are not exposed as public user-facing functions in dev-2.0. They exist as internal renderer methods but there is no `fn.beginGeometry` or `fn.endGeometry`. The user-facing replacement is `buildGeometry(callback)`, which calls them internally. I built my entire poc using this api to ensure the proposal aligns with the new 2.0 architecture.
- `_materialSlices`, `materialGroups`, `subGeometries`, none of these exist on `Geometry`. This is the gap to fill.
- `model()` in dev-2.0 accepts `(model, count=1)` where `count` is for webgl2 instanced rendering.
- **Dave** ([@davepagurek](https://github.com/davepagurek))'s comment on the pr architecture: "if `loadModel` could load a group or a single geometry, we'd want them to behave as similarly to each other as possible, so if you draw a single geometry with `model`, then one would expect that to work for a group too."

### 5.1.3 How mentor and community feedback shaped this proposal

The proposal you are reading is not the first version. It went through real iterations based on direct mentor feedback, community-reported issues, and public discourse conversations, and that process is worth documenting because it changed the architecture.

When I first shared a prototype sketch with **Kit** ([@ksen0](https://github.com/ksen0)), she noticed it was running on p5.js 1.x. Her exact note was that `beginGeometry` and `endGeometry` do not exist in dev-2.0. I went back and read the dev-2.0 webgl source directly at `src/core/p5.Renderer3D.js`. That is where I found `buildGeometry(callback)` as the replacement. I rebuilt the entire poc from scratch using this api. That process is what revealed the full extent of what had changed in the 2.0 renderer and why the architecture needs to be designed specifically for it, not retrofitted from 1.x thinking. That same sketch also helped **Kit** ([@ksen0](https://github.com/ksen0)) identify a mistake in the new p5.js 2.0 reference, which she filed as issue #8631. It is a small thing, but it is a reminder that sharing early work in public spaces produces real signal even before a line of gsoc code is written.

In 2022, **Diya** ([@diyaayay](https://github.com/diyaayay)) opened pr #7176, exploring this exact feature space with a `p5.Material` + `p5.Group` class hierarchy to decouple geometry from material state. **Dave** ([@davepagurek](https://github.com/davepagurek)) noted: *"the direction is right but needs more design work."* that earlier exploration informed the architecture of this proposal directly. **Diya**'s choice to mentor this proposal reflects genuine continuity in the community's investment in this problem. And in issue #6670, **Dave** ([@davepagurek](https://github.com/davepagurek)) wrote in 2022: *"we'd need a new class containing multiple p5.Geometry objects with material settings for each."* `_materialSlices` is a direct response to that design question, which has remained open since 2022.

When I asked **Diya** ([@diyaayay](https://github.com/diyaayay)) about the approach for this proposal, she pushed back on any design that would expose a new public class. Her feedback was clear: keep the grouping logic inside the existing pipeline, avoid anything that looks like a breaking change. That is what killed option a (new `p5.GeometryGroup` class) and sent me toward `_materialSlices` as a private field.

**Dave** ([@davepagurek](https://github.com/davepagurek)) confirmed the overall direction was right and added one more constraint: api parity. `model()` must behave identically for single and multi-material geometry. That became the core test for every architectural decision in section 3.3.

**Diya** ([@diyaayay](https://github.com/diyaayay)) also asked directly whether each slice would carry its own complete material object, including `map_Ks`, `map_Bump`, and other mtl texture maps, not just the diffuse texture. That question is why section 3.4.1 defines a full `materialProfile` schema rather than just storing a single texture reference per slice.

**Connie** ([@khanniie](https://github.com/khanniie)) mentioned that the strongest proposals have three things: personal enthusiasm for the subject matter, a poc with real code, and evidence of previous contributions. That framing helped me make sure all three are visible in this proposal.

Beyond the mentors, the community has independently reported this same failure repeatedly. Issue #7346 (obj models not displaying materials even when `normalMaterial()` is called explicitly) and issue #4032 (`texture()` not working for loaded model objects) are both filed by regular p5.js users who hit the wall without knowing why. This proposal addresses the root cause that both of those issues trace back to: the obj parser discards material boundaries before the renderer ever sees them. **the fact that unrelated users filed the same bug independently, years apart, is the clearest possible signal that the fix belongs in the core library**.

### 5.1.4 Previous attempts and why they stalled

This is not a new problem, and this proposal builds on prior exploration. Three contributors investigated this before and each identified the right problem area. Each attempt contributed to the understanding of what a complete architecture needs to look like. `_materialSlices` is an attempt to answer the design question that each of those efforts raised.

| pr | author | year | what it tried | why it stalled |
|---|---|---|---|---|
| [#7176](https://github.com/processing/p5.js/pull/7176) | Diya | 2022 | `p5.Material` + `p5.Group` class hierarchy to decouple geometry from material state | **Dave**: *"direction is right but needs more design work"*  - closed |
| [#7072](https://github.com/processing/p5.js/pull/7072) | rohanjulka19 | 2022 | per-material texture mappings stored in `p5.Geometry`, index buffer re-rendered per texture | **Dave** raised class design concerns about splitting `p5.Geometry`  - stalled open |
| [#8675](https://github.com/processing/p5.js/pull/8675) | aakritithecoder | 2024 | `map_Ka`, `map_Ks`, `map_Bump` parsing added to `parseMtl()` | closed by **Kit** for missing tests and wrong branch  - no architecture |

The common thread: every attempt ran into the same design question **Dave** named in [issue #6670](https://github.com/processing/p5.js/issues/6670) in 2022  - *"we'd need a new class containing multiple p5.Geometry objects with material settings for each."* `_materialSlices` is this proposal's answer to that question.

### 5.1.5 My existing contribution

I have an open pr (#8666) on `dev-2.0` that fixes a crash in `parseObj()` at lines 655-658. The `hasColoredVertices === hasColorlessVertices` boolean logic error caused blender, maya, tinkercad, and sketchfab exports to throw instead of loading gracefully. I found this bug while reading `parseObj()` specifically to understand the code I would be working on for this project. It was not a separate investigation, it came directly out of the deep read I did for the proposal. This is also why I know exactly where the slicer needs to be inserted in that function.


***

# Section 6: Practicalities

## 6.1 Eligibility

I have read the GSoC Rules 7.1 carefully and confirm that I am eligible to participate as a GSoC contributor.

## 6.2 AI disclosure

AI tools were used in this proposal for formatting assistance and English grammar corrections only. All technical research, source code reading, architecture decisions, proof of concept, and pull request code are entirely my own work.

## 6.3 Availability

I have kept this summer open specifically for this project. There are no internships, courses, or side commitments lined up, so the coding period gets my undivided attention. This is not a backup plan; I want to ship something real that p5.js users will actually benefit from, and I intend to treat it with the same seriousness I would give a full-time job.

I am free every day of the week, from 4:00 PM IST to 11:00 PM IST (10:30 AM UTC to 5:30 PM UTC), and I can stretch that window when needed to sync with mentors in different time zones. I prefer to communicate early when something is unclear rather than go quiet, so the team will always know where things stand. Written updates or live calls both work well for me; I will follow whatever rhythm the mentors prefer.

