import { _decorator, Component, Node, SystemEventType, systemEvent, EventKeyboard, Vec2, macro, Vec3, Quat } from 'cc';
import { CameraFollow } from './CameraFollow';
const { ccclass, property } = _decorator;

const v3 = new Vec3();
const _quat = new Quat();
const _euler = new Vec3();
const _position = new Vec3();
@ccclass('PlayerCtrl')
export class PlayerCtrl extends Component {

    /**方向向量 */
    private _velocity: Vec3 = new Vec3();

    /**移动速度 */
    @property({displayName:"移动速度"})
    moveSpeed: number = 2;
    /**转弯速度 */
    @property({displayName:"转弯速度"})
    ratateSpeed: number = 2;
    /**移动以及转弯插值阻尼 */
    @property({displayName:"插值阻尼"})
    damp: number = 0.1;

    onEnable() {
        systemEvent.on(SystemEventType.KEY_DOWN, this._onKeyDown, this);
        systemEvent.on(SystemEventType.KEY_UP, this._onKeyUp, this);
    }
    onDisable() {
        systemEvent.off(SystemEventType.KEY_DOWN, this._onKeyDown, this);
        systemEvent.off(SystemEventType.KEY_UP, this._onKeyUp, this);
    }

    start() {
        this.node.getRotation().getEulerAngles(_euler);
        this.node.getPosition(_position);
    }

    /**
     * 键盘按下
     * @param event 
     */
    private _onKeyDown(event: EventKeyboard) {
        if (event.keyCode == macro.KEY.w) {
            this._velocity.z = 1;
        } else if (event.keyCode == macro.KEY.a) {
            this._velocity.x = 1;
        } else if (event.keyCode == macro.KEY.s) {
            this._velocity.z = -1;
        } else if (event.keyCode == macro.KEY.d) {
            this._velocity.x = -1;
        }
    }

    /**
     * 键盘抬起
     * @param event 
     */
    private _onKeyUp(event: EventKeyboard) {
        if (event.keyCode == macro.KEY.w) {
            this._velocity.z = 0;
        } else if (event.keyCode == macro.KEY.a) {
            this._velocity.x = 0;
        } else if (event.keyCode == macro.KEY.s) {
            this._velocity.z = 0;
        } else if (event.keyCode == macro.KEY.d) {
            this._velocity.x = 0;
        }
    }

    /**
    * 人物移动
    * @param dt 
    */
    public playerMoveUpdate(dt) {
        Quat.fromEuler(_quat, 0, this.node.eulerAngles.y, 0);
        // 只考虑z轴移动
        Vec3.transformQuat(v3, new Vec3(0, 0, this._velocity.z), _quat);
        // 移动增幅
        Vec3.scaleAndAdd(_position, this.node.position, v3, this.moveSpeed);
        // 插值
        Vec3.lerp(v3, this.node.position, _position, dt / this.damp);
        this.node.setPosition(v3);
    }

    /**
    * 人物旋转
    * @param dt 
    */
    public playerRotateUpdate(dt) {
        // 角度加减
        _euler.y += this._velocity.x * this.ratateSpeed;
        Quat.fromEuler(_quat, _euler.x, _euler.y, _euler.z);
        // 插值
        Quat.slerp(_quat, this.node.rotation, _quat, dt / this.damp);
        this.node.setRotation(_quat)
    }


    update(deltaTime: number) {
        // z 控制前进后退
        this.playerMoveUpdate(deltaTime);
        // x 控制左右旋转
        this.playerRotateUpdate(deltaTime)
        // 相机跟随
        CameraFollow.ins.update(deltaTime);
    }
}
