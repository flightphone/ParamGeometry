import { BufferGeometry, Float32BufferAttribute, Vector3,  Matrix3 } from "three";


function curve_norm(curve, t) {
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


function getAxis(a) {
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
function curve_norm2(curve, t) {
    let h = 0.05;
    let vt = curve(t);
    let vth = curve(t + h);
    let r1 = new Vector3(vth.x - vt.x, vth.y - vt.y, vth.z - vt.z);
    r1.normalize();
    let mt = getAxis(r1);
    return mt;
}

class CurveGeometry extends BufferGeometry {

    constructor(curve = (t) => { }, tmin = 0, tmax = 1, radius = 0.2, tseg = 200, rseg = 40, repeat = 1, mode = 0) {

        super();
        this.type = 'CurveGeometry';

        this.parameters = {
            curve: curve,
            tmin: tmin,
            tmax: tmax,
            radius: radius,
            tseg: tseg,
            rseg: rseg,
            repeat:repeat,
            mode:mode
        };


        //
        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];


        for (let i = 0; i < tseg - 1; i++)
            for (let j = 0; j < rseg - 1; j++) {
                //let k = (j + 1) % rseg;
                let a = i * rseg + j;
                let b = i * rseg + j + 1;
                let c = (i + 1) * rseg + j + 1;
                let d = (i + 1) * rseg + j;
                indices.push(a, b, c);
                indices.push(a, c, d);
            }


        for (let i = 0; i < tseg; i++)
            for (let j = 0; j < rseg; j++) {
                let t = tmin + (tmax - tmin) * i / (tseg - 1);
                let fi = Math.PI * 2 * j / (rseg - 1);

                let nor = new Vector3(Math.cos(fi), Math.sin(fi), 0);
                let mt;
                if (mode == 2)
                    mt = curve_norm2(curve, t);
                else    
                    mt = curve_norm(curve, t);
                nor.applyMatrix3(mt);
                let val = curve(t);

                normals.push(nor.x, nor.y, nor.z);
                nor.multiplyScalar(radius);
                val.add(nor);
                vertices.push(val.x, val.y, val.z);
                uvs.push(repeat* i / (tseg - 1), 1. - j / (rseg - 1))
            }




        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));


    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }


}

export { CurveGeometry };