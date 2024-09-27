import { Vector3 } from "three";

let la = 0;
function fract(t)
{
    return t - Math.floor(t);
}

function glz(iTime) {
    iTime /= 1000;
    let t = iTime / 4.;
    let st = Math.floor(t) % 4.;
    if(st == 0.)
        la = 1.;
    if(st == 1.)
        la = Math.cos(fract(t) * Math.PI / 2.);
    if(st == 2.)
        la = 0.;
    if(st == 3.)
        la = Math.sin(fract(t) * Math.PI / 2.); 
    
}
function mixc(t)
{
    if (la == 0)
        return trefoil(t);
    else
    if (la == 1)    
        return eight_knot(t);
    else
        {
            let a = trefoil(t), b = eight_knot(t);
            a.multiplyScalar(1 - la);
            b.multiplyScalar(la);
            a.add(b);
            return a;
        }    
}

function hypotrochoid(t) {
    let R = 7, r = 3, d = 7;
    let x = (R - r) * Math.cos(t) + d * Math.cos((R - r) / r * t);
    let y = (R - r) * Math.sin(t) - d * Math.sin((R - r) / r * t);
    return new Vector3(x, y, 0);
}

function shell(u, v) {
    let a = 3., b = 2.5, m = -0.1, k = 2.5;
    let x = Math.exp(m * u) * Math.cos(u) * (a + b * Math.cos(v));
    let y = Math.exp(m * u) * Math.sin(u) * (a + b * Math.cos(v));
    let z = Math.exp(m * u) * (k * a + b * Math.sin(v));
    let h = k * a + b;
    z -= h / 2.;
    return new Vector3(x, y, z);
}

function sine(u, v) {
    let a = 2.;
    return new Vector3(a * Math.sin(u), a * Math.sin(v), a * Math.sin(u + v));
}

function tennis(t) {
    let a = 2., b = 1., c = 2. * Math.sqrt(a * b), x = a * Math.cos(t) + b * Math.cos(3. * t), y = a * Math.sin(t) - b * Math.sin(3. * t), z = c * Math.sin(2. * t);
    return new Vector3(x, y, z);
}

function circ(t) {
    let a = 2;
    return new Vector3(Math.cos(t) * a, Math.sin(t) * a, 0);
}

function trefoil(t) {
    let a = 1.5;
    let res = new Vector3(Math.sin(t) + 2. * Math.sin(2. * t), Math.cos(t) - 2. * Math.cos(2. * t), -1 * Math.sin(3. * t));
    res.multiplyScalar(a);
    return res;

}

function solenoid(t) {
    let n = 1.5, R = 2., r = 1.;
    return new Vector3((R + r * Math.cos(n * t)) * Math.cos(t), (R + r * Math.cos(n * t)) * Math.sin(t), r * Math.sin(n * t));
}

function liss(t) {
    let a = 3., b = 3., c = 2.5, n = 1.2, m = 2., f = Math.PI / 2., e = .0;
    return new Vector3(a * Math.sin(t), b * Math.sin(n * t + f), c * Math.sin(m * t + e));
}

function liss2(t) {
    let a = 3., b = 3., c = 1.5, n = 1.5, m = 2.5, f = Math.PI / 2., e = .0;
    return new Vector3(a * Math.sin(t), b * Math.sin(n * t + f), c * Math.sin(m * t + e));
}


function rose(t) {
    let a = 4.,
        n = 2.2,
        b = 0.,
        r = a * Math.cos(n * t);
    return new Vector3(r * Math.cos(t), r * Math.sin(t), b * Math.cos(n * t) * Math.cos(n * t));
}

function klein(u, v) {

    let a = 3., b = 4., c = 2., r, x, y, z;
    if (u < Math.PI) {
        r = c * (1. - Math.cos(u) / 2.);
        x = Math.cos(u) * (a * (1. + Math.sin(u)) + r * Math.cos(v));
        y = Math.sin(u) * (b + r * Math.cos(v));
        z = r * Math.sin(v);
    }

    else {
        r = c * (1. - Math.cos(u) / 2.);
        x = Math.cos(u) * a * (1. + Math.sin(u)) - r * Math.cos(v);
        y = Math.sin(u) * b;
        z = r * Math.sin(v);
    }

    return new Vector3(x, y, z);


}

