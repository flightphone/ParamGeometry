import { Vector2, Vector3 } from "three";

function sphere(u = 0, v = 0, a = 0, c = new Vector3(0, 0, 0)) {
    const norm = new Vector3(Math.sin(v) * Math.cos(u), Math.sin(v) * Math.sin(u), Math.cos(v));
    norm.multiplyScalar(a);
    norm.add(c);
    return norm;
}
function bezier(t, P0, P1, P2, P3) {
    let u = 1. - t;
    let p0 = new Vector2(P0.x, P0.y);
    let p1 = new Vector2(P1.x, P1.y);
    let p2 = new Vector2(P2.x, P2.y);
    let p3 = new Vector2(P3.x, P3.y);
    p0.multiplyScalar(u * u * u);
    p1.multiplyScalar(3 * t * u * u);
    p2.multiplyScalar(3 * t * t * u);
    p3.multiplyScalar(t * t * t);
    p0.add(p1);
    p0.add(p2);
    p0.add(p3)
    return p0;
}

function bezier3(t, u, P0, P1, P2, P3) {
    let b = bezier(t, P0, P1, P2, P3);
    let z = b.x, x = b.y * Math.cos(u), y = b.y * Math.sin(u);
    return new Vector3(x, y, z);
}



class MathCurve {
    static heart(x, y, z)
    //https://mathworld.wolfram.com/HeartSurface.html
    {
        let a = (x*x + 2.25*y*y + z*z - 1);
        return a*a*a - (x*x + 0.1125*y*y)*z*z*z;
    }
    static algebraic(x, y, z)
    {
        x*=x; y*=y; z*=z;
        let a = 0.9*0.9, r = 0.01;
        return ((x + y - a)*(x + y - a) + (z - 1)*(z - 1)) *
                ((z + y - a)*(z + y - a) + (x - 1)*(x - 1)) *
                ((x + z - a)*(x + z - a) + (y - 1)*(y - 1)) - r;

    }
    static desimp(x, y, z)
    {
        return (x*x + y*y + z*z + Math.sin(4*x) + Math.sin(4*y) + Math.sin(4*z) - 1.11);
    }
    static sinewave(t) {
        let a = 5.0, b = 2.5, m = 3.5, n = 9.;
        t = t;
        return new Vector3(a * Math.cos(t), a * Math.sin(t), b * Math.sin(n / m * t));
    }
    static mobius3d(u, t) {
        //https://github.com/mrdoob/three.js/blob/master/examples/jsm/geometries/ParametricGeometries.js
        // volumetric mobius strip

        u *= Math.PI;
        t *= 2 * Math.PI;

        u = u * 2;
        const phi = u / 2;
        const major = 2.25, a = 0.125, b = 0.65;

        let x = a * Math.cos(t) * Math.cos(phi) - b * Math.sin(t) * Math.sin(phi);
        const z = a * Math.cos(t) * Math.sin(phi) + b * Math.sin(t) * Math.cos(phi);
        const y = (major + x) * Math.sin(u);
        x = (major + x) * Math.cos(u);

        return new Vector3(x, y, z);

    }
    static cassinian(x, y, z) {
        let res = 1, b = 4.15, r = 5;
        let v = new Vector3(x, y, z);
        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 2; j++)
                for (let k = 0; k < 2; k++)
                    res *= v.distanceTo(new Vector3(r * (i - 0.5), r * (j - 0.5), r * (k - 0.5)));

        return res - b * b * b * b * r * r * r * r;
    }
    static klein(x, y, z) {
        let a = (x * x + y * y + z * z - 2 * y - 1)
        return (a + 4 * y) * (a * a - 8 * z * z) + 16 * x * z * a;
    }
    static sinei(x, y, z)
    {
        let a = 1.0;
        //return 4.0 * x*x*y*y*z*z + a*a*(x-y-z)*(x+y-z)*(x-y+z)*(x-y+z)*(x+y+z)
        return x*x + y*y*y + z*z*z*z*z - 1
    }

    static chair(x, y, z)
    {
        //https://mathworld.wolfram.com/ChairSurface.html
    }
    static cylinder(x, y, z) {
        function cy(x, y, z, r) {

            return (x * x + y * y - r * r);
        }
        let r1 = 0.5, r2 = 0.48, r3 = 0.7
        let f1 = cy(x, y, z, r1) * cy(x, z, y, r1) * cy(y, z, x, r1) - 0.05;
        //let f2 =  cy(x, y, z, r2) * cy(x, z, y, r2) * cy(y, z, x, r2);
        return f1
        //return cy(x, y, z)
    }
    static smooth(u, h) {
        let v = 0;
        let val = new Vector3(0, 0, 0);
        let h1 = 0.8, h2 = 1.6;
        //h = Math.max(h1, h);
        //h = Math.min(h2, h);



        if (h > 1) {
            v = (h - 1) * Math.PI;
            val = sphere(u, v, 1.5, new Vector3(0., 0., -3.));
        }
        else {
            v = h * Math.PI;
            val = sphere(u, v, 2., new Vector3(0., 0., 1.5));
        }




        if (h >= h1 && h <= h2) {
            v = h1 * Math.PI;
            val = sphere(0., v, 2., new Vector3(0., 0., 1.5));
            let P0 = new Vector2(val.z, val.x);
            v += Math.PI / 2;
            let P1 = new Vector2(P0.x + Math.cos(v), P0.y + Math.sin(v));
            v = (h2 - 1.) * Math.PI;
            val = sphere(0., v, 1.5, new Vector3(0., 0., -3.));
            let P3 = new Vector2(val.z, val.x);
            v -= Math.PI / 2.;
            let P2 = new Vector2(P3.x + Math.cos(v), P3.y + Math.sin(v));
            let t = (h - h1) / (h2 - h1);
            val = bezier3(t, u, P0, P1, P2, P3);

        }
        return val;
    }
    static kummer(x, y, z) {
        let a = 1, m = 1, l = 1, s2 = Math.sqrt(2);
        let f = x * x + y * y + z * z - m * a * a, p = z - a + x * s2,
            q = z - a - x * s2, r = z + a + y * s2, s = z + a - y * s2;
        return f - l * p * q * r * s;

    }

    static kummerj(x, y, z) {

        let res = x * x * x * x + y * y * y * y + z * z * z * z - 5 * (x * x * y * y + y * y * z * z + z * z * x * x) + 56 * x * y * z -
            20 * (x * x + y * y + z * z) + 16;
        return res;

    }
    static hyperboloid(u, v) {
        let a = 1, b = 1, c = 2;
        let x = a * (Math.cos(u) - v * Math.sin(u)), y = b * (Math.sin(u) + v * Math.cos(u)),
            z = -c * v;
        return new Vector3(x, y, z);

    }
    static sch(x, y, z) {
        return -(Math.cos(x) + Math.cos(y) + Math.cos(z));
    }
    static astroidal_ellipsoid(u, v) {
        //https://mathcurve.com/surfaces.gb/astroidal/astroidal.shtml
        let a = 5, cu = Math.cos(u), cv = Math.cos(v), su = Math.sin(u), sv = Math.sin(v);
        let x = a * cu * cu * cu * cv * cv * cv, y = a * su * su * su * cv * cv * cv, z = a * sv * sv * sv;
        return new Vector3(x, y, z);

    }
    static cubic(x, y, z) {
        let a = 1;
        //let v = new Vector3(x, y, z);
        return x * (x * x - 3 * y * y) - z * (z * z - a * a);
    }
}

export { MathCurve };

