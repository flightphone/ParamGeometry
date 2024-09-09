//Provides a function for performing 3D Marching Cubes
//https://www.boristhebrave.com/2018/04/15/marching-cubes-3d-tutorial/
//https://paulbourke.net/geometry/polygonise/


import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";
import { NormalUtils } from "./NormalUtils";
import * as TR from './trtables';

class ImplicitGeometry extends BufferGeometry {

    constructor(fun = (x, y, z) => {

    }, xmin = -1, xmax = 1, ymin = -1, ymax = 1, zmin = -1, zmax = 1, nseg = 100, newton = 10) {

        super();
        this.type = 'ImplicitGeometry';

        this.parameters = {
            fun: fun,
            xmin: xmin,
            xmax: xmax,
            ymin: ymin,
            ymax: ymax,
            zmin: zmin,
            zmax: zmax,
            nseg: nseg,
            newton: newton
        };
        let xh = (xmax - xmin) / (nseg - 1), yh = (ymax - ymin) / (nseg - 1),
            zh = (zmax - zmin) / (nseg - 1);

        const indices = [];
        const vertices = [];
        const normals = [];
        //const colors = [];
        
        const shifts = [
            [[1, 0, 0], [1, 1, 0], [1, 0, 1], [1, 1, 1]],
            [[0, 1, 0], [1, 1, 0], [0, 1, 1], [1, 1, 1]],
            [[0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]],
        ]
        let nvert = 0;

        const cubes = new Map();

        let fval = [];
        for (let i = 0; i < nseg; i++)
            for (let j = 0; j < nseg; j++)
                fval.push(0);

        for (let k = 0; k < nseg; k++)
            for (let i = 0; i < nseg; i++)
                for (let j = 0; j < nseg; j++) {
                    let x = xmin + i * xh, y = ymin + j * yh, z = zmin + k * zh;
                    let val = fun(x, y, z);
                    let cpoint = new Vector3(x, y, z);


                    if (k > 0) {
                        let val0 = fval[i * nseg + j]
                        if (Math.sign(val0) * Math.sign(val) <= 0) {
                            let po = getPoint(new Vector3(x, y, zmin + (k - 1) * zh), cpoint, val0, val);
                            addPoint(po);
                            addIndex(i, j, k, 2);
                        }
                    }
                    fval[i * nseg + j] = val;
                    if (j > 0) {
                        let val0 = fval[i * nseg + j - 1]
                        if (Math.sign(val0) * Math.sign(val) <= 0) {
                            let po = getPoint(new Vector3(x, ymin + (j - 1) * yh, z), cpoint, val0, val);
                            addPoint(po);
                            addIndex(i, j, k, 1);
                        }
                    }
                    if (i > 0) {
                        let val0 = fval[(i - 1) * nseg + j]
                        if (Math.sign(val0) * Math.sign(val) <= 0) {
                            let po = getPoint(new Vector3(xmin + (i - 1) * xh, y, z), cpoint, val0, val);
                            addPoint(po);
                            addIndex(i, j, k, 0);
                        }
                    }

                }



        //triangulation

        cubes.forEach((value, key) => {
            let faces = TR.cases[getCase(key)];
                faces.forEach((s) => {
                    let a = value.get(s[0]);
                    let b = value.get(s[1]);
                    let c = value.get(s[2]);
                    if (a == null || b == null || c == null)
                       ; //console.log(key)
                    else
                        indices.push(a, c, b);
                });
            
        })

        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        //this.setAttribute('color', new Float32BufferAttribute(colors, 3));

        function getCase(n) {
            let i = Math.floor(n / 1000000);
            n = n - i * 1000000;
            let j = Math.floor(n / 1000);
            let k = n - j * 1000;
            let c = 0;
            for (let t = 0; t < 8; t++) {
                let v_pos = TR.VERTICES[t];
                let x = xmin + (i + v_pos[0]) * xh, y = ymin + (j + v_pos[1]) * yh, z = zmin + (k + v_pos[2]) * zh;
                let val = fun(x, y, z);
                if (val > 0)
                    c += Math.pow(2, t);
            }
            return c;
        }
        function getCubeNum(i, j, k) {
            return (i * 1000000 + j * 1000 + k)
        }
        function getVertexNum(s) {
            let j = s[0] * 4 + s[1] * 2 + s[2];
            return TR.cubevert[j];
        }

        function getEdgeNum(v1, v2) {
            let j = v1 * 8 + v2;
            return TR.EDGESmap.get(j);
        }

        function addIndex(i, j, k, axis) {
            let sh = shifts[axis];
            sh.forEach((s) => {
                let i1 = i - s[0], j1 = j - s[1], k1 = k - s[2];
                if (i1 > -1 && j1 > -1 && k1 > -1) {
                    let ncub = getCubeNum(i1, j1, k1);
                    let egcub = cubes.get(ncub);
                    if (egcub == null) {
                        egcub = new Map();
                        cubes.set(ncub, egcub);
                    }

                    let s0 = [s[0], s[1], s[2]];
                    s0[axis] = 0;
                    let v0 = getVertexNum(s0);
                    let v1 = getVertexNum(s);
                    let edg = getEdgeNum(v0, v1);
                    egcub.set(edg, nvert - 1);
                }
            });

        }
        function addPoint(po = new Vector3) {
            vertices.push(po.x, po.y, po.z);
            let nor = NormalUtils.implicit_norm(fun, po.x, po.y, po.z);
            normals.push(nor.x, nor.y, nor.z);
            //colors.push(Math.abs(nor.x), Math.abs(nor.y), Math.abs(nor.z))
            nvert += 1;
        }
        function getPoint(a1 = new Vector3(), b1 = new Vector3(), v0, v1) {
            let a = new Vector3(a1.x, a1.y, a1.z);
            let b = new Vector3(b1.x, b1.y, b1.z);
            let m = new Vector3();
            //binary find with  n iterations, n = newton
            for (let i = 0; i < newton; i++) {
                m.addVectors(a, b);
                m.multiplyScalar(0.5);
                let v = fun(m.x, m.y, m.z);
                if (v == 0)
                    break;

                if (Math.sign(v) * Math.sign(v0) <= 0) {
                    v1 = v;
                    b = new Vector3(m.x, m.y, m.z);
                }
                else {
                    v0 = v;
                    a = new Vector3(m.x, m.y, m.z);
                }
            }
            return m;
        }
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }
}

export { ImplicitGeometry };