import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";
import { NormalUtils } from "./NormalUtils";
class CurveHeightGeometry extends BufferGeometry {

    constructor(curve = (t) => { }, tmin = 0, tmax = 1, radius = 0.2, tseg = 200, rseg = 40, repeat = 1, height = 2) {

        super();
        this.type = 'CurveHeightGeometry';

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
                    let fi = Math.PI * j / (rseg - 1) + lv*Math.PI;
                    


                    let nor = new Vector3(Math.cos(fi), Math.sin(fi), 0);
                    let mt = NormalUtils.curve_norm2(curve, t);
                    nor.applyMatrix3(mt);
                    let val = curve(t);
                    val.setZ(lv * height);

                    normals.push(nor.x, nor.y, nor.z);
                    nor.multiplyScalar(radius);
                    val.add(nor);
                    vertices.push(val.x, val.y, val.z);


                    let leny = -fi * radius + lv*(height + 2*Math.PI*radius);
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
        for (let iside = 0; iside < 2; iside++) {
            for (let j = 0; j < tseg - 1; j++) {
                let a = startvertex + j;
                let b = startvertex + j + 1;
                let c = startvertex + tseg + j + 1;
                let d = startvertex + tseg + j;
                if (iside == 0) {
                    indices.push(a, b, c);
                    indices.push(a, c, d);
                }
                else {
                    indices.push(a, c, b);
                    indices.push(a, d, c);
                }

            }
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < tseg; j++) {
                    let val = sidevert[iside][i * tseg + j];
                    let nor = sidenorm[iside][i * tseg + j];
                    vertices.push(val.x, val.y, val.z);
                    normals.push(nor.x, nor.y, nor.z);
                    let u = sideuvs[j];
                    if (iside == 0) {
                        let v = i * height;
                        uvs.push(u, v);
                    }
                    else {
                        let v = 2*height + Math.PI * radius - i*height;
                        uvs.push(u, v);

                    }

                }
            }
            startvertex += 2 * tseg;
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

export { CurveHeightGeometry };