import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";
import { NormalUtils } from "./NormalUtils";
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
                    mt = NormalUtils.curve_norm2(curve, t);
                else    
                    mt = NormalUtils.curve_norm(curve, t);
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