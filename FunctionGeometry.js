import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";

import { NormalUtils } from "./NormalUtils";

class FunctionGeometry extends BufferGeometry {

    constructor(fun = (x, y) => { }, xmin = -1, xmax = 1, ymin = -1, ymax = 1, zmin = -100, zmax = 100, xseg = 100, yseg = 100) {

        super();
        this.type = 'FunctionGeometry';

        this.parameters = {
            fun: fun,
            xmin: xmin,
            xmax: xmax,
            ymin: ymin,
            ymax: ymax,
            xseg: xseg,
            yseg: yseg,
            zmin: zmin,
            zmax: zmax
        };


        //
        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];
        const links = [];
        let nvert = 0;

        for (let i = 0; i < xseg; i++)
            for (let j = 0; j < yseg; j++)
                links.push(-1)

        for (let i = 0; i < xseg; i++)
            for (let j = 0; j < yseg; j++) {
                let x = xmin + (xmax - xmin) * i / (xseg - 1);
                let y = ymin + (ymax - ymin) * j / (yseg - 1);

                let z = fun(x, y);
                if (z > zmin && z < zmax) {
                    let nor = NormalUtils.func_norm(fun, x, y);
                    normals.push(nor.x, nor.y, nor.z);
                    vertices.push(x, y, z);
                    uvs.push(i / (xseg - 1), 1. - j / (yseg - 1))
                    let ix = i * yseg + j;
                    links[ix] = nvert;
                    nvert += 1;
                }

            }

        for (let i = 0; i < xseg - 1; i++)
            for (let j = 0; j < yseg - 1; j++) {
                let a = i * yseg + j;
                let b = i * yseg + j + 1;
                let c = (i + 1) * yseg + j + 1;
                let d = (i + 1) * yseg + j;
                a = links[a];
                b = links[b];
                c = links[c];
                d = links[d];
                if (a > -1 && b > -1 && c > -1)
                    indices.push(a, b, c);
                if (a > -1 && c > -1 && d > -1)
                    indices.push(a, c, d);
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

export { FunctionGeometry };