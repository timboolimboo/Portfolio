import gsap from "gsap";
import { state } from "./state.js";
import { closeMenuImmediate } from "./menu.js";
import { scrollToHash } from "./horizontal.js";

const VERT = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform float uProgress;
uniform vec3 uColor;
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
void main() {
  float n = noise(vUv * 5.5);
  float alpha = smoothstep(-0.2, 0.2, n - (1.0 - uProgress));
  gl_FragColor = vec4(uColor, alpha);
}
`;

let glLayer = null;
let busy = false;

export function mountTransitions() {
  const canvas = document.querySelector("#dissolve");
  if (!(canvas instanceof HTMLCanvasElement)) return () => {};
  glLayer = createLayer(canvas);
  rememberArrival();

  const onClick = (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (anchor.target && anchor.target !== "_self") return;
    if (anchor.hasAttribute("download")) return;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    const samePath = url.pathname.replace(/\/$/, "") === window.location.pathname.replace(/\/$/, "");
    if (samePath && url.hash) {
      event.preventDefault();
      closeMenuImmediate();
      if (document.body.dataset.page === "home") scrollToHash(url.hash);
      else window.location.assign(url.href);
      return;
    }
    if (url.href === window.location.href) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    const color = anchor.dataset.transition || document.body.dataset.transition || "#faf9f6";
    const go = () => {
      try {
        sessionStorage.setItem("folio-cover", color);
      } catch {
        /* ignore quota */
      }
      window.location.assign(url.href);
    };
    closeMenuImmediate();
    if (state.reduced || busy || !glLayer) {
      go();
      return;
    }
    busy = true;
    cover(color, go);
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

function rememberArrival() {
  let color = "";
  try {
    color = sessionStorage.getItem("folio-cover") || "";
    sessionStorage.removeItem("folio-cover");
  } catch {
    color = "";
  }
  if (!color || !glLayer || state.reduced) {
    document.documentElement.style.background = "";
    return;
  }
  paint(glLayer, 1, hexToRgb(color));
  glLayer.canvas.style.visibility = "visible";
  gsap.to(glLayer, {
    progress: 0,
    duration: 0.7,
    ease: "power1.out",
    onUpdate: () => paint(glLayer, glLayer.progress, glLayer.color),
    onComplete: () => {
      glLayer.canvas.style.visibility = "hidden";
      document.documentElement.style.background = "";
    },
  });
}

function cover(color, done) {
  if (!glLayer) {
    done();
    return;
  }
  glLayer.color = hexToRgb(color);
  glLayer.progress = 0;
  glLayer.canvas.style.visibility = "visible";
  paint(glLayer, 0, glLayer.color);
  gsap.to(glLayer, {
    progress: 1,
    duration: 0.85,
    ease: "power1.in",
    onUpdate: () => paint(glLayer, glLayer.progress, glLayer.color),
    onComplete: done,
  });
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
  return [
    Number.parseInt(normalized.slice(0, 2), 16) / 255,
    Number.parseInt(normalized.slice(2, 4), 16) / 255,
    Number.parseInt(normalized.slice(4, 6), 16) / 255,
  ];
}

function createLayer(canvas) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true });
  if (!gl) return null;
  const program = link(gl, VERT, FRAG);
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const location = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const layer = {
    canvas,
    gl,
    progress: 0,
    color: [0, 0, 0],
    uProgress: gl.getUniformLocation(program, "uProgress"),
    uColor: gl.getUniformLocation(program, "uColor"),
    program,
  };
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener("resize", resize);
  return layer;
}

function link(gl, vertexSource, fragmentSource) {
  const vertex = shader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = shader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return program;
}

function shader(gl, type, source) {
  const item = gl.createShader(type);
  gl.shaderSource(item, source);
  gl.compileShader(item);
  return item;
}

function paint(layer, progress, color) {
  const { gl, program, uProgress, uColor } = layer;
  gl.useProgram(program);
  gl.uniform1f(uProgress, progress);
  gl.uniform3f(uColor, color[0], color[1], color[2]);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
