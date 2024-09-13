import { Vector3, Vector2 } from "three";
import * as roma from "./roma"
class SDF {
  static roma(x, y, z) {
    return roma.map(x, y, z);
  }
}
export { SDF }