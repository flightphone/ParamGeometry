import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CurveGeometry } from './CurveGeometry';
import { SurfGeometry } from './SurfGeometry'
import { RoundGeometry, makeGeometry } from './RoundGeometry';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';



const models = [
    { toString: () => "torus", mode: "curve", curve: circ, tmin: 0, tmax: 2 * Math.PI, radius: 0.4, tseg: 200, rseg: 40, repeat: 2 },
    { toString: () => "liss", mode: "curve", curve: liss, tmin: 0, tmax: 10 * Math.PI, radius: 0.2, tseg: 1000, rseg: 40, repeat: 50 },
    { toString: () => "trefoil", mode: "curve", curve: trefoil, tmin: 0, tmax: 2 * Math.PI, radius: 0.5, tseg: 200, rseg: 50, repeat: 6 },
    { toString: () => "tennis", mode: "curve", curve: tennis, tmin: 0, tmax: 2 * Math.PI, radius: 0.8, tseg: 200, rseg: 40, repeat: 6 },
    { toString: () => "sine", mode: "surf", surf: sine, umin: 0, umax: 2 * Math.PI, vmin: 0, vmax: 2 * Math.PI, useg: 100, vseg: 100, repeat: 1 },
    { toString: () => "klein", mode: "surf", surf:klein, umin: 2 * Math.PI, umax: 0, vmin: 0, vmax: 2 * Math.PI, useg: 100, vseg: 100, repeat: 2 },
    { toString: () => "shell", mode: "surf", surf: shell, umin: 0, umax: 14 * Math.PI, vmin: 0, vmax: 2 * Math.PI, useg: 1000, vseg: 100, repeat: 8 },
    {
        toString: () => "round box", mode: "round",
        boxparams: {
            vertices: {
                1: {
                    id: 1,
                    x: -450,
                    y: -150,
                    upper_edge_rounded: false,
                    lower_edge_rounded: false,
                    next: 2,
                    prev: 4
                },
                2: {
                    id: 2,
                    x: -450,
                    y: 150,
                    upper_edge_rounded: true,
                    lower_edge_rounded: false,
                    next: 3,
                    prev: 1
                },
                3: {
                    id: 3,
                    x: 450,
                    y: 150,
                    upper_edge_rounded: false,
                    lower_edge_rounded: true,
                    next: 4,
                    prev: 2
                },
                4: {
                    id: 4,
                    x: 450,
                    y: -150,
                    upper_edge_rounded: true,
                    lower_edge_rounded: true,
                    next: 1,
                    prev: 3
                }
            },
            radius: 30,
            segments: 10,
            size: 100
        }
    }
]





const params = {
    model: models[0],
    wireframe: false,
    update: CreatePanel,
    exportASCII: exportASCII,
    version: "2.0"
}

/*
let x = new THREE.Vector3(1, 0, 0);
let z = new THREE.Vector3(0, 0, 1);
let y = new THREE.Vector3(0, 0, 0);
y.crossVectors(z, x);
console.log(y);
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

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

{
    const directionalLight = new THREE.DirectionalLight(0xffffff, 15);
    directionalLight.position.set(0, 0, 20);
    scene.add(directionalLight);
}

{
    const directionalLight = new THREE.DirectionalLight(0xffffff, 15);
    directionalLight.position.set(0, 0, -20);
    scene.add(directionalLight);
}

const loader = new THREE.TextureLoader();
const texture = loader.load("img/texture.png");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;


const materialRound = new THREE.MeshLambertMaterial({
    color: new THREE.Color(0x5F5F5F),
    side: THREE.DoubleSide,
    map: texture
});

const materialWire = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x000000),
    side: THREE.DoubleSide,
    wireframe: true,

});



let me = null;
let me2 = null;
//let helper = null;

CreatePanel();

//mouse rotate
let controls = new OrbitControls(camera, renderer.domElement);
controls.update();
window.addEventListener('resize', onWindowResize);
requestAnimationFrame(render);





function CreatePanel() {


    let geom = null;
    let par = params.model;
    if (par.mode == "curve")
        geom = new CurveGeometry(par.curve, par.tmin, par.tmax, par.radius, par.tseg, par.rseg, par.repeat);
    if (par.mode == "surf")
        geom = new SurfGeometry(par.surf, par.umin, par.umax, par.vmin, par.vmax, par.useg, par.vseg, par.repeat);
    if (par.mode == "round")    
        geom = makeGeometry(par.boxparams);

    //const geom = new CurveGeometry(circ, 0, 2*Math.PI, 0.4, 200, 20);
    //const geom = new CurveGeometry(tennis, 0, 2*Math.PI, 0.8, 200, 80, 6);
    //const geom = new CurveGeometry(liss, 0, 10*Math.PI, 0.4, 1000, 100, 50);
    //const geom = new CurveGeometry(trefoil, 0, 2*Math.PI, 0.4, 200, 20, 6);

    //const geom = new SurfGeometry(sine, 0, 2*Math.PI, 0, 2* Math.PI, 100, 100);
    //const geom = new SurfGeometry(shell, 0, 14*Math.PI, 0, 2* Math.PI, 1000, 100, 8);

    if (me)
        scene.remove(me);
    if (me2)
        scene.remove(me2);

    me2 = null;
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
    let a = 3., b = 1., c = 2. * Math.sqrt(a * b), x = a * Math.cos(t) + b * Math.cos(3. * t), y = a * Math.sin(t) - b * Math.sin(3. * t), z = c * Math.sin(2. * t);
    return new THREE.Vector3(x, y, z);
}
function circ(t) {
    let a = 1;
    return new THREE.Vector3(Math.cos(t) * a, Math.sin(t) * a, 0);
}

function trefoil(t) {
    let a = 5;
    return new THREE.Vector3(Math.sin(t) + 2. * Math.sin(2. * t), Math.cos(t) - 2. * Math.cos(2. * t), -1 * Math.sin(3. * t));
}

function liss(t) {
    let a = 3., b = 3., c = 2.5, n = 1.2, m = 2., f = Math.PI / 2., e = .0;
    return new THREE.Vector3(a * Math.sin(t), b * Math.sin(n * t + f), c * Math.sin(m * t + e));
}

function klein(u, v)
{
    
    let a = 3., b = 4., c = 2., r, x, y, z;
    if (u < Math.PI)
    {
        r = c*(1. - Math.cos(u)/2.);
        x = Math.cos(u)*(a*(1.+Math.sin(u)) + r*Math.cos(v));
        y = Math.sin(u)*(b + r*Math.cos(v));
        z = r*Math.sin(v);
    }
    
    else
    {
        r = c*(1. - Math.cos(u)/2.);
        x = Math.cos(u)*a*(1.+Math.sin(u)) - r*Math.cos(v);
        y = Math.sin(u)*b;
        z = r*Math.sin(v);
    }
    
    return new  THREE.Vector3(x, y, z);
    

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
