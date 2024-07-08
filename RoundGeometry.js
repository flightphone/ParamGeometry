/*
/07/2024
Efim Manevich
*/
import { BufferGeometry, Float32BufferAttribute, Vector3, Vector2, ShapeUtils } from "three";

const makeGeometry = (
    {
        vertices/*an object with vertices*/ = {},
        radius/*radius of rounding*/ = 6,
        segments/*number of segments of rounding*/ = 3,
        size/*panel thickness*/ = 38
    }
) => {
    let scale = 1000;
    let points = [];
    for (let key in vertices) {
        let p = {}; 
        Object.assign(p, vertices[key]);
        p.x = p.x / scale;
        p.y = p.y / scale;
        points.push(p);
    }
    console.log(points);
    let geometry = new RoundGeometry(points, (size - 2 * radius) / scale, radius / scale, segments);
    return geometry;
}

class RoundGeometry extends BufferGeometry {

    constructor(points = [], height = 0.038, radius = 0.006, segments = 3) {

        super();
        this.type = 'RoundGeometry';

        this.parameters = {
            points: points,
            height: height,
            radius: radius,
            segments: segments
        };

        let minx = 10000;
        let miny = 10000;
        points.forEach(p => {
            minx = Math.min(minx, p.x);
            miny = Math.min(miny, p.y);
        });

        //
        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];
        const lengs = [0];
        let currentLen = 0;
        const n = points.length;

        const vects = [];
        const norms = [];
        const shapeup = [];
        //const shapeup_ix = [];
        const shapelow = [];
        //const shapelow_ix = [];

        let startvertex = 0;
        for (let i = 0; i < n; i++) {
            let j = (i + 1) % n;
            let vec = new Vector3(points[j].x - points[i].x, points[j].y - points[i].y, 0);
            let vecl = vec.length();
            let nor = new Vector3(0, 0, 1)
            nor.cross(vec);
            nor.normalize();
            vects.push(vec);
            norms.push(nor);
            for (let k = 0; k < 4; k++) {
                normals.push(nor.x, nor.y, nor.z);
            }
            vertices.push(points[i].x, points[i].y, height);
            vertices.push(points[j].x, points[j].y, height);
            vertices.push(points[j].x, points[j].y, 0);
            vertices.push(points[i].x, points[i].y, 0);
            uvs.push(currentLen, -height);
            uvs.push(currentLen + vecl, -height);
            uvs.push(currentLen + vecl, 0);
            uvs.push(currentLen, 0);
            currentLen += vecl;
            lengs.push(currentLen);

            let a = startvertex;
            let b = startvertex + 1;
            let c = startvertex + 2;
            let d = startvertex + 3;
            startvertex += 4;

            //indices.push(a, b, d);
            //indices.push(b, c, d);

            indices.push(a, b, c);
            indices.push(a, c, d);
        }


        for (let i = 0; i < n; i++) {
            let a, b, c, d;
            for (let lv = 0; lv < 2; lv++) {
                if (lv == 1) {
                    c = i * 4 + 1;
                    d = i * 4;
                }
                else {
                    a = i * 4 + 2;
                    b = i * 4 + 3;
                }

                for (let s = 0; s < segments; s++) {

                    let nor = getRoundNormal(i, s, lv);
                    for (let k = 0; k < 2; k++) {
                        normals.push(nor.x, nor.y, nor.z);
                    }

                    let p1 = getRound(i, s, lv);
                    let j = (i + n - 1) % n;
                    let p2 = getRound(j, s, lv);
                    let p = getRoundIntersect(p1, p2, vects[i], vects[j]);
                    vertices.push(p.x, p.y, p.z);
                    uvs.push(lengs[i] + shiftUV(p, i, i), -p.z);
                    if (s == segments - 1) {
                        if (lv == 1) {
                            shapeup.push(p);
                            //shapeup_ix.push(startvertex)
                        }
                        else {
                            shapelow.push(p);
                            //shapelow_ix.push(startvertex)
                        }
                    }

                    j = (i + 1) % n;
                    p2 = getRound(j, s, lv);
                    p = getRoundIntersect(p1, p2, vects[i], vects[j]);
                    vertices.push(p.x, p.y, p.z);
                    uvs.push(lengs[i + 1] + shiftUV(p, j, i), -p.z);

                    if (lv == 0) {
                        c = startvertex;
                        d = startvertex + 1;
                        indices.push(d, b, a);
                        indices.push(d, c, b);
                        a = d;
                        b = c;
                    }
                    else {
                        a = startvertex;
                        b = startvertex + 1;
                        //indices.push(a, b, d);
                        //indices.push(b, c, d);
                        indices.push(a, b, c);
                        indices.push(a, c, d);
                        d = a;
                        c = b;
                    }
                    startvertex += 2
                }
            }
        }

