import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";

import { NormalUtils } from "./NormalUtils";

class SurfGeometry extends BufferGeometry {

    constructor(surf = (u, v) => { }, umin = 0, umax = 1, vmin = 0, vmax = 1, useg = 100, vseg = 100, repeat = 1) {

        super();
        this.type = 'SurfGeometry';

        this.parameters = {
            surf: surf,
            umin: umin,
            umax: umax,
            vmin: vmin,
            vmax: vmax,
            useg: useg,
            vseg: vseg,
            repeat: repeat
        };


        //
        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];


        for (let i = 0; i < useg - 1; i++)
            for (let j = 0; j < vseg - 1; j++) {
                let a = i * vseg + j;
                let b = i * vseg + j + 1;
                let c = (i + 1) * vseg + j + 1;
                let d = (i + 1) * vseg + j;
                indices.push(a, b, c);
                indices.push(a, c, d);
                
            }


        for (let i = 0; i < useg; i++)
            for (let j = 0; j < vseg; j++) {
                let u = umin + (umax - umin) * i / (useg - 1);
                let v = vmin + (vmax - vmin) * j / (vseg - 1);

                let val = surf(u, v);
                let nor = NormalUtils.surf_normal(surf, u, v);

                normals.push(nor.x, nor.y, nor.z);
                vertices.push(val.x, val.y, val.z);
                uvs.push(repeat * i / (useg - 1), 1. - j / (vseg - 1))
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

export { SurfGeometry };