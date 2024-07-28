import * as THREE from 'three';
//import {MarchingCubes} from 'three/addons/controls/OrbitControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CurveGeometry } from './CurveGeometry';
import { CurveHeightGeometry } from './CurveHeightGeometry';
import { CurveCloseGeometry } from './CurveCloseGeometry';
import { SurfGeometry } from './SurfGeometry'
import { makeGeometry } from './RoundGeometry';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
//import { FunctionGeometry } from './FunctionGeometry';
import { ImplicitGeometry } from './ImplicitGeometry';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//let mm = new March

let scale = 5;

let hypotr = 3;


const models = [
    { toString: () => "shpere", mode: "implicit", func: sphere, xmin: -2, xmax: 2, ymin: -2, ymax:2, zmin: -2, zmax:2, nseg:10},
    { toString: () => "gayley", mode: "implicit", func: gayley, xmin: -3, xmax: 3, ymin: -3, ymax:3, zmin: -3, zmax:3, nseg:100},
    { toString: () => "goursat", mode: "implicit", func: goursat, xmin: -3, xmax: 3, ymin: -3, ymax:3, zmin: -3, zmax:3, nseg:100},
    { toString: () => "riemann", mode: "implicit", func: riemann, xmin: -3, xmax: 3, ymin: -3, ymax:3, zmin: -3, zmax:3, nseg:100},
    
    { toString: () => "cassini", mode: "implicit", func: cassini, xmin: -3, xmax: 3, ymin: -3, ymax:3, zmin: -2, zmax:2, nseg:100},
    { toString: () => "clebsch", mode: "implicit", func: clebsch, xmin: -3, xmax: 3, ymin: -3, ymax:3, zmin: -3, zmax:3, nseg:100},


    
    { toString: () => "torus", mode: "curve", curve: circ, tmin: 0, tmax: 2 * Math.PI, radius: 1., tseg: 100, rseg: 100, repeat: 2 },
    { toString: () => "torus2", mode: "curveheight", curve: circ, tmin: 0, tmax: 2 * Math.PI, radius: 0.4, tseg: 100, rseg: 100, repeat: 8, height: 2 },
    { toString: () => "torus3", mode: "curveclose", curve: circ, tmin: 0, tmax: 2 * Math.PI, radius: 0.4, tseg: 100, rseg: 100, repeat: 8, height: 2 },
    { toString: () => "trefoil", mode: "curve", curve: trefoil, tmin: 0, tmax: 2 * Math.PI, radius: 0.5, tseg: 200, rseg: 50, repeat: 6 },
    { toString: () => "torus knot", mode: "curve", curve: solenoid, tmin: 0, tmax: 4 * Math.PI, radius: 0.5, tseg: 200, rseg: 50, repeat: 6, axis: 2 },
    { toString: () => "eight_knot", mode: "curve", curve: eight_knot, tmin: 0, tmax: 2 * Math.PI, radius: 0.6, tseg: 500, rseg: 50, repeat: 12, axis:2},
    { toString: () => "tennis", mode: "curve", curve: tennis, tmin: 0, tmax: 2 * Math.PI, radius: 0.4, tseg: 200, rseg: 40, repeat: 6 },
    { toString: () => "liss", mode: "curve", curve: liss, tmin: 0, tmax: 10 * Math.PI, radius: 0.3, tseg: 1000, rseg: 40, repeat: 50 },
    { toString: () => "liss2", mode: "curve", curve: liss2, tmin: 0, tmax: 4 * Math.PI, radius: 0.4, tseg: 500, rseg: 40, repeat: 12 },
    { toString: () => "rose", mode: "curve", curve: rose, tmin: 0, tmax: 10 * Math.PI, radius: 0.2, tseg: 1000, rseg: 40, repeat: 50 },
    { toString: () => "rose2", mode: "curveheight", curve: rose, tmin: 0, tmax: 10 * Math.PI, radius: 0.2, tseg: 1000, rseg: 40, repeat: 100, height:2 },
    { toString: () => "rose3", mode: "curveclose", curve: rose, tmin: 0, tmax: 10 * Math.PI, radius: 0.2, tseg: 1000, rseg: 40, repeat: 100, height:2 },
    { toString: () => "quart", mode: "curveclose", curve:quart, tmin: 0, tmax: 2 * Math.PI, radius: 0.5, tseg: 1000, rseg: 40, repeat: 2, axis:2 },
    { toString: () => "sine", mode: "surf", surf: sine, umin: 0, umax: 2 * Math.PI, vmin: 0, vmax: 2 * Math.PI, useg: 100, vseg: 100, repeat: 1 },
    { toString: () => "roman", mode: "surf", surf: romanp, umin: 0, umax: Math.PI, vmin: 0, vmax: Math.PI, useg: 100, vseg: 100, repeat: 1},
    { toString: () => "klein", mode: "surf", surf: klein, umin: 2 * Math.PI, umax: 0, vmin: 0, vmax: 2 * Math.PI, useg: 100, vseg: 100, repeat: 2 },
    { toString: () => "shell", mode: "surf", surf: shell, umin: 0, umax: 14 * Math.PI, vmin: 0, vmax: 2 * Math.PI, useg: 1000, vseg: 100, repeat: 8 },
    { toString: () => "mebius", mode: "surf", surf: mebius, umin: 0, umax: 4 * Math.PI, vmin: 0, vmax: 2 * Math.PI, useg: 500, vseg: 100, repeat: 4 },
    { toString: () => "boys", mode: "surf", surf: boys, umin: 0, umax: Math.PI, vmin: 0, vmax: Math.PI, useg: 100, vseg: 100, repeat: 1 },
    { toString: () => "desmos_spiral", mode: "surf", surf: desmos_spiral, umin: 0, umax: 1, vmin: 0, vmax: 1, useg: 100, vseg: 100, repeat: 8 },
    { toString: () => "coil", mode: "surf", surf: coil, umin: 0, umax: 14 * Math.PI, vmin: 0, vmax: 2 * Math.PI, useg: 1000, vseg: 100, repeat: 16 },
    { toString: () => "hypotrochoid", mode: "curve", curve: hypotrochoid, tmin: 0, tmax: hypotr * 2 * Math.PI, radius: 0.5, tseg: 1000, rseg: 50, repeat: 40, axis:2 },
    //{ toString: () => "egg_box", mode: "func", func: egg_box, xmin: -4, xmax: 4, ymin: -4, ymax:4, zmin: -10, zmax:10, xseg:300, yseg:300},
    { toString: () => "egg_box", mode: "surf", surf: egg_box1, umin: -4, umax: 4, vmin: -4, vmax: 4, useg: 100, vseg: 100, repeat: 1 },

    {
        toString: () => "round polygon", mode: "round",
        boxparams: {
            vertices: {
                
                1: {
                    id: 1,
                    x: -450*scale,
                    y: -150*scale,
                    upper_edge_rounded: false,
                    lower_edge_rounded: false,
                    next: 2,
                    prev: 4
                },
                2: {
                    id: 2,
                    x: -450*scale,
                    y: 150*scale,
                    upper_edge_rounded: true,
                    lower_edge_rounded: false,
                    next: 3,
                    prev: 1
                },
                3: {
                    id: 3,
                    x: 0*scale,
                    y: 350*scale,
                    upper_edge_rounded: false,
                    lower_edge_rounded: true,
                    next: 4,
                    prev: 2
                },
                4: {
                    id: 4,
                    x: 450*scale,
                    y: 150*scale,
                    upper_edge_rounded: true,
                    lower_edge_rounded: true,
                    next: 4,
                    prev: 2
                },
                
                5: {
                    id: 5,
                    x: 450*scale,
                    y: -150*scale,
                    upper_edge_rounded: true,
                    lower_edge_rounded: true,
                    next: 1,
                    prev: 3
                },
                6: {
                    id: 6,
                    x: 0*scale,
                    y: 0*scale,
                    upper_edge_rounded: false,
                    lower_edge_rounded: true,
                    next: 4,
                    prev: 2
                },
                
            },
            radius: 30*scale,
            segments: 10,
            size: 100*scale
        }
    }
]

