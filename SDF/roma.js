import { Vector3, Vector2 } from "three";
import { 
    abs, sign, sin, cos, atan, sqrt, floor, vec3, vec2, clamp, length, dot, dot2, cross,
    mod, vec3s, vec3m, rotz, max, min, PI, TAU
} from "../CommonGLSL";
//https://www.shadertoy.com/view/M3lcW8

function getSg(p, nseg) {
    let fi = mod(atan(p.y, p.x) + TAU, TAU);
    fi = mod(fi + PI / nseg, TAU);
    let n = floor(fi / TAU * nseg);
    let r = new Vector3();
    let res = new Vector3(p.x, p.y, p.z);
    res = rotz(res, -n * TAU / nseg);
    return res;
  }
  
  function sdsg(p, x, y) {
    let res = length(vec2(p.x - x, max(abs(p.y) - y, 0.)));
    return res * sign(p.x - x);
  }
  
  function sdQSide(p, r) {
    return sdsg(p, r, r);
  }
  
  function sdQ3Side(p, r, h) {
    let z = p.z - h / 2.;
    let d = sdQSide(p, r);
    let w = vec2(d, abs(z) - h / 2.);
    return min(max(w.x, w.y), 0.0) + length(max(w, 0.0));
  }
  
  function sdPolygonSide(p, r, nseg) {
    let x = r * cos(PI / nseg), y = r * sin(PI / nseg);
    return sdsg(p, x, y);
  }
  
    
  function sdPolygon3Side(p, r, h, nseg) {
    let z = p.z - h / 2.;
    let d = sdPolygonSide(p, r, nseg);
    let w = vec2(d, abs(z) - h / 2.);
    return min(max(w.x, w.y), 0.0) + length(max(w, 0.0));
  }
  
  function level8side(p, r, h, R, H, nseg) {
    let t = sdPolygon3Side(p, R, H, nseg);
    let t2 = length(vec2(p.y, max(p.z - h, 0.))) - r;
    return max(t, -t2);
  }
  
  function level2side(p, R, h, w, H) {
    let t = sdQ3Side(p, w, H);
    let t2 = length(vec2(p.y, max(p.z - h, 0.))) - R;
    return max(t, -t2);
  }
  
  //https://iquilezles.org/articles/distfunctions/
  function udTriangle( p, a, b, c )
  {
    let ba = vec3s(b, a);  let pa = vec3s(p , a);
    let cb = vec3s(c , b);  let pb = vec3s(p , b);
    let ac = vec3s(a , c);  let pc = vec3s(p , c);
    let nor = cross( ba, ac );
  
    
    return sqrt(
      (sign(dot(cross(ba,nor),pa)) +
       sign(dot(cross(cb,nor),pb)) +
       sign(dot(cross(ac,nor),pc))<2.0)
       ?
       min( min(
       dot2(vec3s(vec3m(ba,clamp(dot(ba,pa)/dot2(ba),0.0,1.0)),pa)),
       dot2(vec3s(vec3m(cb,clamp(dot(cb,pb)/dot2(cb),0.0,1.0)),pb))),
       dot2(vec3s(vec3m(ac,clamp(dot(ac,pc)/dot2(ac),0.0,1.0)),pc)))
       :
       dot(nor,pa)*dot(nor,pa)/dot2(nor) );
  }
  
  function udQuad( p,  a,  b,  c,  d )
  {
    let ba = vec3s(b , a); let pa = vec3s(p , a);
    let cb = vec3s(c , b); let pb = vec3s(p , b);
    let dc = vec3s(d , c); let pc = vec3s(p , c);
    let ad = vec3s(a , d); let pd = vec3s(p , d);
    let nor = cross( ba, ad );
  
    return sqrt(
      (sign(dot(cross(ba,nor),pa)) +
       sign(dot(cross(cb,nor),pb)) +
       sign(dot(cross(dc,nor),pc)) +
       sign(dot(cross(ad,nor),pd))<3.0)
       ?
       min( min( min(
       dot2(vec3s(vec3m(ba,clamp(dot(ba,pa)/dot2(ba),0.0,1.0)),pa)),
       dot2(vec3s(vec3m(cb,clamp(dot(cb,pb)/dot2(cb),0.0,1.0)),pb)) ),
       dot2(vec3s(vec3m(dc,clamp(dot(dc,pc)/dot2(dc),0.0,1.0)),pc)) ),
       dot2(vec3s(vec3m(ad,clamp(dot(ad,pd)/dot2(ad),0.0,1.0)),pd)) )
       :
       dot(nor,pa)*dot(nor,pa)/dot2(nor) );
  }
  
  function domeside(p, R, h, nseg)
  {
      let x = R*cos(PI/nseg), y = R*sin(PI/nseg);
      let a = vec3(x, y, 0.);
      let b = vec3(x, -y, 0.);
      let c = vec3(0., 0., h);
      return udTriangle(p, a, b, c);
  }
  
  let roofh = 0.6/(2.39/2.), roofw = (2.39/2. - 0.44)/(2.39/2.);
  function roof(p, R,  r)
  {
      
      let h = roofh, w = roofw;
      let fi = mod(atan(p.y, p.x), TAU), n = floor(fi/(PI/4.)), turn = floor((n + 1.)/2.);
      p = rotz(p, -turn*PI/2.0);
      let a = vec3(0., 0., R*h), b = vec3 (R, 0., R*h), c = vec3(0, 0, 0), d = vec3(0, 0, 0);
      let a1 = vec3(0., 0, 0), b1 = vec3(0., 0, 0), c1 = vec3(0., 0, 0);
      let a2 = vec3(R, -R*w, 0.), b2 = vec3(R, R*w, 0.), c2 = vec3(R, 0., R*h);
      
      if (mod(n, 2.0) == 0.)
      {
          c = vec3(R, R*w, 0.);
          d = vec3(0, R*w, 0.);
          a1 = vec3(R*w, R*w, 0.0); 
          b1 = vec3(R, R*w, 0.); 
          c1 = vec3(R, R, 0.); 
          
      }
      else
      {
          c = vec3(R, -R*w, 0.);
          d = vec3(0, -R*w, 0.);
          a1 = vec3(R*w, -R*w, 0.0); 
          b1 = vec3(R, -R*w, 0.); 
          c1 = vec3(R, -R, 0.); 
         
      }
      let t0 = udQuad(p, a, b, c, d),
            t1 = udTriangle(p, a1, b1, c1),
            t2 = udTriangle(p, a2, b2, c2);
      return min((min(t0, t1) - r), t2);
  }
  
  
  let dome1R = 2.51 / 2. - 0.35, dome0R = 2.51 / 2. - 0.4, t0R = 2.51 / 2. - 0.4, t1R = 2.51 / 2. - 0.05;
  let t2R = (2.51 - 0.6 * 2.) / 2., t2w = 2.51 / 2.;
  
  function map(x, y, z) {
      let p = new Vector3(x, y, z);
      let n1 = 8.;
      let p1 = getSg(p, n1);
      p1.z -= 2.1;
      let d1 = domeside(p1, dome1R, 0.9, n1) - 0.05;
      p1.z += 1.38;
      let d0 = level8side(p1, 0.17, 0.84, dome0R, 1.39, n1);
      p1.z += 0.7;
  
      p.z = p1.z;
      p1 = getSg(p, 4.);
      let t0 = sdQ3Side(p1, t0R, 0.7) - 0.03;
      let t1 = roof(p, t1R, 0.03) - 0.05;
      p1.z += 2.6;
      let t2 = level2side(p1, t2R, 1.7, t2w, 2.6);
      return min(min(min(min(t1, t2), t0), d0), d1);
    }
  
    export {map}