function desmos_spiral(v, u) {
    //https://www.desmos.com/3d/2f58701dc9?lang=ru
    let x = (4 + Math.sin(Math.PI * v) * Math.sin(Math.PI * 2 * u)) * Math.sin(Math.PI * 3 * v);
    let y = Math.sin(Math.PI * v) * Math.cos(Math.PI * 2 * u) + 8 * v - 4;
    let z = (4 + Math.sin(Math.PI * v) * Math.sin(Math.PI * 2 * u)) * Math.cos(Math.PI * 3 * v);
    return new Vector3(x, y, z);
}
function eight_knot(t) {
    let a = 3, b = 2
    return new Vector3((a + b * Math.cos(2 * t)) * Math.cos(3 * t), (a + b * Math.cos(2 * t)) * Math.sin(3 * t), Math.sin(4 * t));
}


function quart(t) {
    let r = 2., n = 4., dn = Math.PI * 2 / n, c = t / dn, a0 = Math.floor(c) * dn,
        a1 = a0 + dn, d = c - Math.floor(c);
    let v1 = new Vector3(Math.cos(a0), Math.sin(a0), 0);
    let v2 = new Vector3(Math.cos(a1), Math.sin(a1), 0);
    v2.sub(v1);
    v2.multiplyScalar(d);
    let res = new Vector3(0, 0, 0);
    res.addVectors(v1, v2);
    res.multiplyScalar(r);
    //vec3 res = r*(v1 + (v2-v1)*d);
    return res;
}

function egg_box(x, y) {
    let a = 0.5, b = 0.25;
    let z = a * (Math.sin(x / b) + Math.sin(y / b));
    return z;
}

function egg_box1(u, v) {
    let a = 0.5, b = 0.25;
    let z = a * (Math.sin(u / b) + Math.sin(v / b));
    return new Vector3(u, v, z);
}

function mebius(v, u) {
    //https://mathcurve.com/surfaces.gb/mobiussurface/mobiussurface.shtml
    let a = 1.5;
    let x = (a + u * Math.cos(v / 2.)) * Math.cos(v);
    let y = (a + u * Math.cos(v / 2.)) * Math.sin(v);
    let z = u * Math.sin(v / 2.);
    return new Vector3(x, y, z);
}

function boys(u, v) {
    let sides = 0.;
    let k = 1.;
    let ka = Math.cos(u) / (Math.sqrt(2.) - k * Math.sin(2. * u) * Math.sin(3. * v)),
        z = ka * 3.0 * Math.cos(u),
        x = ka * (Math.cos(u) * Math.cos(2. * v) + Math.sqrt(2.) * Math.sin(u) * Math.cos(v)),
        y = ka * (Math.cos(u) * Math.sin(2. * v) - Math.sqrt(2.) * Math.sin(u) * Math.sin(v));
    let res = new Vector3(x, y, z);
    //res.z -= sqrt(2.);
    return res;
}


function coil(u, v) {
    let a = 2, b = 0.5, h = -0.18;
    let x = (a + b * Math.cos(v)) * Math.cos(u) + b * h / Math.sqrt(a * a + h * h) * Math.sin(u) * Math.sin(v),
        y = (a + b * Math.cos(v)) * Math.sin(u) + b * h / Math.sqrt(a * a + h * h) * Math.cos(u) * Math.sin(v),
        z = h * u + b * a / Math.sqrt(a * a + h * h) * Math.sin(v);
    return new Vector3(z - 7 * Math.PI * h, x, y);
}

function rcube(x, y, z) {
    //https://mathcurve.com/surfaces.gb/goursat/goursat.shtml
    let a = 1;
    //return (x * x * x * x + y * y * y * y + z * z * z * z - a * a * (x * x + y * y + z * z));
    return x * x * x * x + y * y * y * y + z * z * z * z - x * x - y * y - z * z + 0.4;
}

function goursat(x, y, z) {
    //https://mathcurve.com/surfaces.gb/goursat/goursat.shtml
    let a = 1;
    return (2 * (x * x * y * y + x * x * z * z + z * z * y * y) - a * a * (x * x + y * y + z * z) - a * a * a * a);
}