const loader = new THREE.TextureLoader();
const texture = loader.load("img/texture.png");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

const materialRound = new THREE.MeshStandardMaterial({ //new THREE.MeshLambertMaterial({
    roughness:0.1,
    //metalness:0.5,
    side: THREE.DoubleSide,
    map: texture
});


const materialFun = new THREE.MeshStandardMaterial({ //new THREE.MeshLambertMaterial({
    roughness:0.1,
    color: 0xDECA95,
    side: THREE.DoubleSide
});

const materialWire = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x000000),
    side: THREE.DoubleSide,
    wireframe: true,

});




const params = {
    model: models[0],
    wireframe: false,
    update: CreatePanel,
    exportASCII: exportASCII,
    version: "2.0"
}

/*
let x = new THREE.Vector3(1, 0, 0);
let z = new THREE.Vector3(0, 0, 0);
let y = new THREE.Vector3(0, 1, 0);
z.crossVectors(x, y);
console.log(z);
*/



const gui = new GUI();
gui.add(params, "model", models, 'name').name('Model').onChange(CreatePanel);
gui.add(params, 'wireframe').name('Wireframe').onChange(CreatePanel);
//gui.add(params, 'update').name('Update');
gui.add(params, 'exportASCII').name('Export');
gui.add(params, 'version').name('Version');



