import { Vector3, Matrix3 } from "three";

class NormalUtils {
    static curve_norm(curve, t) {
        let h = 0.05;
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
        let h = 0.05;
        let vt = curve(t);
        let vth = curve(t + h);
        let r1 = new Vector3(vth.x - vt.x, vth.y - vt.y, vth.z - vt.z);
        r1.normalize();
        let mt = NormalUtils.getAxis(r1);
        return mt;
    }

    static surf_normal(surf, u, v) {
        let h = 0.01;
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