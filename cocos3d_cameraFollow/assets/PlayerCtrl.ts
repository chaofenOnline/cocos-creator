import { _decorator, Component, Node, SystemEventType, systemEvent, EventKeyboard, Vec2, macro, Vec3, Quat, misc, lerp, director, clamp01, Director, RigidBody, CCObject, v3, SystemEvent } from 'cc';
import { CameraFollow } from './CameraFollow';
const { ccclass, property } = _decorator;

const _v3 = new Vec3();
const _quat = new Quat();
const _euler = new Vec3();
const _position = new Vec3();

/**状态处理接口 */
interface StateHandler {
    /**进入状态回调 */
    enter?: Function,
    /**离开状态回调 */
    leave?: Function,
    /**状态帧事件 */
    update?: Function
}

enum DIRECTION {
    NONE = 0,
    FORWARD = -1,
    BACKWORD = 1,
}

@ccclass('PlayerCtrl')
export class PlayerCtrl extends Component {

    /**方向向量 */
    private _velocity: Vec3 = new Vec3();

    @property({ type: RigidBody })
    rigid: RigidBody = null;
    /**移动速度 */
    @property({ displayName: "移动速度" })
    moveSpeed: number = 2;
    /**最大移动速度 */
    @property({ displayName: "最大移动速度" })
    maxMoveSpeed: number = 2;
    /**加速度时间 */
    @property({ displayName: "加速度时间" })
    AccelerationTime: number = 2;

    /**转弯速度 */
    @property({ displayName: "转弯速度" })
    ratateSpeed: number = 2;
    /**移动以及转弯插值阻尼 */
    @property({ displayName: "插值阻尼" })
    damp: number = 0.1;

    @property(Node)
    cube: Node = null;

    /**当前速度 */
    _moveSpeed: number = 0;
    _accelerationTime: number = 0
    moving: number = 0;

    dirction: DIRECTION = DIRECTION.NONE;



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
            if (this.dirction !== DIRECTION.FORWARD) {
                this.dirction = DIRECTION.FORWARD;
                this._accelerationTime = 0
            }
        } else if (event.keyCode == macro.KEY.a) {
            this._velocity.x = 1;
        } else if (event.keyCode == macro.KEY.s) {
            this._accelerationTime = 0
            this._velocity.z = -1;
            this.dirction = DIRECTION.BACKWORD;
            this.moving = 1;
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
            if (this.dirction === DIRECTION.FORWARD) {
                this.dirction = DIRECTION.NONE;
                this._accelerationTime = 0

            }
            this.moving = 0;
            this._velocity.z = 0;
        } else if (event.keyCode == macro.KEY.a) {
            this._velocity.x = 0;
        } else if (event.keyCode == macro.KEY.s) {
            if (this.dirction === DIRECTION.BACKWORD) {
                this.dirction = DIRECTION.NONE;
            }
            this.moving = 0;
            this._accelerationTime = 0;
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
        // if(this.dirction === DIRECTION.NONE)return
        // this.node.setPosition(this.node.getPosition().add())
        this._accelerationTime += dt;
        let r = this._accelerationTime / this.AccelerationTime;
        // this._moveSpeed = lerp(this._moveSpeed,this.maxMoveSpeed * this.dirction,clamp01(r))

        // console.log(this._moveSpeed)

        // this.node.translate(new Vec3(0, 0, this.moveSpeed * this.dirction * dt))

        // this.node.translate(new Vec3(0,0,-1 * dt))


        // if (this.maxMoveSpeed) {
        //     this._accelerationTime += dt;
        //     if (this.moving) {
        //         this._moveSpeed = lerp(0, this.maxMoveSpeed, this._accelerationTime / this.AccelerationTime);
        //     } else {
        //         this._moveSpeed = lerp(this._moveSpeed, 0, this._accelerationTime / this.AccelerationTime);
        //     }
        // } else {
        //     this._moveSpeed = this.moveSpeed;
        // }

        Quat.fromEuler(_quat, 0, this.node.eulerAngles.y, 0);
        // 只考虑z轴移动
        Vec3.transformQuat(_v3, new Vec3(0, 0, this.dirction * this.moveSpeed), _quat);
        console.log({ ...v3 })
        // 移动增幅
        Vec3.scaleAndAdd(_position, this.node.position, _v3, 1);
        // 插值
        Vec3.lerp(_v3, this.node.position, _position, dt / this.damp);

        this.node.setPosition(_v3);
        // console.log(this._moveSpeed)
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
        // CameraFollow.ins.update(deltaTime);
    }
}
