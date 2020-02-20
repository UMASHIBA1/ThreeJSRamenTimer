import * as THREE from "three";
import MultiRing from "./MultiRing";
import { risedLocation } from "../../settings/finishAnimation";
import easeOut from "../system/easing";
import MyCamera from "../MyCamera";
import FinishTextController from "./FinishTextController";
import OKButton from "../component/OKButton";

class FinishAnimation {
  private _startRedRingAnimation: boolean;
  private _ring: MultiRing;
  private _finishTextController: FinishTextController;
  private _myCamera: MyCamera;
  private _okButton: OKButton;
  constructor(scene: THREE.Scene, myCamera: MyCamera) {
    this._startRedRingAnimation = false;
    this._ring = new MultiRing(400, 10, 30, 10, 0.7);
    this._ring.setPositionXY(0, risedLocation);
    this._ring.setScaleXY(0, 0);
    this._ring.addToScene(scene);
    this._finishTextController = new FinishTextController(scene);
    this._myCamera = myCamera;
    this._okButton = new OKButton(this._myCamera.camera);
    scene.add(this._okButton);
  }

  public startAnimation() {
    this._myCamera.riseCamera().then(() => {
      this._startRedRingAnimation = true;
      // RedRingのアニメーションにかかる時間を600msとしてFinishTextのアニメーションを待たせる
      setTimeout(() => {
        this._finishTextController.startAnimation().then(() => {
          this._okButton.startAppearAnimation();
        });
      }, 600);
    });
  }

  public tick() {
    this._finishTextController.tick();
    this._ring.tick();
    this._okButton.tick();
    if (this._startRedRingAnimation) {
      const { x, y } = this._ring.scaleXY;
      this._ring.setScaleXY(x + easeOut(x, 1), y + easeOut(y, 1));
      if (x >= 1 || y >= 1) {
        this._startRedRingAnimation = false;
      }
    }
  }
}

export default FinishAnimation;
