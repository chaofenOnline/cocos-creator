import { _decorator, Component, Node, Vec3, director, Director, easing, math, Quat, Mat4, v3 } from "cc";
const { ccclass, property, menu } = _decorator;

const v3_0 = new Vec3();
const _pos = new Vec3();
const _look = new Vec3();

@ccclass("CameraFollow")
@menu("CameraFollow")
export class CameraFollow extends Component {
    /**单例 */
    private static _ins: CameraFollow = null;
    public static get ins() {
        return this._ins;
    }
    private set ins(ins) {
        CameraFollow._ins = ins;
    }


    @property({ type: Node, displayName: "目标节点" })
    lookTarget: Node = null;
    // @property({ displayName: "移动插值比率" })
    // move_lerpRatio: number = 0.1;
    // @property({ displayName: "旋转插值比率" })
    // rotate_lerpRatio: number = 0.2;
    @property({ type: Vec3, displayName: "相机偏移值" })
    cameraOffset: Vec3 = new Vec3();
    @property({ displayName: "插值阻尼" })
    damp: number = 0.2;
    
    onLoad() {
        this.ins = this;
    }

    /**
     * 位置及角度跟随
     */
    update(dt: number) {
        const eulerY = this.lookTarget.eulerAngles.y;
        const _quat = Quat.fromEuler(new Quat(), 0, eulerY, 0);
        const _mat4 = Mat4.fromRT(new Mat4(), _quat, this.lookTarget.worldPosition);
        v3_0.set(this.cameraOffset);
        v3_0.transformMat4(_mat4);
        _pos.lerp(v3_0, dt / this.damp);
        this.node.worldPosition = _pos;

        v3_0.set(this.lookTarget.worldPosition);
        _look.lerp(v3_0, dt / this.damp);
        this.node.lookAt(_look);
    }
}
