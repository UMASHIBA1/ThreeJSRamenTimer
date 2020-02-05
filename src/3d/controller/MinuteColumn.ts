import * as THREE from "three";
import MinuteText from "../component/MinuteText";
import MinuteSecondType from "../../types/MinuteSecondType";
import easing from "../system/easing";

interface RotationSetting {
  rotationFlag: boolean;
  direction: "up" | "down" | "";
}

class MinuteColumn {
  private group: THREE.Group;
  private scene: THREE.Scene | null;
  private nowMinute: MinuteSecondType | null;
  private startMinute: MinuteSecondType | null;
  private minuteObjs: MinuteText[];
  private rotationSetting: RotationSetting;
  constructor() {
    this.group = new THREE.Group();
    this.scene = null;
    this.nowMinute = null;
    this.startMinute = null;
    this.minuteObjs = [];
    this.rotationSetting = { rotationFlag: false, direction: "" };
  }

  private _upOneMinute() {
    if (this.nowMinute != null) {
      this.rotationSetting = {
        rotationFlag: true,
        direction: "up"
      };
      this.nowMinute++;
    } else {
      console.log("MinuteColumnのnowMinuteが設定されていません。");
    }
  }

  private _downOneMinute() {
    if (this.nowMinute != null) {
      this.rotationSetting = {
        rotationFlag: true,
        direction: "down"
      };
      this.nowMinute--;
    } else {
      console.log("MinuteColumnのnowMinuteが設定されていません。");
    }
  }

  public init(scene: THREE.Scene, nowMinute: MinuteSecondType) {
    this.scene = scene;
    this.nowMinute = nowMinute;
    this.startMinute = nowMinute;
    for (let i = 0; i < 60; i++) {
      const minuteText = new MinuteText(i as MinuteSecondType, this.nowMinute);
      this.minuteObjs.push(minuteText);
      this.group.add(minuteText);
    }
    this.scene.add(this.group);
    this.startSetTime();
  }

  public startCount() {
    setInterval(() => {
      this._upOneMinute();
    }, 60000);
    this._upOneMinute();
  }

  public startSetTime() {
    window.addEventListener("wheel", e => {
      if (e.deltaY < 0) {
        this._upOneMinute();
      } else {
        this._downOneMinute();
      }
    });
  }

  public tick() {
    console.log(this.nowMinute);
    if (
      this.rotationSetting.rotationFlag &&
      this.nowMinute != null &&
      this.startMinute != null
    ) {
      const targetLocation =
        (this.nowMinute - this.startMinute) * ((2 * Math.PI) / 60);
      if (this.rotationSetting.direction === "up") {
        this.group.rotation.x += easing(this.group.rotation.x, targetLocation);
        if (targetLocation - this.group.rotation.x < 0.0001) {
          console.log("upStop");
          this.rotationSetting = {
            rotationFlag: false,
            direction: ""
          };
        }
      } else if (this.rotationSetting.direction === "down") {
        this.group.rotation.x += easing(this.group.rotation.x, targetLocation);
        if (this.group.rotation.x - targetLocation < 0.0001) {
          console.log("downStop");
          this.rotationSetting = {
            rotationFlag: false,
            direction: ""
          };
        }
      } else {
        this.rotationSetting.rotationFlag = false;
      }
    }
  }
}

export default MinuteColumn;
