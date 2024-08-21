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
            let x = Math.sin(i + 0.98 * time * (1.03 + 0.5 * Math.cos(1.51 * i)))*0.5;
            let y = (Math.cos(i + 1.17 * time * Math.cos(1.22 + 1.1424 * i)))*0.5; // dip into the floor //Math.abs
            let z = Math.cos(i + 1.1 * time * 0.1 * Math.sin((0.92 + 1.43 * i)))*0.5;
            charge.push({ x: Balls.r*x, y: Balls.r*y, z: Balls.r*z, q: 0.55 });
        }
    }
}

export {Balls}