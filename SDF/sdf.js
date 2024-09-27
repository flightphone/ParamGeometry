import { Vector3, Vector2 } from "three";
import * as roma from "./roma"
class SDF {
  static roma(x, y, z) {
    return roma.map(x, y, z);
  }
  static cyls(x, y, z)
  {
    return roma.cylinder2(new Vector3(x, y, z));
  }
}
export { SDF }