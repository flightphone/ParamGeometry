import { Vector3} from "three";


class MathCurve {
    static kummer(x, y, z)
    {
        let a = 1, m = 1, l = 1, s2 = Math.sqrt(2);
        let f = x*x + y*y + z*z - m*a*a, p = z - a + x*s2,
        q = z - a - x*s2, r = z + a + y*s2, s = z + a - y*s2;
        return f - l*p*q*r*s;
        
    }

    static kummerj(x, y, z)
    {
        
        let res =  x*x*x*x + y*y*y*y + z*z*z*z - 5* (x*x*y*y + y*y*z*z + z*z*x*x) +56 *x*y*z -
        20 * (x*x + y*y + z*z) + 16 ;
        return res;
        
    }
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

