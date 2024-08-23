import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CurveGeometry } from './CurveGeometry';
import { CurveHeightGeometry } from './CurveHeightGeometry';
import { CurveCloseGeometry } from './CurveCloseGeometry';
import { SurfGeometry } from './SurfGeometry'
import { makeGeometry } from './RoundGeometry';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { ImplicitGeometry } from './ImplicitGeometry';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as MCF from './mathcurve.js'
import { MathCurve } from './MathCurve2';
import { NormalUtils } from "./NormalUtils";
import { Balls } from './balls';

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
    //{ toString: () => "shpere", mode: "implicit", func: MCF.sphere, xmin: -4, xmax: 4, ymin: -4, ymax:4, zmin: -4, zmax:4, nseg:50, newton : 10},
    
    
    
    { toString: () => "trefoil (curve)", mode: "curve", curve: MCF.trefoil, tmin: 0, tmax: 2 * Math.PI, radius: 0.5, tseg: 200, rseg: 50, repeat: 6 },
    { toString: () => "torus knot (curve)", mode: "curve", curve: MCF.solenoid, tmin: 0, tmax: 4 * Math.PI, radius: 0.5, tseg: 200, rseg: 50, repeat: 6, axis: 2 },
    { toString: () => "eight_knot (curve)", mode: "curve", curve: MCF.eight_knot, tmin: 0, tmax: 2 * Math.PI, radius: 0.6, tseg: 500, rseg: 50, repeat: 12, axis: 2 },
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
    
    
    
    { toString: () => "genus-two(implicit)", mode: "implicit", func: MCF.isf, xmin: -2, xmax: 2, ymin: -2, ymax: 2, zmin: -2, zmax: 2, nseg: 100 },
    { toString: () => "cassinian(implicit)", mode: "implicit", func: MathCurve.cassinian,  xmin: -4, xmax: 4, ymin: -4, ymax: 4, zmin: -4, zmax: 4, nseg: 100 },
    { toString: () => "round-cube (implicit)", mode: "implicit", func: MCF.rcube, xmin: -2, xmax: 2, ymin: -2, ymax: 2, zmin: -2, zmax: 2, nseg: 100 },
    { toString: () => "balls (implicit)", mode: "implicit", func: Balls.potential,  xmin: -Balls.r, xmax: Balls.r + 1, ymin: -Balls.r - 1, ymax: Balls.r + 1, zmin: -Balls.r - 1, zmax: Balls.r + 1, nseg: 100, newton: 5 },
    { toString: () => "desmos (implicit)", mode: "implicit", func: MathCurve.desimp, xmin: -2, xmax: 2, ymin: -2, ymax: 2, zmin: -2, zmax: 2, nseg: 100 },
    { toString: () => "three-torus (implicit)", mode: "implicit", func: MCF.tors, xmin: -1.5, xmax: 1.5, ymin: -1.5, ymax: 1.5, zmin: -1.5, zmax: 1.5, nseg: 100 },
    { toString: () => "algebraic (implicit)", mode: "implicit", func: MathCurve.algebraic, xmin: -1.2, xmax: 1.2, ymin: -1.2, ymax: 1.2, zmin: -1.2, zmax: 1.2, nseg: 100 },
    { toString: () => "holed2 (implicit)", mode: "implicit", func: MCF.holed2, xmin: -1.2, xmax: 1.2, ymin: -1, ymax: 1, zmin: -1, zmax: 1, nseg: 100 },
    { toString: () => "holed3 (implicit)", mode: "implicit", func: MCF.holed3, xmin: -1.2, xmax: 1.2, ymin: -1, ymax: 1, zmin: -1, zmax: 1, nseg: 100 },
    { toString: () => "holed4 (implicit)", mode: "implicit", func: MCF.quadrifolium, xmin: -1.5, xmax: 1.5, ymin: -1.5, ymax: 1.5, zmin: -1.5, zmax: 1.5, nseg: 100 },
    { toString: () => "kummer Jeener(implicit)", mode: "implicit", func: MathCurve.kummerj, xmin: -kj, xmax: kj, ymin: -kj, ymax: kj, zmin: -kj, zmax: kj, nseg: 170 },
    { toString: () => "kummer(implicit)", mode: "implicit", func: MathCurve.kummer, xmin: -3, xmax: 3, ymin: -3, ymax: 3, zmin: -3, zmax: 3, nseg: 100 },
    { toString: () => "goursat (implicit)", mode: "implicit", func: MCF.goursat, xmin: -3, xmax: 3, ymin: -3, ymax: 3, zmin: -3, zmax: 3, nseg: 100, newton: 5 },
    { toString: () => "riemann (implicit)", mode: "implicit", func: MCF.riemann, xmin: -3, xmax: 3, ymin: -3, ymax: 3, zmin: -3, zmax: 3, nseg: 150 },
    { toString: () => "gayley (implicit)", mode: "implicit", func: MCF.gayley, xmin: -3, xmax: 3, ymin: -3, ymax: 3, zmin: -3, zmax: 3, nseg: 150 },
    { toString: () => "clebsch (implicit)", mode: "implicit", func: MCF.clebsch, xmin: -6, xmax: 6, ymin: -6, ymax: 6, zmin: -6, zmax: 6, nseg: 150 },
    { toString: () => "cubic (implicit)", mode: "implicit", func: MathCurve.cubic, xmin: -3, xmax: 3, ymin: -3, ymax: 3, zmin: -3, zmax: 3, nseg: 150 },
    { toString: () => "sch (implicit)", mode: "implicit", func: MathCurve.sch, xmin: -4, xmax: 4, ymin: -4, ymax: 4, zmin: -4, zmax: 4, nseg: 100},
    { toString: () => "gyroide (implicit)", mode: "implicit", func: MCF.gyroide, xmin: -2 * Math.PI, xmax: 2 * Math.PI, ymin: -2 * Math.PI, ymax: 2 * Math.PI, zmin: -2 * Math.PI, zmax: 2 * Math.PI, nseg: 100 },
    { toString: () => "cylinders(implicit)", mode: "implicit", func: MathCurve.cylinder, xmin: -2, xmax: 2, ymin: -2, ymax: 2, zmin: -4, zmax: 2, nseg: 100 },


    { toString: () => "torus2", mode: "curveheight", curve: MCF.circ, tmin: 0, tmax: 2 * Math.PI, radius: 0.4, tseg: 100, rseg: 100, repeat: 8, height: 2 },
    { toString: () => "torus3", mode: "curveclose", curve: MCF.circ, tmin: 0, tmax: 2 * Math.PI, radius: 0.4, tseg: 100, rseg: 100, repeat: 8, height: 2 },
    { toString: () => "rose2", mode: "curveheight", curve: MCF.rose, tmin: 0, tmax: 10 * Math.PI, radius: 0.2, tseg: 1000, rseg: 40, repeat: 100, height: 2 },
    //{ toString: () => "rose3", mode: "curveclose", curve: MCF.rose, tmin: 0, tmax: 10 * Math.PI, radius: 0.2, tseg: 1000, rseg: 40, repeat: 100, height: 2 },
    //{ toString: () => "quart", mode: "curveclose", curve: MCF.quart, tmin: 0, tmax: 2 * Math.PI, radius: 0.5, tseg: 1000, rseg: 40, repeat: 2, axis: 2 },


    

    { toString: () => "desmos_spiral", mode: "surf", surf: MCF.desmos_spiral, umin: 0, umax: 1, vmin: 0, vmax: 1, useg: 100, vseg: 100, repeat: 8 },
    

    //{ toString: () => "smooth", mode: "surf", surf: MathCurve.smooth, umin: 0, umax: 2 * Math.PI, vmin: 0, vmax: 2, useg: 100, vseg: 300, repeat: 1 },
    { toString: () => "fish(path)", mode: "curveclose", curve: (t) => NormalUtils.path(t, fishShape), tmin: 0, tmax: 5, radius: 0.5, tseg: 400, rseg: 50, repeat: 30, axis: 2, height: 2 },
    //{ toString: () => "heart2", mode: "curveheight", curve: (t) => NormalUtils.path(t, heartShape), tmin: 0, tmax: 6, radius: 1., tseg: 400, rseg: 50, repeat: 10, height: 3 },


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
]

