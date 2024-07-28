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
        const uvs = [];
        const verts = [];
        const mark = [];
        let nvert = 0;
        const graph = new Map();

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
                        vertices.push(po.x, po.y, po.z);
                        normals.push(nor.x, nor.y, nor.z);
                        let ver = { i: i, j: j, k: k };
                        let key = createKey(i, j, k);
                        graph.set(key, nvert);
                        verts.push(ver);
                        mark.push(0);
                        nvert += 1;
                    }

                }

        //

        //console.log(graph);          

        for (let a = 0; a < nvert; a++) {
            if (mark[a]==2)
                continue;
            //bfs
            let q = [a]
            let startq = 0;
            while (startq < q.length) {
                let v = q[startq];
                mark[v] = 2;
                startq += 1;
                let vert = verts[v];
                let i = vert.i, j = vert.j, k = vert.k
                const tr = [];
                for (let i2 = -1; i2 < 2; i2++)
                    for (let j2 = -1; j2 < 2; j2++)
                        for (let k2 = -1; k2 < 2; k2++) {
                            let iv = i + i2,
                                jv = j + j2,
                                kv = k + k2;
                            let key = createKey(iv, jv, kv);
                            //console.log(key);
                            let v2 = graph.get(key);
                            if (v2 == undefined)
                                continue;

                            if (mark[v2]==2)
                                continue;
                            if (mark[v2] == 0)  
                            {
                                q.push(v2);
                                mark[v2] = 1
                            }
                            tr.push(v2);
                        }

                //triangulation  
                for (let t=0; t < tr.length-1; t++)      
                {
                    indices.push(tr[t], v, tr[t+1]);
                }
                
                if (tr.length > 2)
                    indices.push(tr[tr.length-1], v, tr[0]);
                    

            }
           
        }


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