gui.open();

//init scene
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 500);
const scene = new THREE.Scene();




//look
camera.position.set(0, 0, 10);
camera.up.set(0, 1, 0);
camera.lookAt(0, 0, 0);

let exporter = new OBJExporter();

{
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
}

{
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemiLight.position.set(0, -20, 0);
    scene.add(hemiLight);
}


{
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 20);
    scene.add(directionalLight);
}

{
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(0, 0, -20);
    scene.add(directionalLight);
}








let me = null;
let me2 = null;

CreatePanel();

//mouse rotate
let controls = new OrbitControls(camera, renderer.domElement);
controls.update();
window.addEventListener('resize', onWindowResize);
requestAnimationFrame(render);





function CreatePanel() {

    let geom = null;
    let par = params.model;
    
    if (par.mode == "curve") {
        let mode = 0;
        if (par.axis)
            mode = 2;
        geom = new CurveGeometry(par.curve, par.tmin, par.tmax, par.radius, par.tseg, par.rseg, par.repeat, mode);
    }
    if (par.mode == "curveheight") {
        geom = new CurveHeightGeometry(par.curve, par.tmin, par.tmax, par.radius, par.tseg, par.rseg, par.repeat, par.height);
    }

    if (par.mode == "curveclose") {
        geom = new CurveCloseGeometry(par.curve, par.tmin, par.tmax, par.radius, par.tseg, par.rseg, par.repeat, par.height);
    }

    

    if (par.mode == "surf")
        geom = new SurfGeometry(par.surf, par.umin, par.umax, par.vmin, par.vmax, par.useg, par.vseg, par.repeat);
    if (par.mode == "round")
        geom = makeGeometry(par.boxparams);

    if (par.mode == "implicit")    
        geom = new ImplicitGeometry(par.func, par.xmin, par.xmax, par.ymin, par.ymax, par.zmin, par.zmax, par.nseg);

    
    if (me)
        scene.remove(me);
    if (me2)
        scene.remove(me2);

    me2 = null;
   
    if (par.mode == "implicit")
        //me = new THREE.Points(geom, new THREE.PointsMaterial({ size: 0.03 }));
        me = new THREE.Mesh(geom, materialFun);
        
    else
        me = new THREE.Mesh(geom, materialRound);
    scene.add(me);


    if (params.wireframe) {
        me2 = new THREE.Mesh(geom, materialWire);
        scene.add(me2);
    }
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render(time) {
    time *= 0.001; // convert to seconds;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function hypotrochoid(t)
{
    let R = 7, r = hypotr, d = 7;
    let x = (R - r)*Math.cos(t) + d* Math.cos((R-r)/r*t);
    let y = (R - r)*Math.sin(t) - d* Math.sin((R-r)/r*t);
    return new THREE.Vector3(x, y, 0);
}

function shell(u, v) {
    let a = 3., b = 2.5, m = -0.1, k = 2.5;
    let x = Math.exp(m * u) * Math.cos(u) * (a + b * Math.cos(v));
    let y = Math.exp(m * u) * Math.sin(u) * (a + b * Math.cos(v));
    let z = Math.exp(m * u) * (k * a + b * Math.sin(v));
    let h = k * a + b;
    z -= h / 2.;
    return new THREE.Vector3(x, y, z);
}

function sine(u, v) {
    let a = 2.;
    return new THREE.Vector3(a * Math.sin(u), a * Math.sin(v), a * Math.sin(u + v));
}

function tennis(t) {
    let a = 2., b = 1., c = 2. * Math.sqrt(a * b), x = a * Math.cos(t) + b * Math.cos(3. * t), y = a * Math.sin(t) - b * Math.sin(3. * t), z = c * Math.sin(2. * t);
    return new THREE.Vector3(x, y, z);
}
function circ(t) {
    let a = 2;
    return new THREE.Vector3(Math.cos(t) * a, Math.sin(t) * a, 0);
}

function trefoil(t) {
    let a = 5;
    return new THREE.Vector3(Math.sin(t) + 2. * Math.sin(2. * t), Math.cos(t) - 2. * Math.cos(2. * t), -1 * Math.sin(3. * t));
}

function solenoid(t) {
    let n = 1.5, R = 2., r = 1.;
    return new THREE.Vector3((R + r * Math.cos(n * t)) * Math.cos(t), (R + r * Math.cos(n * t)) * Math.sin(t), r * Math.sin(n * t));
}

function liss(t) {
    let a = 3., b = 3., c = 2.5, n = 1.2, m = 2., f = Math.PI / 2., e = .0;
    return new THREE.Vector3(a * Math.sin(t), b * Math.sin(n * t + f), c * Math.sin(m * t + e));
}

function liss2(t) {
    let a = 3., b = 3., c = 1.5, n = 1.5, m = 2.5, f = Math.PI/2., e = .0;
    return new THREE.Vector3(a * Math.sin(t), b * Math.sin(n * t + f), c * Math.sin(m * t + e));
}


function rose(t)
{
    let a = 4.,
    n = 2.2,
    b = 0.,
    r = a*Math.cos(n*t);
    return new THREE.Vector3(r*Math.cos(t), r*Math.sin(t), b*Math.cos(n*t)*Math.cos(n*t));
}

function klein(u, v) {

    let a = 3., b = 4., c = 2., r, x, y, z;
    if (u < Math.PI) {
        r = c * (1. - Math.cos(u) / 2.);
        x = Math.cos(u) * (a * (1. + Math.sin(u)) + r * Math.cos(v));
        y = Math.sin(u) * (b + r * Math.cos(v));
        z = r * Math.sin(v);
    }

    else {
        r = c * (1. - Math.cos(u) / 2.);
        x = Math.cos(u) * a * (1. + Math.sin(u)) - r * Math.cos(v);
        y = Math.sin(u) * b;
        z = r * Math.sin(v);
    }

    return new THREE.Vector3(x, y, z);


}

function desmos_spiral(v, u)
{
    //https://www.desmos.com/3d/2f58701dc9?lang=ru
    let x = (4+Math.sin(Math.PI*v)*Math.sin(Math.PI*2*u))*Math.sin(Math.PI*3*v);
    let y = Math.sin(Math.PI*v)*Math.cos(Math.PI*2*u) + 8*v - 4;
    let z = (4+Math.sin(Math.PI*v)*Math.sin(Math.PI*2*u))*Math.cos(Math.PI*3*v);
    return new THREE.Vector3(x, y, z);
}
function eight_knot(t) {
    let a = 3, b = 2
    return new THREE.Vector3((a + b*Math.cos(2 * t)) * Math.cos(3 * t), (a + b*Math.cos(2 * t)) * Math.sin(3 * t),  Math.sin(4 * t));
}


function quart(t)
{
    let r = 2., n  = 4., dn = Math.PI*2/n, c = t/dn, a0 = Math.floor(c)*dn, 
    a1 = a0 + dn, d = c - Math.floor(c);
    let v1 = new THREE.Vector3(Math.cos(a0), Math.sin(a0), 0);
    let v2 = new THREE.Vector3(Math.cos(a1), Math.sin(a1), 0);
    v2.sub(v1);
    v2.multiplyScalar(d);
    let res = new THREE.Vector3(0, 0, 0);
    res.addVectors(v1, v2);
    res.multiplyScalar(r);
    //vec3 res = r*(v1 + (v2-v1)*d);
    return res;
}

function egg_box(x, y)
{
    let a = 0.5, b = 0.25;
    let z = a*(Math.sin(x/b) + Math.sin(y/b));
    return z;
}

function egg_box1(u, v)
{
    let a = 0.5, b = 0.25;
    let z = a*(Math.sin(u/b) + Math.sin(v/b));
    return new THREE.Vector3(u, v, z);
}

function mebius(v, u)
{
    //https://mathcurve.com/surfaces.gb/mobiussurface/mobiussurface.shtml
    let a = 1.5; 
    let x = (a + u* Math.cos(v/2.))*Math.cos(v);
    let y = (a + u* Math.cos(v/2.))*Math.sin(v);
    let z = u*Math.sin(v/2.);
    return new THREE.Vector3(x, y, z);
}

function boys(u,  v)
{
    let sides = 0.;
    let k = 1.;
    let ka = Math.cos(u)/(Math.sqrt(2.)- k*Math.sin(2.*u)*Math.sin(3.*v)),
    z = ka*3.0*Math.cos(u),
    x = ka*(Math.cos(u)*Math.cos(2.*v) + Math.sqrt(2.)*Math.sin(u)*Math.cos(v)),
    y = ka*(Math.cos(u)*Math.sin(2.*v) - Math.sqrt(2.)*Math.sin(u)*Math.sin(v));
    let res =  new THREE.Vector3(x, y, z);
    //res.z -= sqrt(2.);
    return res;
}


function coil(u, v)
{
    let a = 2, b = 0.5, h = -0.18;
    let x = (a + b*Math.cos(v))*Math.cos(u) + b*h / Math.sqrt(a*a + h*h)*Math.sin(u)*Math.sin(v),
    y = (a + b*Math.cos(v))*Math.sin(u) + b*h / Math.sqrt(a*a + h*h)*Math.cos(u)*Math.sin(v),
    z = h*u + b*a / Math.sqrt(a*a + h*h)*Math.sin(v);
    return new THREE.Vector3(z-7*Math.PI*h, x, y);
}

function goursat(x, y, z)
{
    let a = 1;
    return(2*(x*x*y*y + x*x*z*z + z*z*y*y) - a*a*(x*x + y*y + z*z) - a*a*a*a);
}

function gayley(x, y, z)
{
    let k = 2;
    let a = 1
    return ((x+y+z-a)*(x*y + y*z + z*x) - k*x*y*z);
}


function roman(x, y, z)
{
    let a = 1;
    return ((x*x*y*y + x*x*z*z + z*z*y*y) - 2 * a * x*y*z);
}

function romanp(v, u)
{
    let r = 3;
    let x = r*r*Math.cos(u)*Math.cos(v)*Math.sin(v),
    y = r*r*Math.sin(u)*Math.cos(v)*Math.sin(v),
    z = r*r*Math.cos(u)*Math.sin(u)*Math.cos(v)*Math.cos(v);
    return new THREE.Vector3(x, y, z);

}





















function riemann(x, y, z)
{
    let a = 1;
    let d = (x*x + y*y - a*a)*z - a*x;
    return d; 
}

function sphere(x, y, z)
{
    return (x*x + y*y + z*z - 4);
}

function clebsch(x, y, z)
{
    let t = 1, k = 1;
    let u = x + y + z + t;
    return (k*(x*x*x + y*y*y + z*z*z + t*t*t) - u*u*u);
}

function cassini(x, y, z)
{
    let a = 1;
    return ((x-a)*(x-a) + y*y)*((x+a)*(x+a) + y*y) - z*z*z*z;
}
function exportASCII() {

    const result = exporter.parse(me);
    saveString(result, 'curve.obj');

}



const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);

function save(blob, filename) {

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

}

function saveString(text, filename) {

    save(new Blob([text], { type: 'text/plain' }), filename);

}

function saveArrayBuffer(buffer, filename) {

    save(new Blob([buffer], { type: 'application/octet-stream' }), filename);

}


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