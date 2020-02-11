import * as THREE from "three";
import MinuteSecondType from "../../types/MinuteSecondType";
import SecondText from "../component/SecondText";
import easing from "../system/easing";
import Canvas from "../../Canvas";
import RotationSetting from "../../types/RotationSetting";

class SecondColumn {
  private _group: THREE.Group;
  private _canvas: Canvas | null;
  private _scene: THREE.Scene | null;
  private _nowSecond: MinuteSecondType | null;
  private _startSecond: MinuteSecondType | null;
  private _secondObjs: SecondText[];
  private _rotationSetting: RotationSetting;
  constructor() {
    this._group = new THREE.Group();
    this._canvas = null;
    this._scene = null;
    this._nowSecond = null;
    this._startSecond = null;
    this._secondObjs = [];
    this._rotationSetting = {
      rotationFlag: false,
      direction: ""
    };
  }

  private _increaseOneSecond() {
    if (this._nowSecond != null) {
      this._rotationSetting = {
        rotationFlag: true,
        direction: "down"
      };
      this._nowSecond++;
    } else {
      console.log("SecondColumnのnowSecondが設定されていません。");
    }
  }

  private _decreaseOneSecond() {
    if (this._nowSecond != null) {
      this._rotationSetting = {
        rotationFlag: true,
        direction: "up"
      };
      this._nowSecond--;
    } else {
      console.log("MinuteColumnのnowSecondが設定されていません。");
    }
  }

  public init(canvas: Canvas, scene: THREE.Scene, nowSecond: MinuteSecondType) {
    this._scene = scene;
    this._canvas = canvas;
    this._nowSecond = nowSecond;
    this._startSecond = nowSecond;
    for (let i = 0; i < 60; i++) {
      const secondText = new SecondText(i as MinuteSecondType, this._nowSecond);
      this._secondObjs.push(secondText);
      this._group.add(secondText);
    }
    this._scene.add(this._group);
    this._startSetTime();
  }

  public startCount() {
    setInterval(() => {
      this._decreaseOneSecond();
    }, 1000);
    this._decreaseOneSecond();
  }

  private _startSetTime() {
    window.addEventListener("wheel", e => {
      console.log("canvasPositionX", (this._canvas as Canvas).positionX);
      if (
        this._canvas !== null &&
        this._canvas.positionX < 200 &&
        this._canvas.positionX > 32
      )
        if (e.deltaY < 0) {
          this._decreaseOneSecond();
        } else {
          this._increaseOneSecond();
        }
    });
  }

  public get nowSecond() {
    if (this._nowSecond !== null) {
      return this._nowSecond % 60;
    } else {
      console.log("SecondColumnで_nowSecondが設定されていません");
      return 0;
    }
  }

  public tick() {
    if (
      this._rotationSetting.rotationFlag &&
      this._nowSecond != null &&
      this._startSecond != null
    ) {
      const targetLocation =
        (this._startSecond - this._nowSecond) * ((2 * Math.PI) / 60);

      if (this._rotationSetting.direction === "up") {
        this._group.rotation.x += easing(
          this._group.rotation.x,
          targetLocation
        );
        if (targetLocation - this._group.rotation.x < 0.0001) {
          this._rotationSetting = {
            rotationFlag: false,
            direction: ""
          };
        }
      } else if (this._rotationSetting.direction === "down") {
        this._group.rotation.x += easing(
          this._group.rotation.x,
          targetLocation
        );
        if (this._group.rotation.x - targetLocation < 0.0001) {
          this._rotationSetting = {
            rotationFlag: false,
            direction: ""
          };
        }
      } else {
        this._rotationSetting.rotationFlag = false;
      }
    }
  }
}

export default SecondColumn;