        for (let i = 0; i < shapeup.length; i++) {
            vertices.push(shapeup[i].x, shapeup[i].y, shapeup[i].z);
            normals.push(0, 0, 1);
            uvc(shapeup[i]);
        }
        let faces_up = ShapeUtils.triangulateShape(shapeup, [])
        faces_up.forEach((f) => {
            let a = f[0] + startvertex;
            let b = f[1] + startvertex;
            let c = f[2] + startvertex;
            indices.push(a, b, c);

        })
        startvertex += shapeup.length;

        for (let i = 0; i < shapelow.length; i++) {
            vertices.push(shapelow[i].x, shapelow[i].y, shapelow[i].z);
            normals.push(0, 0, -1);
            uvc(shapelow[i]);
        }
        let faces_low = ShapeUtils.triangulateShape(shapelow, [])
        faces_low.forEach((f) => {
            let a = f[0] + startvertex; //shapelow_ix[f[0]]
            let b = f[1] + startvertex;
            let c = f[2] + startvertex;
            indices.push(a, c, b);

        })
        startvertex += shapeup.length;


        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

        function uvc(p) {
            let ux = (p.x - minx);
            let uy = (p.y - miny);
            uvs.push(ux, uy);
        }
        function shiftUV(p, i, iv) {
            let dp = new Vector2(p.x - points[i].x, p.y - points[i].y)
            let v = new Vector2(vects[iv].x, vects[iv].y);
            v.normalize();
            return dp.dot(v);
        }
        function getRoundIntersect(p1, p2, v1, v2) {

            let vec1 = new Vector3(v1.x, v1.y, v1.z);
            let vec2 = new Vector3(v2.x, v2.y, v2.z);
            if (p1.x == p2.x && p1.y == p2.y)
                return p2;
            let d = new Vector3(p2.x - p1.x, p2.y - p1.y, 0);
            vec1.normalize();
            vec1.multiplyScalar(d.dot(vec1));
            d.multiplyScalar(-1);
            d.add(vec1);
            vec2.normalize();
            let dt = d.dot(vec2);
            if (!dt)
                return p2;

            vec2.multiplyScalar(d.dot(d) / dt);
            if (vec2)
                p2.add(vec2);
            return p2;
        }
        function getRoundNormal(i, s, level = 1) {
            let round = (level == 1) ? points[i].upper_edge_rounded : points[i].lower_edge_rounded;
            let g = (s + 1) / segments * Math.PI / 2;
            let az = new Vector3(0, 0, 1 - (2 * ((level + 1) % 2)));
            az.multiplyScalar(Math.sin(g));
            let ax = new Vector3(norms[i].x, norms[i].y, norms[i].z);
            ax.multiplyScalar(Math.cos(g));
            if (round)
                az.add(ax);
            else
                az = norms[i]
            return az;
        }

        function getRound(i, s, level = 1) {
            let h = height * level;
            let v1 = new Vector3(points[i].x, points[i].y, h);
            let round = (level == 1) ? points[i].upper_edge_rounded : points[i].lower_edge_rounded;
            let az = new Vector3(0, 0, 1 - (2 * ((level + 1) % 2)));
            let g = (s + 1) / segments * Math.PI / 2.;
            az.multiplyScalar(Math.sin(g));
            let ax = new Vector3(norms[i].x, norms[i].y, norms[i].z);
            ax.multiplyScalar(Math.cos(g));

            if (round) {
                az.add(ax);
                let nr = new Vector3(norms[i].x, norms[i].y, norms[i].z);
                nr.multiplyScalar(-radius);
                v1.add(nr);
            }

            az.multiplyScalar(radius)
            v1.add(az);
            return v1;
        }
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }


    static fromJSON(data) {
        return new RoundGeometry(data.points, data.height, data.radius, data.segments);
    }


}

export { RoundGeometry, makeGeometry };