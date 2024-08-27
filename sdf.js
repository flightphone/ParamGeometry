/*
float sdBox( vec3 p)
{
  float r = 0.2;
  vec3 b = vec3(0.6, 0.6, 0.6);
  vec3 q = abs(p) - b + r;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
  
}
*/

import { Vector3, Vector2 } from "three";

class SDF {
  /*
    static dode(x, y, z)
    {
      let t=9.,a,l, P = .628;
      let q = new Vector3(x, y, z);
      l = (new Vector2(q.x, q.y)).length();
      a = Math.atan(q.y,q.x);
      if (q.z<0.) 
      {
        a += P; 
        q.z = -q.z; 
      } 
          
          
      if(Math.abs(atan(q.z,l)) < 1.)
      {
             q.xy = l * cos( mod(a,P*2.)-P + vec2(0,33) ),     // 5-fold symmetry
              q.xz *= rot(1.12), q                              // tilt 1.12 = pi/2 - pi/5
            : q = q.yxz,                                        // top-down face
          t = length(q.xy)+.2*q.z-1.; 
          t = min(t, length(q)-2.); 
          t *= 0.4;  
          return t;
    }
*/    
/*
float sdPeaky_dodecahedron (vec3 p)
{
    float t=9.,a,l, P = .628;
    vec3 q;

     q = p, 
        
        l = length(q.xy),a = atan(q.y,q.x), q.z<0. ? a += P, q.z = -q.z :a,// top down symetry +rot pi/5     
        abs(atan(q.z,l)) < 1.
          ? q.xy = l * cos( mod(a,P*2.)-P + vec2(0,33) ),     // 5-fold symmetry
            q.xz *= rot(1.12), q                              // tilt 1.12 = pi/2 - pi/5
          : q = q.yxz,                                        // top-down face
        t = length(q.xy)+.2*q.z-1.; 
        t = min(t, length(q)-2.); 
        t *= 0.4;  
        return t;
}

*/

    static sdBox (x, y, z)
    {
        let r = 0.1, a = 0.6, b = 0.6, c = 0.6;
        let q = new Vector3(
            Math.max((Math.abs(x) - a + r), 0),
            Math.max((Math.abs(y) - b + r), 0),
            Math.max((Math.abs(z) - c + r), 0)
        )
        return q.length() + Math.min(Math.max(q.x,Math.max(q.y,q.z)),0.0) - r;
    }

    static sdVerticalCapsule( x, y, z)
    {
      let h = 0.4,  r = 0.1, c = Math.max(Math.min(y, h), 0);
      y -= c;
      return (new Vector3(x, y, z).length()) - r;
    }
}
export {SDF}