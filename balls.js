import { Vector3 } from "three";
let charge = [];
const n = 5;
 

class Balls {
    static r = 4;

    static potential(x, y, z) {
        let res = 0;
        let v = new Vector3(x, y, z);
        charge.forEach((a) => {
            let d = v.distanceTo(new Vector3(a.x, a.y, a.z));
            res += a.q / d;
        });
        return 1.5 - res;
    }

    static render(time) {
        //time *= 2;
        charge = [];
        for (let i = 0; i < n; i++) {
            let x = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27;
            let y = (Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77; // dip into the floor //Math.abs
            let z = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27;
            charge.push({ x: Balls.r*x, y: Balls.r*y, z: Balls.r*z, q: 0.55 });
        }
    }
}

export {Balls}