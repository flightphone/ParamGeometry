import { Vector3} from "three";


class MathCurve {
    static hyperboloid(u, v)
    {
        let a = 1, b = 1, c = 2;
        let x = a*(Math.cos(u) - v* Math.sin(u)), y = b*(Math.sin(u) + v*Math.cos(u)),
        z= c*v;
        return new Vector3(x, y, z);

    }
}

export {MathCurve};

//https://ru.wikipedia.org/wiki/Marching_cubes
//https://github.com/hofk/THREEi.js
//https://k3dsurf.sourceforge.net/
//https://mathcurve.com/surfaces.gb/costa/costa.shtml
//https://mathcurve.com/surfaces.gb/weber/weber.shtml
//https://mathcurve.com/courbes2d.gb/hypotrochoid/hypotrochoid.shtml



//https://paulbourke.net/geometry/polygonise/
//https://threejs.org/examples/webgl_marchingcubes.html


//https://github.com/KineticTactic/marching-cubes-js/blob/master/sketch.js
//https://habr.com/ru/articles/358658/
//https://www.boristhebrave.com/2018/04/15/dual-contouring-tutorial/
//https://github.com/Domenicobrz/Dual-Contouring-javascript-implementation
//https://github.com/Domenicobrz/Dual-Contouring-javascript-implementation/blob/master/README.md

//Погорелов 89

//https://mathcurve.com/surfaces.gb/tore/tn.shtml
//https://mathcurve.com/courbes2d/gerono/gerono.shtml

//https://ru.wikipedia.org/wiki/POV-Ray

//https://mathcurve.com/courbes2d.gb/scarabee/scarabee.shtml
//https://mathcurve.com/surfaces.gb/hyperboloid/hyperboloid1.shtm
