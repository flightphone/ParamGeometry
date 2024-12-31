import * as THREE from 'three';
import * as MCF from './mathcurve.js'
import { MathCurve } from './MathCurve2';
import { NormalUtils } from "./NormalUtils";
import { Balls } from './balls';
import { SDF } from './SDF/sdf';

const x = 0, y = 0;
const fishShape = new THREE.Shape()
    .moveTo(x, y)
    .quadraticCurveTo(x + 5, y - 8, x + 9, y - 1)
    .quadraticCurveTo(x + 10, y - 1, x + 11.5, y - 4)
    .quadraticCurveTo(x + 11.5, y, x + 11.5, y + 4)
    .quadraticCurveTo(x + 10, y + 1, x + 9, y + 1)
    .quadraticCurveTo(x + 5, y + 8, x, y);



let scale = 5;
let kj = 7;
const models = [
    { toString: () => "genus-two(implicit)", mode: "implicit", func: MCF.isf, xmin: -2, xmax: 2, ymin: -2, ymax: 2, zmin: -2, zmax: 2, nseg: 100 },
    { toString: () => "chair(implicit)", mode: "implicit", func: MathCurve.chair, xmin: -2, xmax: 2, ymin: -2, ymax: 2, zmin: -2, zmax: 2, nseg: 100 },
    { toString: () => "barth(implicit)", mode: "implicit", func: MathCurve.barth, xmin: -1.5, xmax: 1.5, ymin: -1.5, ymax: 1.5, zmin: -1.5, zmax: 1.5, nseg: 128 },
    { toString: () => "eight(implicit)", mode: "implicit", func: MathCurve.eight, xmin: -1.5, xmax: 1.5, ymin: -1.5, ymax: 1.5, zmin: -1.5, zmax: 1.5, nseg: 100 },
    { toString: () => "cassinian(implicit)", mode: "implicit", func: MathCurve.cassinian, xmin: -4, xmax: 4, ymin: -4, ymax: 4, zmin: -4, zmax: 4, nseg: 100 },
    { toString: () => "round-cube (implicit)", mode: "implicit", func: MCF.rcube, xmin: -2, xmax: 2, ymin: -2, ymax: 2, zmin: -2, zmax: 2, nseg: 100 },
    { toString: () => "balls (implicit)", mode: "implicit", func: Balls.potential, xmin: -Balls.r, xmax: Balls.r + 1, ymin: -Balls.r - 1, ymax: Balls.r + 1, zmin: -Balls.r - 1, zmax: Balls.r + 1, nseg: 100 },
    { toString: () => "desmos (implicit)", mode: "implicit", func: MathCurve.desimp, xmin: -2, xmax: 2, ymin: -2, ymax: 2, zmin: -2, zmax: 2, nseg: 100 },
    { toString: () => "heart (implicit)", mode: "implicit", func: MathCurve.heart, xmin: -1.5, xmax: 1.5, ymin: -1, ymax: 1, zmin: -1.5, zmax: 1.5, nseg: 100 },
    { toString: () => "piriform(implicit)", mode: "implicit", func: MathCurve.piri, xmin: -2, xmax: 2, ymin: -2, ymax: 2, zmin: -2, zmax: 2, nseg: 100 },
    { toString: () => "roman(implicit)", mode: "implicit", func: MathCurve.roman, xmin: -2, xmax: 2, ymin: -2, ymax: 2, zmin: -2, zmax: 2, nseg: 200 },
    { toString: () => "three-torus (implicit)", mode: "implicit", func: MCF.tors, xmin: -1.5, xmax: 1.5, ymin: -1.5, ymax: 1.5, zmin: -1.5, zmax: 1.5, nseg: 100 },
    { toString: () => "algebraic (implicit)", mode: "implicit", func: MathCurve.algebraic, xmin: -1.2, xmax: 1.2, ymin: -1.2, ymax: 1.2, zmin: -1.2, zmax: 1.2, nseg: 100 },
    { toString: () => "holed2 (implicit)", mode: "implicit", func: MCF.holed2, xmin: -1.2, xmax: 1.2, ymin: -1, ymax: 1, zmin: -1, zmax: 1, nseg: 100 },
    { toString: () => "holed3 (implicit)", mode: "implicit", func: MCF.holed3, xmin: -1.2, xmax: 1.2, ymin: -1, ymax: 1, zmin: -1, zmax: 1, nseg: 100 },
    { toString: () => "holed4 (implicit)", mode: "implicit", func: MCF.quadrifolium, xmin: -1.5, xmax: 1.5, ymin: -1.5, ymax: 1.5, zmin: -1.5, zmax: 1.5, nseg: 100 },
    { toString: () => "ring(implicit)", mode: "implicit", func: MathCurve.ring, xmin: -2.5, xmax: 2.5, ymin: -2.5, ymax: 2.5, zmin: -0.6, zmax: 0.6, nseg: 100 },
    { toString: () => "kummer Jeener(implicit)", mode: "implicit", func: MathCurve.kummerj, xmin: -kj, xmax: kj, ymin: -kj, ymax: kj, zmin: -kj, zmax: kj, nseg: 100 },
    { toString: () => "kummer(implicit)", mode: "implicit", func: MathCurve.kummer, xmin: -3, xmax: 3, ymin: -3, ymax: 3, zmin: -3, zmax: 3, nseg: 100 },
    { toString: () => "goursat (implicit)", mode: "implicit", func: MCF.goursat, xmin: -3, xmax: 3, ymin: -3, ymax: 3, zmin: -3, zmax: 3, nseg: 100, newton: 5 },
    { toString: () => "riemann (implicit)", mode: "implicit", func: MCF.riemann, xmin: -3, xmax: 3, ymin: -3, ymax: 3, zmin: -3, zmax: 3, nseg: 100 },
    { toString: () => "gayley (implicit)", mode: "implicit", func: MCF.gayley, xmin: -3, xmax: 3, ymin: -3, ymax: 3, zmin: -3, zmax: 3, nseg: 100 },
    { toString: () => "clebsch (implicit)", mode: "implicit", func: MCF.clebsch, xmin: -6, xmax: 6, ymin: -6, ymax: 6, zmin: -6, zmax: 6, nseg: 100 },
    { toString: () => "cubic (implicit)", mode: "implicit", func: MathCurve.cubic, xmin: -3, xmax: 3, ymin: -3, ymax: 3, zmin: -3, zmax: 3, nseg: 100 },
    { toString: () => "Schwarz (implicit)", mode: "implicit", func: MathCurve.sch, xmin: -1, xmax: 1, ymin: -1, ymax: 1, zmin: -1, zmax: 1, nseg: 100 },
    { toString: () => "gyroide (implicit)", mode: "implicit", func: MCF.gyroide, xmin: -2 * Math.PI, xmax: 2 * Math.PI, ymin: -2 * Math.PI, ymax: 2 * Math.PI, zmin: -2 * Math.PI, zmax: 2 * Math.PI, nseg: 100 },


    {
        toString: () => "Schwarz2 (implicit)", mode: "implicit", func: (x, y, z) => {
            let scale = 4. * Math.PI + 0.5;
            return MathCurve.sch(x, y, z, scale) * MathCurve.sch(x, y, z, scale) - 0.05 + MathCurve.pluspole3(x, y, z, 4. * Math.PI, scale);

        }, xmin: -1, xmax: 1, ymin: -1, ymax: 1, zmin: -1, zmax: 1, nseg: 100
    },
    { toString: () => "gyroide2 (implicit)", mode: "implicit", func: (x, y, z) => (MCF.gyroide(x, y, z) * MCF.gyroide(x, y, z) - 0.1 + MathCurve.pluspole3(x, y, z, Math.PI * 2. - 0.3, 1.5)), xmin: -2 * Math.PI, xmax: 2 * Math.PI, ymin: -2 * Math.PI, ymax: 2 * Math.PI, zmin: -2 * Math.PI, zmax: 2 * Math.PI, nseg: 100 },

    { toString: () => "cylinders(implicit)", mode: "implicit", func: MathCurve.cylinder, xmin: -2, xmax: 2, ymin: -2, ymax: 2, zmin: -4, zmax: 2, nseg: 100 },
    { toString: () => "shpere (implicit)", mode: "implicit", func: MCF.sphere, xmin: -2, xmax: 2, ymin: -2, ymax: 2, zmin: -2, zmax: 2, nseg: 100, newton: 10 },


    { toString: () => "trefoil (curve)", mode: "curve", curve: MCF.trefoil, tmin: 0, tmax: 2 * Math.PI, radius: 0.65, tseg: 200, rseg: 50, repeat: 10 },
    { toString: () => "torus knot (curve)", mode: "curve", curve: MCF.solenoid, tmin: 0, tmax: 4 * Math.PI, radius: 0.5, tseg: 200, rseg: 50, repeat: 6, axis: 2 },
    { toString: () => "eight_knot (curve)", mode: "curve", curve: MCF.eight_knot, tmin: 0, tmax: 2 * Math.PI, radius: 0.5, tseg: 200, rseg: 50, repeat: 12, axis: 2 },
    { toString: () => "mix (curve)", mode: "curve", curve: MCF.mixc, render: MCF.glz, tmin: 0, tmax: 2 * Math.PI, radius: 0.65, tseg: 200, rseg: 25, repeat: 10 },
    { toString: () => "torus (curve)", mode: "curve", curve: MCF.circ, tmin: 0, tmax: 2 * Math.PI, radius: 1., tseg: 100, rseg: 100, repeat: 2 },
    { toString: () => "tennis (curve)", mode: "curve", curve: MCF.tennis, tmin: 0, tmax: 2 * Math.PI, radius: 0.4, tseg: 200, rseg: 40, repeat: 6 },
    { toString: () => "sinewave (curve)", mode: "curve", curve: MathCurve.sinewave, tmin: 0, tmax: 14 * Math.PI, radius: 0.3, tseg: 1000, rseg: 40, repeat: 70 },
    { toString: () => "liss (curve)", mode: "curve", curve: MCF.liss, tmin: 0, tmax: 10 * Math.PI, radius: 0.3, tseg: 1000, rseg: 40, repeat: 50 },
    { toString: () => "liss2 (curve)", mode: "curve", curve: MCF.liss2, tmin: 0, tmax: 4 * Math.PI, radius: 0.4, tseg: 500, rseg: 40, repeat: 12 },
    { toString: () => "rose (curve)", mode: "curve", curve: MCF.rose, tmin: 0, tmax: 10 * Math.PI, radius: 0.2, tseg: 1000, rseg: 40, repeat: 50 },
    { toString: () => "hypotrochoid (curve)", mode: "curve", curve: MCF.hypotrochoid, tmin: 0, tmax: 3 * 2 * Math.PI, radius: 0.5, tseg: 1000, rseg: 50, repeat: 40, axis: 2 },

    { toString: () => "sine (surface)", mode: "surf", surf: MCF.sine, umin: 0, umax: 2 * Math.PI, vmin: 0, vmax: 2 * Math.PI, useg: 100, vseg: 100, repeat: 1 },
    { toString: () => "roman (surface)", mode: "surf", surf: MCF.romanp, umin: 0, umax: Math.PI, vmin: 0, vmax: Math.PI, useg: 100, vseg: 100, repeat: 1 },
    { toString: () => "boys (surface)", mode: "surf", surf: MCF.boys, umin: 0, umax: Math.PI, vmin: 0, vmax: Math.PI, useg: 100, vseg: 100, repeat: 1 },
    { toString: () => "astroidal_ellipsoid (surface)", mode: "surf", surf: MathCurve.astroidal_ellipsoid, umin: 0, umax: Math.PI, vmin: 0, vmax: 2 * Math.PI, useg: 100, vseg: 100, repeat: 1 },
    { toString: () => "klein (surface)", mode: "surf", surf: MCF.klein, umin: 2 * Math.PI, umax: 0, vmin: 0, vmax: 2 * Math.PI, useg: 100, vseg: 100, repeat: 2 },
    { toString: () => "shell (surface)", mode: "surf", surf: MCF.shell, umin: 0, umax: 14 * Math.PI, vmin: 0, vmax: 2 * Math.PI, useg: 1000, vseg: 100, repeat: 8 },
    { toString: () => "coil (surface)", mode: "surf", surf: MCF.coil, umin: 0, umax: 14 * Math.PI, vmin: 0, vmax: 2 * Math.PI, useg: 1000, vseg: 100, repeat: 16 },
    { toString: () => "mebius3d (surface)", mode: "surf", surf: MathCurve.mobius3d, umin: 0, umax: 1, vmin: 0, vmax: 1, useg: 100, vseg: 100, repeat: 4 },

    //{ toString: () => "hypotrochoid2", mode: "curveheight", curve: MCF.hypotrochoid, tmin: 0, tmax: 3 * 2 * Math.PI, radius: 0.5, tseg: 1000, rseg: 50, repeat: 40, height: 2 },
    { toString: () => "hyperboloid (surface)", mode: "surf", surf: MathCurve.hyperboloid, umin: 0, umax: 2 * Math.PI, vmin: -2, vmax: 2, useg: 200, vseg: 100, repeat: 1 },
    { toString: () => "mebius (surface)", mode: "surf", surf: MCF.mebius, umin: 0, umax: 4 * Math.PI, vmin: 0, vmax: 2 * Math.PI, useg: 500, vseg: 100, repeat: 4 },
    { toString: () => "egg_box (surface)", mode: "surf", surf: MCF.egg_box1, umin: -4, umax: 4, vmin: -4, vmax: 4, useg: 100, vseg: 100, repeat: 1 },

    { toString: () => "umbrella (surface)", mode: "surf", surf: SDF.umbrella, umin: -Math.PI / 2, umax: Math.PI / 2, vmin: 0, vmax: 4., useg: 100, vseg: 100, repeat: 1 },
    { toString: () => "tube (surface)", mode: "surf", surf: SDF.tube, umin: 0, umax: 2 * Math.PI, vmin: 0, vmax: 1, useg: 100, vseg: 10, repeat: 1 },

    { toString: () => "Roma(SDF)", mode: "implicit", func: SDF.roma, xmin: -1.5, xmax: 1.5, ymin: -1.5, ymax: 1.5, zmin: -3.5, zmax: 3.5, nseg: 50 },
    { toString: () => "Cylinders(SDF)", mode: "implicit", func: SDF.cyls, xmin: -2.2, xmax: 2.2, ymin: -2.2, ymax: 2.2, zmin: -2.2, zmax: 2.2, nseg: 100, newton: 10 },





    { toString: () => "torus2", mode: "curveheight", curve: MCF.circ, tmin: 0, tmax: 2 * Math.PI, radius: 0.4, tseg: 100, rseg: 100, repeat: 8, height: 2 },
    { toString: () => "torus3", mode: "curveclose", curve: MCF.circ, tmin: 0, tmax: 2 * Math.PI, radius: 0.4, tseg: 100, rseg: 100, repeat: 8, height: 2 },
    { toString: () => "rose2", mode: "curveheight", curve: MCF.rose, tmin: 0, tmax: 10 * Math.PI, radius: 0.2, tseg: 1000, rseg: 40, repeat: 100, height: 2 },
    //{ toString: () => "rose3", mode: "curveclose", curve: MCF.rose, tmin: 0, tmax: 10 * Math.PI, radius: 0.2, tseg: 1000, rseg: 40, repeat: 100, height: 2 },
    //{ toString: () => "quart", mode: "curveclose", curve: MCF.quart, tmin: 0, tmax: 2 * Math.PI, radius: 0.5, tseg: 1000, rseg: 40, repeat: 2, axis: 2 },




    { toString: () => "desmos_spiral", mode: "surf", surf: MCF.desmos_spiral, umin: 0, umax: 1, vmin: 0, vmax: 1, useg: 100, vseg: 100, repeat: 8 },


    //{ toString: () => "smooth", mode: "surf", surf: MathCurve.smooth, umin: 0, umax: 2 * Math.PI, vmin: 0, vmax: 2, useg: 100, vseg: 300, repeat: 1 },
    { toString: () => "fish(path)", mode: "curveclose", curve: (t) => NormalUtils.path(t, fishShape), tmin: 0, tmax: 5, radius: 0.5, tseg: 400, rseg: 50, repeat: 30, axis: 2, height: 2 },

    {
        toString: () => "round polygon", mode: "round",
        boxparams: {
            vertices: {

                1: {
                    id: 1,
                    x: -450 * scale,
                    y: -150 * scale,
                    upper_edge_rounded: false,
                    lower_edge_rounded: false,
                    next: 2,
                    prev: 4
                },
                2: {
                    id: 2,
                    x: -450 * scale,
                    y: 150 * scale,
                    upper_edge_rounded: true,
                    lower_edge_rounded: false,
                    next: 3,
                    prev: 1
                },
                3: {
                    id: 3,
                    x: 0 * scale,
                    y: 350 * scale,
                    upper_edge_rounded: false,
                    lower_edge_rounded: true,
                    next: 4,
                    prev: 2
                },
                4: {
                    id: 4,
                    x: 450 * scale,
                    y: 150 * scale,
                    upper_edge_rounded: true,
                    lower_edge_rounded: true,
                    next: 4,
                    prev: 2
                },

                5: {
                    id: 5,
                    x: 450 * scale,
                    y: -150 * scale,
                    upper_edge_rounded: true,
                    lower_edge_rounded: true,
                    next: 1,
                    prev: 3
                },
                6: {
                    id: 6,
                    x: 0 * scale,
                    y: 0 * scale,
                    upper_edge_rounded: false,
                    lower_edge_rounded: true,
                    next: 4,
                    prev: 2
                },

            },
            radius: 30 * scale,
            segments: 10,
            size: 100 * scale
        }
    }
];

export {models}