function gayley(x, y, z) {
    //https://mathcurve.com/surfaces.gb/cayley/cayley.shtml
    let k = 2;
    let a = 1
    return ((x + y + z - a) * (x * y + y * z + z * x) - k * x * y * z);
}


function roman(x, y, z) {
    //https://mathcurve.com/surfaces.gb/romaine/romaine.shtml
    let a = 1;
    return ((x * x * y * y + x * x * z * z + z * z * y * y) - 2 * a * x * y * z);
}

function romanp(v, u) {
    let r = 3;
    let x = r * r * Math.cos(u) * Math.cos(v) * Math.sin(v),
        y = r * r * Math.sin(u) * Math.cos(v) * Math.sin(v),
        z = r * r * Math.cos(u) * Math.sin(u) * Math.cos(v) * Math.cos(v);

        /*
        x += 0.2*(Math.sin(5*x));
        y += 0.1*Math.sin(4*y);
        z += 0.3*Math.sin(3*z);    
        */
    return new Vector3(x, y, z);

}






function riemann(x, y, z) {
    let a = 1;
    let d = (x * x + y * y - a * a) * z - a * x;
    return d;
}

function sphere(x, y, z) {
    let r = 1.1
    return (x * x + y * y + z * z - r*r + 0.06*(Math.sin(35*x)+Math.sin(20*y)+Math.sin(25*z)));
}

function clebsch(x, y, z) {
    let t = 2, k = 3.5;
    let u = x + y + z + t;
    return -(k * (x * x * x + y * y * y + z * z * z + t * t * t) - u * u * u);
}
function cassini(x, y, z) {
    let a = 1;
    return ((x - a) * (x - a) + y * y) * ((x + a) * (x + a) + y * y) - z * z * z * z;
}


function isf(x, y, z) {
   let t = z;
   z = -y;
   y = -t; 
   return (2 * y * (y * y - 3 * x * x) * (1 - z * z) + (x * x + y * y) * (x * x + y * y) - (9 * z * z - 1) * (1 - z * z));// IMPLICIT SURFACE Function
}
function gyroide(x, y, z) {
    let scale = 1.5;
    x *= scale;
    y*=scale;
    z*=scale;
    return Math.cos(x) * Math.sin(y) + Math.cos(y) * Math.sin(z) + Math.cos(z) * Math.sin(x);
}


//https://mathcurve.com/surfaces.gb/Gyroide/gyroide.shtml


function holed2(x, y, z) {
    let x2 = x * x, y2 = y * y, z2 = z * z;
    let u = (x2) * (1 - x2) - y2;
    return u * u + z2 - 0.01;
}


function holed3(x, y, z) {
    let x2 = x * x, y2 = y * y, z2 = z * z;
    let u = (x2 + y2) * (x2 + y2) - x * (x2 - 3 * y2);
    return u * u + z2 - 0.008;
}

function tors(x, y, z) {
    //https://mathcurve.com/surfaces.gb/tore/tn.shtml
    let R2 = 1.0, a2 = 0.04, r = 0.01, x2 = x * x, y2 = y * y, z2 = z * z;
    let u = (x2 + y2 + z2 + R2 - a2);
    let f1 = u*u - 4*R2* (x2+y2);
    let f2 = u*u - 4*R2* (x2+z2);
    let f3 = u*u - 4*R2* (y2+z2);
    return f1*f2*f3 - r;

}

function piriform(x, y, z)
{
    let a = 1, b = 1, r = 0.002;
    let u = x*x*x *(a - x) - b*b*y*y; 
    return u*u + z*z - r;
}


function quadrifolium(x, y, z)
//https://mathcurve.com/courbes2d.gb/trefle/trefle.shtml
{
    let a = 1, r = 0.01;
    let u1 = x*x + y*y;
    let u = u1*u1*u1 - 4* a*a*x*x*y*y;
    return u*u + z*z - r;
}

export {hypotrochoid,shell,sine, tennis, circ, trefoil,solenoid, liss, liss2, 
    rose, klein, desmos_spiral, eight_knot, quart, egg_box, egg_box1, mebius, boys,
coil, rcube, goursat, gayley, roman, romanp, riemann, sphere, clebsch, cassini,
isf, gyroide, holed2, holed3, tors, piriform, quadrifolium,
mixc, glz};
