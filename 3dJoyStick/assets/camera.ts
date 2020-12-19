import { _decorator, Component, Node, systemEvent, SystemEvent, v2, v3, clamp, Quat, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
const v2_1 = v2();
const v2_2 = v2();
const qt_1 = new Quat();

@ccclass('Camera')
export class Camera extends Component {
    

    @property({type:Node})
    cameraNode:Node = null;

    @property({ displayName: "旋转速度" })
    public rotateSpeed = 0.1;
    
    @property({ displayName: "阻尼系数", slide: true, range: [0.05, 0.5, 0.01] })
    public damp = 0.2;

    /**摄像机旋转欧拉角 */
    _euler = v3();

    onLoad(){
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    start () {
        Vec3.copy(this._euler, this.node.eulerAngles);

    }

    onTouchStart(){}
    public onTouchMove(e) {
        // e.getStartLocation(v2_1);

        // just rotation
        e.getDelta(v2_2);
        this._euler.y -= v2_2.x * this.rotateSpeed;
    }
    onTouchEnd(){}

    /**
     * 摄像机旋转
     * @param dt 
     */
    public CameraUpdate(dt) {
        Quat.fromEuler(qt_1, this._euler.x, this._euler.y, this._euler.z);
        Quat.slerp(qt_1, this.node.rotation, qt_1, dt / this.damp);
        this.node.setRotation(qt_1)
    }


    update (deltaTime: number) {
        deltaTime = Math.min(deltaTime,1/60);
        this.CameraUpdate(deltaTime)
    }
}