const loader = new THREE.TextureLoader();
const texture = loader.load("img/texture.png");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

const materialRound = new THREE.MeshStandardMaterial({ //new THREE.MeshLambertMaterial({
    roughness: 0.1,
    //metalness:0.5,
    side: THREE.DoubleSide,
    map: texture
});


const materialFun = new THREE.MeshStandardMaterial({ //new THREE.MeshLambertMaterial({
    roughness: 0.1,
    color: 0xDECA95,
    side: THREE.FrontSide
});

const materialFunb = new THREE.MeshStandardMaterial({ //new THREE.MeshLambertMaterial({
    roughness: 0.1,
    color: 0xDD1212,
    side: THREE.BackSide
});


const materialWire = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x000000),
    side: THREE.DoubleSide,
    wireframe: true,

});




const params = {
    model: models[0],
    wireframe: false,
    clip:false,
    update: CreatePanel,
    exportASCII: exportASCII,
    saveScreen:saveScreen,
    version: "4.2"
}

/*
let x = new THREE.Vector3(1, 0, 0);
let y = new THREE.Vector3(0, 1, 0);
let z = new THREE.Vector3(0, 0, 1);

//z.crossVectors(x, y);
y.crossVectors(z, x);
console.log(y);
*/

const gui = new GUI();
gui.add(params, "model", models, 'name').name('Model').onChange(CreatePanel);
gui.add(params, 'wireframe').name('Wireframe').onChange(CreatePanel);
gui.add(params, 'clip').name('Clip')
gui.add(params, 'exportASCII').name('Export');
gui.add(params, 'saveScreen').name('Save screen');
gui.add(params, 'version').name('Version');
gui.open();

