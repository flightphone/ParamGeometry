import { Vector3} from "three";


class MathCurve {
    static hyperboloid(u, v)
    {
        let a = 1, b = 1, c = 2;
        let x = a*(Math.cos(u) - v* Math.sin(u)), y = b*(Math.sin(u) + v*Math.cos(u)),
        z= -c*v;
        return new Vector3(x, y, z);

    }
    static sch(x, y, z)
    {
        return -(Math.cos(x) + Math.cos(y) + Math.cos(z));
    }
    static astroidal_ellipsoid(u, v)
    {
        //https://mathcurve.com/surfaces.gb/astroidal/astroidal.shtml
        let a = 5, cu = Math.cos(u), cv = Math.cos(v), su = Math.sin(u), sv = Math.sin(v);
        let x = a*cu*cu*cu*cv*cv*cv, y = a*su*su*su*cv*cv*cv, z = a*sv*sv*sv;
        return new Vector3(x, y, z);

    }
    static cubic(x, y, z)
    {
        let a = 1;
        //let v = new Vector3(x, y, z);
        return x*(x*x - 3*y*y) - z*(z*z - a*a);
    }
}

export {MathCurve};

