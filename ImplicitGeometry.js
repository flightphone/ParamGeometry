import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";

import { NormalUtils } from "./NormalUtils";
function createKey(i, j, k) {
    return (i.toString() + '_' + j.toString() + '_' + k.toString());
}
class ImplicitGeometry extends BufferGeometry {

    constructor(fun = (x, y, z) => {

    }, xmin = -1, xmax = 1, ymin = -1, ymax = 1, zmin = -1, zmax = 1, nseg = 30) {

        super();
        this.type = 'FunctionGeometry';

        this.parameters = {
            fun: fun,
            xmin: xmin,
            xmax: xmax,
            ymin: ymin,
            ymax: ymax,
            zmin: zmin,
            zmax: zmax,
            nseg: nseg
        };
        let xh = (xmax - xmin) / (nseg - 1), yh = (ymax - ymin) / (nseg - 1),
            zh = (zmax - zmin) / (nseg - 1);

        const indices = [];
        const vertices = [];
        const normals = [];
        //const uvs = [];
        const verts = [];
        const nors = [];
        //const mark = [];
        let nvert = 0;
        //const graph = new Map();

        for (let i = 0; i < nseg; i++)
            for (let j = 0; j < nseg; j++)
                for (let k = 0; k < nseg; k++) {
                    let x = xmin + i * xh, y = ymin + j * yh, z = zmin + k * zh;
                    let nplus = 0, nminus = 0;
                    for (let i2 = 0; i2 < 2; i2++)
                        for (let j2 = 0; j2 < 2; j2++)
                            for (let k2 = 0; k2 < 2; k2++) {
                                let x2 = x + i2 * xh, y2 = y + j2 * yh, z2 = z + k2 * zh;
                                if (fun(x2, y2, z2) >= 0)
                                    nplus += 1;
                                else
                                    nminus += 1;
                            }
                    if (nplus * nminus > 0) {
                        let x2 = x + xh / 2, y2 = y + yh / 2, z2 = z + zh / 2;
                        let po = NormalUtils.surfacepoint(fun, x2, y2, z2);
                        let nor = NormalUtils.implicit_norm(fun, po.x, po.y, po.z);
                        if (po.x >= xmin && po.x <= xmax && po.y >= ymin && po.y <= ymax && po.z >= zmin && po.z <= zmax) {
                            vertices.push(po.x, po.y, po.z);
                            normals.push(nor.x, nor.y, nor.z);
                            nors.push(nor);
                            verts.push(po);
                        }

                    }

                }

        //


        //triangulation
        nvert = verts.length;

        for (let a = 0; a < verts.length; a++) {
            let nor = nors[a];
            let va = verts[a];
            let t1 = new Vector3(nor.y, -nor.x, 0);
            if (!(Math.abs(nor.x) > 0.5 || Math.abs(nor.y) > 0.5))
                t1 = new Vector3(-nor.z, 0, nor.x);
            t1.normalize();
            let t2 = new Vector3(0, 0, 0);
            t2.crossVectors(nor, t1);

            for (let i = 0; i < 4; i++) {
                let tmp = new Vector3(-t1.x, -t1.y, -t1.z);
                t1 = new Vector3(t2.x, t2.y, t2.z);
                t2 = new Vector3(tmp.x, tmp.y, tmp.z);
                let b = nvert, c = nvert + 1, d = nvert + 2;
                nvert += 3;
                let vb = new Vector3(va.x + t1.x * xh, va.y + t1.y * xh, va.z + t1.z * xh);
                let vc = new Vector3(vb.x - t2.x * xh, vb.y - t2.y * xh, vb.z - t2.z * xh);
                let vd = new Vector3(vc.x - t1.x * xh, vc.y - t1.y * xh, vc.z - t1.z * xh);



                vb = NormalUtils.surfacepoint(fun, vb.x, vb.y, vb.z);
                vc = NormalUtils.surfacepoint(fun, vc.x, vc.y, vc.z);
                vd = NormalUtils.surfacepoint(fun, vd.x, vd.y, vd.z);

                let nb = NormalUtils.implicit_norm(fun, vb.x, vb.y, vb.z);
                let nc = NormalUtils.implicit_norm(fun, vc.x, vc.y, vc.z);
                let nd = NormalUtils.implicit_norm(fun, vd.x, vd.y, vd.z);


                vertices.push(vb.x, vb.y, vb.z);
                vertices.push(vc.x, vc.y, vc.z);
                vertices.push(vd.x, vd.y, vd.z);

                normals.push(nb.x, nb.y, nb.z);
                normals.push(nc.x, nc.y, nc.z);
                normals.push(nd.x, nd.y, nd.z);





                indices.push(a, c, b);
                indices.push(a, d, c);
            }

        }



        //console.log(indices);    
        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        //this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));



    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }


}

export { ImplicitGeometry };