let currentModel = 0;

//init scene
let renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
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



//=========================init object======================
let me = null;
let me2 = null;
let me3 = null;

CreatePanel();

//for save object
const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);
//=========================init object======================



let controls = new OrbitControls(camera, renderer.domElement);
controls.update();
window.addEventListener('resize', onWindowResize);
onWindowResize();
requestAnimationFrame(render);

function render(time) {
    if (params.clip)
    {
        let md = Math.floor(time/3000) % models.length;
        if (md!= currentModel)
        {
            currentModel = md;
            params.model = models[currentModel];
            CreatePanel();
        }
    }

    if (params.model.render) {
        params.model.render(time);
        CreatePanel();
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//===============================Service Functions==================================================

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
        geom = new ImplicitGeometry(par.func, par.xmin, par.xmax, par.ymin, par.ymax, par.zmin, par.zmax, par.nseg, par.newton);

    geom.computeBoundingSphere();
    let sc = 5.5/geom.boundingSphere.radius;
    geom.scale(sc, sc, sc);

    if (me)
        scene.remove(me);
    if (me2)
        scene.remove(me2);

    if (me3)
        scene.remove(me3);

    me2 = null;

    if (par.mode == "implicit") {
        me = new THREE.Mesh(geom, materialFun);
        if (params.model.render == null) {
            me3 = new THREE.Mesh(geom, materialFunb);
            scene.add(me3);
        }
        //me = new THREE.Points(geom, new THREE.PointsMaterial({ size: 0.03 }));
    }

    else {
        me = new THREE.Mesh(geom, materialRound);
    }
    scene.add(me);


    if (params.wireframe) {
        me2 = new THREE.Mesh(geom, materialWire);
        scene.add(me2);
    }
}




function exportASCII() {

    const result = exporter.parse(me);
    saveString(result, 'curve.obj');

}

function saveScreen()
{
    const canvas = renderer.domElement;
    const image = canvas.toDataURL();
    link.href = image;
    link.download = params.model.toString() + '.png';
    link.click();
}


function save(blob, filename) {

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

}

function saveString(text, filename) {

    save(new Blob([text], { type: 'text/plain' }), params.model.toString() + '.obj');

}

function saveArrayBuffer(buffer, filename) {

    save(new Blob([buffer], { type: 'application/octet-stream' }), filename);

}





