import { Vector3, Matrix3 } from "three";
const h = 0.001;
const eps = 0.001;
class NormalUtils {

    static surfacepoint(fun, x, y, z) {
        for (let i = 0; i < 100; i++) {
            let dx = (fun(x + h, y, z) - fun(x - h, y, z)) / 2 / h;
            let dy = (fun(x, y + h, z) - fun(x, y - h, z)) / 2 / h;
            let dz = (fun(x, y, z + h) - fun(x, y, z - h)) / 2 / h;
            let g = new Vector3(dx, dy, dz);
            let l = g.length();
            g.multiplyScalar(fun(x, y, z));
            g.multiplyScalar((1 / l / l));
            let d = g.length();
            if (d > eps)
            {
                x = x - g.x;
                y = y - g.y;
                z = z - g.z; 
            }
            else
              break;  
        }
        return new Vector3(x, y, z);
    }


    static implicit_norm(fun, x, y, z) {
        let dx = (fun(x + h, y, z) - fun(x - h, y, z));
        let dy = (fun(x, y + h, z) - fun(x, y - h, z));
        let dz = (fun(x, y, z + h) - fun(x, y, z - h));
        let nor = new Vector3(dx, dy, dz);
        nor.normalize();
        return nor;
    }
    static func_norm(fun, x, y) {
        let dx = (fun(x + h, y) - fun(x, y)) / h;
        let dy = (fun(x, y + h) - fun(x, y)) / h;
        let nor = new Vector3(-dx, -dy, 1);
        nor.normalize();
        return nor;
    }


    static partial_derivate(fun, x, y, z, axis) {
        //let h = 0.05;
        let dx = (axis == 1) * h, dy = (axis == 2) * h, dz = (axis == 3) * h;
        let d = (fun(x + dx, y + dy, z + dz) - fun(x, y, z)) / h;
        return d;
    }
    static curve_norm(curve, t) {
        //let h = 0.05;
        let vt = curve(t);
        let vth = curve(t + h);
        let r1 = new Vector3(0, 0, 0);
        r1.subVectors(vth, vt);
        r1.normalize();
        let z = r1;


        let r2 = curve(t + 2 * h);
        r2.sub(vth);
        r2.sub(vth);
        r2.add(vt);
        r2.normalize();

        let x = new Vector3(0, 0, 0);
        x.crossVectors(r1, r2);
        x.normalize();

        let y = new Vector3(0, 0, 0);
        y.crossVectors(z, x);
        y.normalize();


        let res = new Matrix3(x.x, y.x, z.x,
            x.y, y.y, z.y,
            x.z, y.z, z.z
        );

        return res;

    }


    static getAxis(a) {
        let z = new Vector3(a.x, a.y, a.z);
        let x = new Vector3(0, 0, 0);
        x.crossVectors(z, new Vector3(0, 0, 1));
        x.normalize();
        let y = new Vector3(0, 0, 0);
        y.crossVectors(z, x);
        let res = new Matrix3(x.x, y.x, z.x,
            x.y, y.y, z.y,
            x.z, y.z, z.z
        );

        return res;
    }
    static curve_norm2(curve, t) {
        //let h = 0.05;
        let vt = curve(t);
        let vth = curve(t + h);
        let r1 = new Vector3(vth.x - vt.x, vth.y - vt.y, vth.z - vt.z);
        r1.normalize();
        let mt = NormalUtils.getAxis(r1);
        return mt;
    }

    static surf_normal(surf, u, v) {
        //let h = 0.01;
        let du = surf(u + h, v);
        du.sub(surf(u - h, v));
        let dv = surf(u, v + h);
        dv.sub(surf(u, v - h));
        let res = new Vector3(0, 0, 0);
        res.crossVectors(du, dv);
        res.normalize()
        return res;
    }

}

export { NormalUtils };