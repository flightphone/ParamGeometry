import { BufferGeometry, Float32BufferAttribute, Vector3, ShapeUtils } from "three";
import { NormalUtils } from "./NormalUtils";
class CurveCloseGeometry extends BufferGeometry {

    constructor(curve = (t) => { }, tmin = 0, tmax = 1, radius = 0.2, tseg = 200, rseg = 40, repeat = 1, height = 2) {

        super();
        this.type = 'CurveCloseGeometry';

        this.parameters = {
            curve: curve,
            tmin: tmin,
            tmax: tmax,
            radius: radius,
            tseg: tseg,
            rseg: rseg,
            repeat: repeat,
            height: height
        };


        //
        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];
        const nn = tseg * rseg;

        const sidevert1 = [];
        const sidenorm1 = [];
        const sidevert2 = [];
        const sidenorm2 = [];
        const sidevert = [sidevert1, sidevert2];
        const sidenorm = [sidenorm1, sidenorm2];
        const sideuvs = [];





        for (let lv = 0; lv < 2; lv++) {
            for (let i = 0; i < tseg - 1; i++) {
                for (let j = 0; j < rseg - 1; j++) {
                    let a = lv * nn + i * rseg + j;
                    let b = lv * nn + i * rseg + j + 1;
                    let c = lv * nn + (i + 1) * rseg + j + 1;
                    let d = lv * nn + (i + 1) * rseg + j;
                    indices.push(a, b, c);
                    indices.push(a, c, d);
                }
            }

        }

        for (let lv = 0; lv < 2; lv++) {
            for (let i = 0; i < tseg; i++) {
                if (lv == 0)
                    sideuvs.push(repeat * i / (tseg - 1));
                for (let j = 0; j < rseg; j++) {
                    let t = tmin + (tmax - tmin) * i / (tseg - 1);
                    let fi = Math.PI * j / (rseg - 1) / 2. + lv * Math.PI * 1.5;


                    let nor = new Vector3(Math.cos(fi), Math.sin(fi), 0);
                    let mt = NormalUtils.curve_norm2(curve, t);
                    nor.applyMatrix3(mt);
                    let val = curve(t);
                    val.setZ(lv * height);

                    normals.push(nor.x, nor.y, nor.z);
                    nor.multiplyScalar(radius);
                    val.add(nor);
                    vertices.push(val.x, val.y, val.z);


                    let leny = -fi * radius + lv * (height + 2 * Math.PI * radius);
                    uvs.push(repeat * i / (tseg - 1), leny)

                    let iside = -1;
                    if (j == 0) {
                        iside = lv;
                    }
                    if (j == rseg - 1) {
                        iside = (lv + 1) % 2;
                    }
                    if (iside > -1) {
                        sidevert[iside].push(val);
                        sidenorm[iside].push(nor);
                    }


                }
            }
        }
        //side

        let startvertex = 2 * tseg * rseg;

        for (let j = 0; j < tseg - 1; j++) {
            let a = startvertex + j;
            let b = startvertex + j + 1;
            let c = startvertex + tseg + j + 1;
            let d = startvertex + tseg + j;
            indices.push(a, b, c);
            indices.push(a, c, d);
        }

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < tseg; j++) {
                let val = sidevert1[i * tseg + j];
                let nor = sidenorm1[i * tseg + j];
                vertices.push(val.x, val.y, val.z);
                normals.push(nor.x, nor.y, nor.z);
                let u = sideuvs[j];
                let v = i * height;
                uvs.push(u, v);
            }

        }
        startvertex += 2 * tseg;
        
        
        //bottom and top    
        for (let i = 0; i < 2; i++) {
            let shapeup = []
            for (let j = 0; j < tseg; j++) {
                
                let val = sidevert2[i * tseg + j];
                let nor = sidenorm2[i * tseg + j];
                shapeup.push(val);
                vertices.push(val.x, val.y, val.z);
                normals.push(nor.x, nor.y, nor.z);
                uvs.push(val.x, -val.y);
            }
            let faces_up = ShapeUtils.triangulateShape(shapeup, [])
            faces_up.forEach((f) => {
                let a = f[0] + startvertex;
                let b = f[1] + startvertex;
                let c = f[2] + startvertex;
                if (i == 0)
                    indices.push(a, c, b);
                else    
                    indices.push(a, b, c);

            })
            startvertex += tseg;
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

export { CurveCloseGeometry };