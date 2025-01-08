import { Vector3, Vector2 } from "three";
import * as roma from "./roma"
import {
  abs, sign, sin, cos, atan, sqrt, floor, vec3, vec2, clamp, length, dot, dot2, cross,
  mod, vec3s, vec3m, vec3a, rotz, max, min, mix, smin, smin_out, PI, TAU
} from "../CommonGLSL";
class SDF {
  static roma(x, y, z) {
    return roma.map(x, y, z);
  }
  static cyls(x, y, z)
  {
    return roma.cylinder2(new Vector3(x, y, z));
  }
  static tube(u, v)
  {
    let h = 6., r = 1.;
    let v1 = vec3(r*cos(u), r*sin(u), 0), 
    v0 = vec3(r*cos(u), 0., -h);
    //let res = (v <= 1.)? vec3a(v0,vec3m(vec3s(v1,v0),(1.-v))): vec3(r*cos(v-1.)*cos(u), r*cos(v-1.)*sin(u), r*sin(v-1.));
    const res = vec3a(v0,vec3m(vec3s(v1,v0),(1.-v)));
    return res;
  }
  static umbrella(u, v)
  {
    let n = 4, r = 1;
    let x0 = Math.floor(v), x = v - x0, x1 = (x0+1) % n;
    let v0 = vec3(r*cos(x0*TAU/n)*cos(u), r*sin(x0*TAU/n)*cos(u), r*sin(u));
    let v1 = vec3(r*cos(x1*TAU/n)*cos(u), r*sin(x1*TAU/n)*cos(u), r*sin(u));
    let res = vec3a(vec3m(vec3s(v1, v0), x), v0);
    return res;
  }
}
export { SDF }