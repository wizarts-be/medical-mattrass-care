/**
 * MMC v2 — "The made bed".
 * A 200 x 90 x 15 cm mattress in the MMC 210 PU cover. Pointer pressure sinks into the visco
 * quickly and recovers slowly (material memory); the dent shows as a pressure map.
 * Scroll unmakes the bed: sheet off, cover lifted, visco separated from the CMHR core.
 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, PlaneGeometry, BoxGeometry, ShaderMaterial,
  DataTexture, RedFormat, UnsignedByteType, LinearFilter, Vector3, Matrix4, Matrix3, Raycaster, Vector2,
  LinearSRGBColorSpace, MeshBasicMaterial, ClampToEdgeWrapping, DoubleSide,
} from 'three';

const L = 200, W = 90, H = 15;      // cm
const GW = 160, GH = 72;            // pressure grid
const DEPTH = 6.5;                  // max sink in cm

const smooth = (t: number, a: number, b: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ───────────────────────── shaders ───────────────────────── */

const topVert = /* glsl */ `
  uniform sampler2D uP;
  uniform float uDepth;
  uniform vec2 uSize;
  varying vec2 vUv;
  varying float vD;
  varying vec3 vWorld;
  float edgeCm(vec2 uv) { vec2 cm = uv * uSize; vec2 d = min(cm, uSize - cm); return min(d.x, d.y); }
  void main() {
    vUv = uv;
    float e = edgeCm(uv);
    float d = texture2D(uP, uv).r * smoothstep(0.0, 8.0, e);
    vD = d;
    vec3 p = position;
    p.y -= d * uDepth;
    p.y -= (1.0 - smoothstep(0.0, 3.0, e)) * 1.4; // rounded top edge of the mattress
    vec4 w = modelMatrix * vec4(p, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const topFrag = /* glsl */ `
  uniform sampler2D uP;
  uniform vec2 uTexel;
  uniform float uDepth;
  uniform vec2 uSize;
  uniform mat3 uRot;
  uniform vec3 uLight;
  uniform vec3 uCam;
  uniform float uSheet;      // fold line position along the length (cm)
  uniform float uSheetFade;
  uniform float uHeat;
  varying vec2 vUv;
  varying float vD;
  varying vec3 vWorld;

  float P(vec2 uv) { return texture2D(uP, uv).r; }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  vec3 heatRamp(float t) {
    vec3 a = vec3(0.30, 0.22, 0.62);      // blue tint
    vec3 b = vec3(0.70, 0.30, 0.42);      // warm rose
    vec3 c = vec3(0.937, 0.373, 0.094);   // #EF5F18
    vec3 d = vec3(1.0, 0.70, 0.48);       // hot
    return t < 0.33 ? mix(a, b, t / 0.33) : t < 0.7 ? mix(b, c, (t - 0.33) / 0.37) : mix(c, d, (t - 0.7) / 0.3);
  }

  void main() {
    vec2 uv = vUv;
    vec2 cm = uv * uSize;
    float hl = P(uv - vec2(uTexel.x, 0.0)), hr = P(uv + vec2(uTexel.x, 0.0));
    float hd = P(uv - vec2(0.0, uTexel.y)), hu = P(uv + vec2(0.0, uTexel.y));
    float dhdx = -(hr - hl) * uDepth / (2.0 * uTexel.x * uSize.x);
    float dhdz =  (hu - hd) * uDepth / (2.0 * uTexel.y * uSize.y);
    vec3 n = normalize(vec3(-dhdx, 1.0, -dhdz));

    // sheet: covers the foot end (x > uSheet); its top-left corner is folded back diagonally
    float sd = cm.x - uSheet;                       // cm past the sheet edge
    float A = 34.0;                                 // fold size
    float fu = (cm.x - uSheet) + (uSize.y - cm.y);  // distance along the fold normal (x sqrt2)
    float fw = (cm.x - uSheet) - (uSize.y - cm.y);
    float inSheet = step(0.0, sd);
    float exposed = inSheet * step(fu, A);          // corner lifted away: cover shows through
    float flapEdge = 2.0 * A - fu - abs(fw);     // cm inside the flap's free edges
    float flap = smoothstep(A - 0.4, A + 0.4, fu) * smoothstep(-0.4, 0.4, flapEdge); // folded-back triangle
    float onSheet = max(inSheet - exposed, 0.0) * uSheetFade;
    float onFlap = flap * uSheetFade;

    // gentle drape so the satin catches light unevenly, like a real taut cover
    float drape = vnoise(cm * 0.045) - 0.5;
    float drape2 = vnoise(cm * 0.11 + 7.0) - 0.5;
    vec3 nPU = normalize(n + vec3(drape * 0.06 + drape2 * 0.03, 0.0, drape2 * 0.05 + sin((cm.x + cm.y) * 9.0) * 0.008));
    // knit: soft V-stitches, faded with distance to avoid moire
    float stitchY = abs(fract(cm.y * 0.3) - 0.5);
    float stitch = sin((cm.x * 0.45 + stitchY * 1.6) * 6.2832) * 0.5 + 0.5;
    float aa = 1.0 - smoothstep(0.3, 0.9, fwidth(cm.x * 0.45));
    stitch = mix(0.5, stitch, aa);
    vec3 nSh = normalize(mix(vec3(0.0, 1.0, 0.0), n, 0.35) + vec3((stitch - 0.5) * 0.12, 0.0, 0.0));
    vec3 nn = normalize(uRot * mix(nPU, nSh, max(onSheet, onFlap)));

    vec3 Lp = vec3(-140.0, 260.0, 120.0);           // soft key light, above-left
    vec3 Ld = normalize(Lp - vWorld);
    vec3 V = normalize(uCam - vWorld);
    vec3 Hh = normalize(Ld + V);
    float ndl = dot(nn, Ld);
    float diff = clamp(ndl * 0.6 + 0.4, 0.0, 1.0);
    float ndh = max(dot(nn, Hh), 0.0);
    float fres = pow(1.0 - max(dot(nn, V), 0.0), 3.0);

    // MMC 210 PU: satin indigo with a broad sheen and a tight highlight
    vec3 indigo = vec3(0.149, 0.102, 0.400);
    vec3 lilac = vec3(0.56, 0.50, 0.86);
    vec3 pu = indigo * (0.4 + 0.75 * diff);
    pu += lilac * (pow(ndh, 90.0) * 0.6 + pow(ndh, 14.0) * 0.42 + pow(ndh, 4.0) * 0.16);
    pu += lilac * smoothstep(0.35, 1.0, drape + 0.5) * 0.07;
    pu += lilac * fres * 0.25;

    // pressure map: a contour map drawn into the fabric, orange only where the load peaks
    float d = vD;
    vec3 violet = vec3(0.30, 0.22, 0.62);
    pu = mix(pu, violet * (0.55 + 0.6 * diff), smoothstep(0.03, 0.35, d) * 0.55 * uHeat);
    vec3 hc = heatRamp(clamp(d, 0.0, 1.0));
    pu = mix(pu, hc * (0.65 + 0.45 * diff), smoothstep(0.35, 0.95, d) * 0.85 * uHeat);
    pu += vec3(0.94, 0.37, 0.09) * smoothstep(0.6, 1.0, d) * 0.18 * uHeat;
    float iso = abs(fract(d * 7.0) - 0.5);
    float isoLine = (1.0 - smoothstep(0.0, fwidth(d * 7.0) * 1.3, iso - 0.46)) * smoothstep(0.03, 0.1, d) * uHeat;
    vec3 isoC = mix(vec3(0.75, 0.7, 0.95), vec3(1.0, 0.72, 0.4), smoothstep(0.2, 0.7, d));
    pu = mix(pu, isoC, isoLine * 0.7);

    // seam piping along the edge
    vec2 ed = min(cm, uSize - cm);
    float edge = min(ed.x, ed.y);
    pu *= mix(0.62, 1.0, smoothstep(0.6, 2.2, edge));

    // shadows: sheet edge and folded flap edge on the cover
    float edgeSh = (1.0 - smoothstep(0.0, 6.0, -sd)) * step(sd, 0.0) * uSheetFade;
    float foldSh = (1.0 - smoothstep(0.0, 8.0, A - fu)) * exposed * uSheetFade;
    pu *= 1.0 - max(edgeSh, foldSh) * 0.5;

    // knitted sheet: cool white, dents shade but carry no heat colour
    vec3 sheetC = vec3(0.914, 0.925, 0.945);
    vec3 sh = sheetC * (0.62 + 0.4 * diff);
    sh *= mix(0.9, 1.0, stitch);
    // flap underside: slightly cooler and shaded, crisp crease at the fold, soft shadow beyond its edge
    // flap: cloth turned back. Rolled at the crease, lifting toward the tip, a visible hem along its free edges.
    float t = clamp((fu - A) / A, 0.0, 1.0);
    vec3 under = sheetC * vec3(0.93, 0.94, 0.985);
    under *= mix(0.84, 1.0, smoothstep(0.0, 0.25, t)) * mix(1.0, 0.92, t);   // roll shading + tip lifting away
    under *= mix(0.9, 1.0, stitch);
    under *= 0.94 + 0.06 * sin(fw * 0.35 + vnoise(cm * 0.2) * 2.0);           // soft drape across the flap
    float hem = 1.0 - smoothstep(1.2, 2.6, flapEdge);
    under = mix(under, sheetC * 0.78, hem * 0.55);
    float creaseHi = 1.0 - smoothstep(0.0, 2.2, fu - A);
    under = mix(under, sheetC * 1.04, creaseHi * 0.5);
    // soft shadow the flap throws on the sheet around its free edges
    float flapEdgeSh = (1.0 - smoothstep(0.0, 9.0, -flapEdge)) * step(flapEdge, 0.0) * step(A, fu) * onSheet;
    sh *= 1.0 - flapEdgeSh * 0.22;

    vec3 col = mix(pu, sh, onSheet);
    col = mix(col, under, onFlap);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const sideVert = /* glsl */ `
  varying vec3 vLocal;
  varying vec3 vN;
  varying vec3 vWorld;
  void main() {
    vLocal = position;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
const sideFrag = /* glsl */ `
  uniform vec3 uLight;
  uniform vec3 uCam;
  uniform float uH;
  varying vec3 vLocal;
  varying vec3 vN;
  varying vec3 vWorld;
  void main() {
    vec3 n = normalize(vN);
    vec3 Ld = normalize(uLight);
    vec3 V = normalize(uCam - vWorld);
    float diff = clamp(dot(n, Ld) * 0.55 + 0.45, 0.0, 1.0);
    vec3 indigo = vec3(0.149, 0.102, 0.400);
    vec3 col = indigo * (0.32 + 0.6 * diff);
    float y = vLocal.y + uH * 0.5;          // 0 at bottom
    col *= mix(0.72, 1.0, smoothstep(0.0, uH, y));
    // the hidden zipper, same colour as the cover
    float along = vLocal.x + vLocal.z;
    float band = 1.0 - smoothstep(0.0, 0.18, abs(y - uH * 0.38) - 0.42);
    float teeth = step(0.5, fract(along * 1.6));
    col = mix(col, col * (0.55 + 0.35 * teeth), band);
    col += vec3(0.56, 0.50, 0.86) * pow(1.0 - max(dot(n, V), 0.0), 3.0) * 0.15;
    // top rim seam
    col *= mix(0.6, 1.0, smoothstep(uH - 0.9, uH - 2.0, y));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const foamFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uLight;
  uniform float uScale;
  varying vec3 vLocal;
  varying vec3 vN;
  varying vec3 vWorld;
  float hash(vec3 p) { return fract(sin(dot(p, vec3(17.1, 113.7, 271.3))) * 43758.5453); }
  float cell(vec3 p) {
    vec3 i = floor(p), f = fract(p); float m = 1.0;
    for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) for (int z = -1; z <= 1; z++) {
      vec3 g = vec3(x, y, z); vec3 o = vec3(hash(i + g), hash(i + g + 7.1), hash(i + g + 13.7));
      m = min(m, length(g + o - f));
    }
    return m;
  }
  void main() {
    vec3 n = normalize(vN);
    float diff = clamp(dot(n, normalize(uLight)) * 0.6 + 0.4, 0.0, 1.0);
    float c = cell(vLocal * uScale);
    float pores = smoothstep(0.08, 0.32, c);
    vec3 col = uColor * (0.62 + 0.45 * diff) * mix(0.8, 1.0, pores);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const shadowFrag = /* glsl */ `
  uniform vec2 uHalf;
  uniform float uAlpha;
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * (uHalf * 2.0 + 80.0);
    vec2 q = abs(p) - uHalf;
    float sdf = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    float a = (1.0 - smoothstep(-6.0, 34.0, sdf)) * uAlpha;
    gl_FragColor = vec4(0.15, 0.10, 0.40, a);
  }
`;

/* ───────────────────────── engine ───────────────────────── */

export interface BedOptions {
  canvas: HTMLCanvasElement;
  run: HTMLElement;              // the scroll section that drives the unmaking
  hero: HTMLElement;             // pointer surface
  labels: Record<string, HTMLElement>;
  reduced: boolean;
  onReady?: () => void;
}

export function createBed(o: BedOptions) {
  const renderer = new WebGLRenderer({ canvas: o.canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 10, 3000);
  const bed = new Group();          // whole bed, posed per breakpoint
  const coverG = new Group();       // PU cover (top + sides) lifts away
  const viscoG = new Group();
  bed.add(coverG, viscoG);
  scene.add(bed);

  // pressure field
  const load = new Float32Array(GW * GH);
  const disp = new Float32Array(GW * GH);
  const bytes = new Uint8Array(GW * GH);
  const tex = new DataTexture(bytes, GW, GH, RedFormat, UnsignedByteType);
  tex.magFilter = tex.minFilter = LinearFilter;
  tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
  tex.needsUpdate = true;

  const light = new Vector3(-0.45, 1, 0.55);
  const camPos = new Vector3();
  const rot = new Matrix3();

  const topGeo = new PlaneGeometry(L, W, 220, 100);
  topGeo.rotateX(-Math.PI / 2);
  const topMat = new ShaderMaterial({
    vertexShader: topVert,
    fragmentShader: topFrag,
    uniforms: {
      uP: { value: tex }, uTexel: { value: new Vector2(1 / GW, 1 / GH) }, uDepth: { value: DEPTH },
      uSize: { value: new Vector2(L, W) }, uRot: { value: rot }, uLight: { value: light }, uCam: { value: camPos },
      uSheet: { value: L * 0.58 }, uSheetFade: { value: 1 }, uHeat: { value: 1 },
    },
  });
  const top = new Mesh(topGeo, topMat);
  top.position.y = H;
  coverG.add(top);

  const sideMat = new ShaderMaterial({
    vertexShader: sideVert, fragmentShader: sideFrag,
    uniforms: { uLight: { value: light }, uCam: { value: camPos }, uH: { value: H } },
  });
  const hidden = new MeshBasicMaterial({ visible: false });
  const sides = new Mesh(new BoxGeometry(L, H, W), [sideMat, sideMat, hidden, sideMat, sideMat, sideMat]);
  sides.position.y = H / 2;
  coverG.add(sides);

  const foam = (h: number, color: [number, number, number], scale: number) =>
    new Mesh(new BoxGeometry(L - 1.2, h, W - 1.2), new ShaderMaterial({
      vertexShader: sideVert, fragmentShader: foamFrag,
      uniforms: { uColor: { value: new Vector3(...color) }, uLight: { value: light }, uScale: { value: scale } },
    }));
  const cmhr = foam(10, [0.70, 0.79, 0.72], 1.4);
  cmhr.position.y = 5;
  const visco = foam(5, [0.86, 0.83, 0.70], 2.1);
  visco.position.y = 12.5;
  viscoG.add(visco);
  bed.add(cmhr);
  cmhr.visible = visco.visible = false;

  const shadowMat = new ShaderMaterial({
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: shadowFrag, transparent: true, depthWrite: false, side: DoubleSide,
    uniforms: { uHalf: { value: new Vector2(L / 2, W / 2) }, uAlpha: { value: 0.32 } },
  });
  const shadow = new Mesh(new PlaneGeometry(L + 80, W + 80), shadowMat);
  shadow.rotateX(-Math.PI / 2);
  shadow.position.y = -0.2;
  bed.add(shadow);

  /* ── pressure input ── */
  type Press = { u: number; v: number; amp: number; r: number };
  let pointer: Press | null = null;
  let pressed = false;
  let lastMove = 0;
  const body: { x: number; z: number; rx: number; rz: number; a: number }[] = [
    { x: 13, z: 0, rx: 8, rz: 8, a: 0.75 },        // head
    { x: 40, z: 0, rx: 9, rz: 21, a: 0.85 },       // shoulders
    { x: 62, z: 0, rx: 14, rz: 15, a: 0.45 },      // back
    { x: 92, z: 0, rx: 12, rz: 17, a: 1.0 },       // sacrum
    { x: 125, z: -9, rx: 17, rz: 7, a: 0.42 }, { x: 125, z: 9, rx: 17, rz: 7, a: 0.42 },
    { x: 160, z: -8, rx: 13, rz: 5, a: 0.3 }, { x: 160, z: 8, rx: 13, rz: 5, a: 0.3 },
    { x: 187, z: -8, rx: 5, rz: 4.5, a: 0.9 }, { x: 187, z: 8, rx: 5, rz: 4.5, a: 0.9 },
  ];
  let bodyAmt = 0;            // 0..1 how much the demo body presses

  const addGauss = (cx: number, cz: number, rx: number, rz: number, a: number) => {
    // cx along length (cm, 0 = head), cz across width (cm, 0 = centre)
    const gx = (cx / L) * GW, gy = ((cz + W / 2) / W) * GH;
    const sx = (rx / L) * GW, sy = (rz / W) * GH;
    const x0 = Math.max(0, Math.floor(gx - sx * 3)), x1 = Math.min(GW - 1, Math.ceil(gx + sx * 3));
    const y0 = Math.max(0, Math.floor(gy - sy * 3)), y1 = Math.min(GH - 1, Math.ceil(gy + sy * 3));
    for (let y = y0; y <= y1; y++) {
      const dy = (y - gy) / sy;
      for (let x = x0; x <= x1; x++) {
        const dx = (x - gx) / sx;
        const g = a * Math.exp(-0.5 * (dx * dx + dy * dy));
        const i = y * GW + x;
        load[i] = Math.max(load[i], g);
      }
    }
  };

  const stepPressure = (dt: number) => {
    load.fill(0);
    if (bodyAmt > 0.001) for (const b of body) addGauss(b.x, b.z, b.rx, b.rz, b.a * bodyAmt);
    if (pointer) addGauss(pointer.u * L, (pointer.v - 0.5) * W, pointer.r, pointer.r, pointer.amp);
    const sink = 1 - Math.exp(-dt * 7);
    const rise = 1 - Math.exp(-dt * 0.5);       // visco memory: slow recovery
    let any = false;
    for (let i = 0; i < load.length; i++) {
      const l = load[i], d = disp[i];
      const nd = d + (l - d) * (l > d ? sink : rise);
      disp[i] = nd;
      const b = Math.min(255, Math.round(nd * 255));
      if (b !== bytes[i]) { bytes[i] = b; any = true; }
    }
    if (any) tex.needsUpdate = true;
  };

  /* ── layout per breakpoint ── */
  let vw = 1, vh = 1, portrait = false;
  const resize = () => {
    const r = o.canvas.getBoundingClientRect();
    vw = Math.max(1, r.width); vh = Math.max(1, r.height);
    portrait = vw / vh < 0.9;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, vw < 700 ? 2 : 1.75));
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
  };

  // poses: [rotY, offsetX(cm, screen-right), offsetZ, elevation(deg), azimuth(deg), distance factor]
  const pose = (t: number) => {
    // t = 0: the bed seen near top-down, ready to be pressed; then it comes apart
    const heroP = portrait
      ? { ry: -0.34, ox: 0, oz: 0, el: 62, az: 0, k: 1.7, sy: -0.12 }
      : { ry: -0.2, ox: 44, oz: 0, el: 64, az: 0, k: 1.14, sy: -0.04 };
    const sideP = portrait
      ? { ry: -0.42, ox: 0, oz: 0, el: 25, az: 28, k: 1.7, sy: -0.01 }
      : { ry: -0.26, ox: 14, oz: 0, el: 22, az: 24, k: 1.24, sy: -0.1 };
    const b = smooth(t, 0.1, 0.4);
    return {
      ry: lerp(heroP.ry, sideP.ry, b), ox: lerp(heroP.ox, sideP.ox, b), oz: lerp(heroP.oz, sideP.oz, b),
      el: lerp(heroP.el, sideP.el, b), az: lerp(heroP.az, sideP.az, b), k: lerp(heroP.k, sideP.k, b),
      sy: lerp(heroP.sy, sideP.sy, b),
    };
  };

  const target = new Vector3();
  const applyPose = (t: number) => {
    const p = pose(t);
    bed.rotation.y = p.ry;
    bed.position.set(0, 0, 0);
    const lift = smooth(t, 0.36, 0.6), sep = smooth(t, 0.6, 0.82);
    coverG.position.y = lift * 62;
    viscoG.position.y = sep * 26;
    cmhr.visible = visco.visible = lift > 0.001;
    shadowMat.uniforms.uAlpha.value = 0.32 - lift * 0.1;
    topMat.uniforms.uSheet.value = lerp(L * 0.58, L * 1.75, smooth(t, 0.0, 0.2));
    topMat.uniforms.uSheetFade.value = 1 - smooth(t, 0.14, 0.24);

    // frame: fit the bed (plus explode height) into the view
    const fov = (camera.fov * Math.PI) / 180;
    const hfov = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
    const span = portrait ? 135 : 130;
    const dist = (span / Math.tan(Math.min(fov, hfov) / 2)) * p.k * (portrait ? 0.62 : 1);
    const el = (p.el * Math.PI) / 180, az = (p.az * Math.PI) / 180;
    target.set(-p.ox, 22 * lift + 6, p.oz);
    camera.position.set(
      target.x + dist * Math.cos(el) * Math.sin(az),
      target.y + dist * Math.sin(el),
      target.z + dist * Math.cos(el) * Math.cos(az),
    );
    camera.lookAt(target);
    camera.setViewOffset(vw, vh, 0, p.sy * vh, vw, vh);
    camera.updateMatrixWorld();
    bed.updateMatrixWorld(true);
    rot.setFromMatrix4(top.matrixWorld);
    camPos.copy(camera.position);
  };

  /* ── pointer → uv on the (undisplaced) top plane ── */
  const ray = new Raycaster();
  const ndc = new Vector2();
  const inv = new Matrix4();
  const toUv = (cx: number, cy: number): { u: number; v: number } | null => {
    const r = o.canvas.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    inv.copy(top.matrixWorld).invert();
    const org = ray.ray.origin.clone().applyMatrix4(inv);
    const dir = ray.ray.direction.clone().transformDirection(inv);
    if (Math.abs(dir.y) < 1e-4) return null;
    const s = -org.y / dir.y;
    if (s < 0) return null;
    const x = org.x + dir.x * s, z = org.z + dir.z * s;
    const u = x / L + 0.5, v = -z / W + 0.5;
    if (u < 0 || u > 1 || v < 0 || v > 1) return null;
    return { u, v };
  };

  let progress = 0, shown = 0;
  const interactive = () => shown < 0.08;

  const onMove = (e: PointerEvent) => {
    if (!interactive()) { pointer = null; return; }
    const hit = toUv(e.clientX, e.clientY);
    lastMove = performance.now();
    if (!hit) { pointer = null; o.hero.style.cursor = ''; return; }
    const fine = e.pointerType === 'mouse';
    pointer = { ...hit, amp: pressed || !fine ? 1 : 0.42, r: pressed ? 13 : 10 };
    o.hero.style.cursor = 'grab';
    o.hero.dataset.pressed = '1';
  };
  const onDown = (e: PointerEvent) => { pressed = true; onMove(e); };
  const onUp = () => { pressed = false; if (pointer) pointer.amp = 0.42; };
  const onLeave = (e: PointerEvent) => { pointer = null; pressed = false; if (e.pointerType !== 'mouse') pointer = null; };
  o.hero.addEventListener('pointermove', onMove);
  o.hero.addEventListener('pointerdown', onDown);
  addEventListener('pointerup', onUp);
  o.hero.addEventListener('pointerleave', onLeave);
  o.hero.addEventListener('pointercancel', onLeave);

  /* ── scroll progress through the unmaking ── */
  const readProgress = () => {
    const r = o.run.getBoundingClientRect();
    const total = r.height - innerHeight;
    progress = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  };

  /* ── labels follow their layer ── */
  const anchor = new Vector3();
  // rightmost on-screen point of a layer (any of its four corners), so a label never overlaps it
  const project = (obj: Mesh | Group, y: number) => {
    let bx = -Infinity, by = 0;
    for (const [cx, cz] of [[L / 2, W / 2], [L / 2, -W / 2], [-L / 2, W / 2], [-L / 2, -W / 2]]) {
      anchor.set(cx, y, cz);
      obj.localToWorld(anchor);
      anchor.project(camera);
      const sx = (anchor.x * 0.5 + 0.5) * vw, sy = (-anchor.y * 0.5 + 0.5) * vh;
      if (sx > bx) { bx = sx; by = sy; }
    }
    return { x: bx + 4, y: by };
  };
  const placeLabels = (t: number) => {
    const windows: Record<string, [number, number, number, number]> = {
      sheet: [0.02, 0.06, 0.2, 0.26],
      cover: [0.4, 0.46, 1.1, 1.2],
      visco: [0.62, 0.68, 1.1, 1.2],
      cmhr: [0.62, 0.68, 1.1, 1.2],
    };
    const pos: Record<string, { x: number; y: number }> = {
      sheet: project(top, 0),
      cover: project(top, 0),
      visco: project(visco, 0),
      cmhr: project(cmhr, 0),
    };
    for (const k in o.labels) {
      const el = o.labels[k];
      const [a, b, c, d] = windows[k];
      const vis = smooth(t, a, b) * (1 - smooth(t, c, d));
      el.style.opacity = vis.toFixed(3);
      el.style.visibility = vis > 0.01 ? 'visible' : 'hidden';
      el.style.setProperty('--x', `${Math.min(pos[k].x, vw - 300).toFixed(1)}px`);
      el.style.setProperty('--y', `${pos[k].y.toFixed(1)}px`);
      el.dataset.active = vis > 0.5 ? '1' : '0';
    }
  };

  /* ── loop ── */
  let raf = 0, last = performance.now(), running = false, visible = false, seenAt = 0;
  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    readProgress();
    shown += (progress - shown) * (o.reduced ? 1 : 1 - Math.exp(-dt * 9));

    // demo: someone lies down, then gets up and the visco slowly recovers
    const t = seenAt ? (now - seenAt) / 1000 : 0;
    bodyAmt = o.reduced || !seenAt ? 0 : smooth(t, 0.3, 1.3) * (1 - smooth(t, 3.0, 3.5));
    if (pointer && now - lastMove > 2600 && !pressed) pointer = null;

    stepPressure(dt);
    applyPose(shown);
    placeLabels(shown);
    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  };
  const play = () => { if (!running && visible) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } };
  const pause = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !seenAt && e.intersectionRatio > 0.25) seenAt = performance.now();
    visible ? play() : pause();
  }, { threshold: [0, 0.25, 0.5] });
  io.observe(o.run);
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
  const ro = new ResizeObserver(() => { resize(); if (!running) frame(performance.now()); });
  ro.observe(o.canvas);

  // reduced motion: a still imprint instead of the lying-down demo
  if (o.reduced) {
    for (const b of body) addGauss(b.x, b.z, b.rx, b.rz, b.a * 0.7);
    for (let i = 0; i < disp.length; i++) { disp[i] = load[i]; bytes[i] = Math.round(load[i] * 255); }
    tex.needsUpdate = true;
  }

  resize();
  frame(performance.now());
  play();
  o.onReady?.();

  return {
    dispose() {
      pause(); io.disconnect(); ro.disconnect();
      renderer.dispose();
    },
  };
}

export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch { return false; }
}
