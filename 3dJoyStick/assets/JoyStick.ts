import { _decorator, Component, Node, UITransform, UITransformComponent, EventTouch, Vec3, macro, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoyStick')
export class JoyStick extends Component {

        public static ins:JoyStick = null;

        /** 摇杆最大移动半径 */
        @property({  displayName: '摇杆活动半径' })
        maxR: number = 105;

        @property({type:Node,displayName:"中心点"})
        centerPoint:Node = null;

        uITransform:UITransform = null;

        /**摇杆方向 */
        dir:Vec3 = v3();
        /**摇杆角度 */
        angle:number = 0;

    start () {
        this.reset();
    }

    onLoad(){
        JoyStick.ins = this;

        this.uITransform = this.getComponent(UITransformComponent);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

     reset() {
        this.dir = v3();
        this.centerPoint.setPosition(v3());
    }

    onTouchStart(e: EventTouch) {
        this.onTouchMove(e);
    }

    onTouchMove(e: EventTouch) {
        const location = e.getUILocation();
        // 坐标转换
        let pos = this.uITransform.convertToNodeSpaceAR(new Vec3(location.x, location.y));
        // 根据半径限制位置
        this.clampPos(pos);
        // 设置中间点的位置
        this.centerPoint.setPosition(pos.x, pos.y, 0);
        // 算出与(1,0)的夹角
        this.angle = this.covertToAngle(pos);
        this.dir = pos;
    }

    onTouchEnd(e: EventTouch) {
        this.reset();
    }

    /** 根据半径限制位置 */
    clampPos(pos: Vec3) {
        let len = pos.length();
        if (len > this.maxR) {
            let k = this.maxR / len;
            pos.x *= k;
            pos.y *= k;
        }
    }

    /** 根据位置转化角度 */
    covertToAngle(pos: Vec3) {
        let angle = Math.atan2(pos.y, pos.x);
        return angle * macro.DEG;
    }

}
