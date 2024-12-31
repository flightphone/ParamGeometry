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
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { EdgeSplitModifier } from 'three/addons/modifiers/EdgeSplitModifier.js';
import { models } from './models';

let stlFileName = "";


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
    side: THREE.FrontSide,
    vertexColors: false
});

const materialFunb = new THREE.MeshStandardMaterial({ //new THREE.MeshLambertMaterial({
    roughness: 0.1,
    color: 0xDD1212,
    side: THREE.BackSide,
    vertexColors: false
});



const materialWire = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x000000),
    side: THREE.DoubleSide,
    wireframe: true,

});




const params = {
    model: models[0],
    wireframe: false,
    clip: false,
    update: CreatePanel,
    exportASCII: exportASCII,
    saveScreen: saveScreen,
    load3D: load3D,
    version: "4.5"
}



const gui = new GUI();
gui.add(params, "model", models, 'name').name('Model').onChange(() => CreatePanel(true));
gui.add(params, 'wireframe').name('Wireframe').onChange(() => CreatePanel(true));
gui.add(params, 'clip').name('Clip')
gui.add(params, 'exportASCII').name('Export');
gui.add(params, 'saveScreen').name('Save screen');
gui.add(params, 'load3D').name('Load STL');
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

const input = document.createElement("input");
input.setAttribute("type", "file");
input.style.display = 'none';
input.setAttribute("accept", ".stl");
document.body.appendChild(input);
//=========================init object======================



let controls = new OrbitControls(camera, renderer.domElement);
controls.update();
window.addEventListener('resize', onWindowResize);
onWindowResize();
requestAnimationFrame(render);

function render(time) {
    if (params.clip) {
        let md = Math.floor(time / 3000) % models.length;
        if (md != currentModel) {
            currentModel = md;
            params.model = models[currentModel];
            CreatePanel(true);
        }
    }

    if (params.model.render) {
        params.model.render(time);
        CreatePanel(false);
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
function clearScene() {
    if (me)
        scene.remove(me);
    if (me2)
        scene.remove(me2);
    if (me3)
        scene.remove(me3);
    me2 = null;
}

function CreatePanel(scale = true) {

    let geom = null;
    let par = params.model;
    stlFileName = "";

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

    if (scale) {
        geom.computeBoundingSphere();
        let sc = 5.5 / geom.boundingSphere.radius;
        geom.scale(sc, sc, sc);
    }

    clearScene();

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

function load3D() {
    input.click();
}
input.onchange = (ev) => {
    const file = ev.target.files[0]; // get the file
    if (!file)
        return;
    stlFileName = file.name.replace(".stl", "");
    //console.log(file);
    
    const blobURL = URL.createObjectURL(file);
    clearScene();
    const loader = new STLLoader()
    loader.load(
        blobURL,
        function (geom) {
            const modifier = new EdgeSplitModifier();
            const cutOffAngle = 20 * Math.PI / 180;
            const tryKeepNormals = false;
            const geometry = modifier.modify(geom, cutOffAngle, tryKeepNormals);

            geometry.computeBoundingSphere();
            let sc = 3.5 / geometry.boundingSphere.radius;
            geometry.scale(sc, sc, sc);
            me = new THREE.Mesh(geometry, materialFun)
            me.material.flatShading = false;
            scene.add(me)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
}


function exportASCII() {

    const result = exporter.parse(me);
    saveString(result);

}

function saveScreen() {
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

function saveString(text) {
    let fname = stlFileName?stlFileName:params.model.toString();
    fname = fname + '.obj';
    save(new Blob([text], { type: 'text/plain' }), fname);

}







