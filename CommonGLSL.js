import { Vector3, Vector2 } from "three";
function abs(x) {
  if (x.isVector3) return new Vector3(Math.abs(x.x), Math.abs(x.y), Math.abs(x.z));
  if (x.isVector2) return new Vector2(Math.abs(x.x), Math.abs(x.y));
  return Math.abs(x);
}
function sign(x) { return Math.sign(x); }
function sin(x) { return Math.sin(x); }
function cos(x) { return Math.cos(x); }
function atan(y, x) { return Math.atan2(y, x); }
function sqrt(x) { return Math.sqrt(x); }
function floor(x) { return Math.floor(x); }
function vec3(x, y, z) { return new Vector3(x, y, z); }
function vec2(x, y) { return new Vector2(x, y); }
function clamp(v, e1, e2) { return (v < e1) ? e1 : (v > e2) ? e2 : v; }
function length(x) { return x.length(); }
function dot(x, y) { return x.dot(y); }
function dot2(x) { return x.dot(x); }
function cross(x, y) { let res = new Vector3(); res.crossVectors(x, y); return res; }
function mod(x, y) { return x % y; }
function mix(x, y, a) { return x * (1 - a) + y * a; }
function vec3a(a, b) { let res = new Vector3(); res.addVectors(a, b); return res; }
function vec3s(a, b) { let res = new Vector3(); res.subVectors(a, b); return res; }
function vec3m(a, x) { let res = new Vector3(a.x, a.y, a.z); res.multiplyScalar(x); return res }
function rotz(p, f) {
  let x = p.x * cos(f) - p.y * sin(f);
  let y = p.x * sin(f) + p.y * cos(f);
  return new Vector3(x, y, p.z);
}
function max(x, y) {
  if (x.isVector3) {
    let res = new Vector3(x.x, x.y, x.z);
    res.max(new Vector3(y, y, y));
    return res;
  }
  if (x.isVector2) {
    let res = new Vector2(x.x, x.y);
    res.max(new Vector3(y, y));
    return res;
  }

  return Math.max(x, y);
}
function min(x, y) {
  if (x.isVector3) {
    let res = new Vector3(x.x, x.y, x.z);
    res.min(new Vector3(y, y, y));
    return res;
  }

  if (x.isVector2) {
    let res = new Vector2(x.x, x.y);
    res.min(new Vector3(y, y));
    return res;
  }
  return Math.min(x, y);
}
function pxy(p) {
  p.xy = new Vector2(p.x, p.y);
  p.yx = new Vector2(p.y, p.x);

  p.xz = new Vector2(p.x, p.z);
  p.zx = new Vector2(p.z, p.x);

  p.zy = new Vector2(p.z, p.y);
  p.yz = new Vector2(p.y, p.z);

}
const PI = Math.PI;
const TAU = 2. * Math.PI;

function smin(a, b, k) {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

function smin_out(d1, d2, k) {
  let h = clamp(0.5 - 0.5 * (d2 + d1) / k, 0.0, 1.0);
  return mix(d2, -d1, h) + k * h * (1.0 - h);
}
export {
  abs, sign, sin, cos, atan, sqrt, floor, vec3, vec2, clamp, length, dot, dot2, cross,
  mod, vec3s, vec3m, rotz, max, min, pxy, mix, smin, smin_out, PI, TAU, vec3a
}