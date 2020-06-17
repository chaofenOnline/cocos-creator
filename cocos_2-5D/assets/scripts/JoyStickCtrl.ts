import ShipCtrl from "./ShipCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({ type: cc.Node, displayName: "摇杆按钮" })
    point: cc.Node = null;

    /**Canvas 节点 */
    canvasNode: cc.Node = null;

    /**方向：摇杆按钮坐标归一化向量 */
    dir: cc.Vec2 = null;

    moving: boolean = false;

    onEnable() {
        this.canvasNode = cc.find("Canvas");
        this.canvasNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.canvasNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.canvasNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.canvasNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    /**
     * 点击屏幕
     * @param e 
     */
    onTouchStart(e: cc.Event.EventTouch) {
        let pos = this.canvasNode.convertToNodeSpaceAR(e.getLocation());
        this.node.setPosition(pos);
    }

    /**
     * 点击移动
     * @param e 
     */
    onTouchMove(e: cc.Event.EventTouch) {
        // this.moving = true;
        // 获取移动幅度
        let delta = e.getDelta();
        // this.point.setPosition(this.point.getPosition().add(delta));

        let target_pos = this.point.getPosition().add(delta);
        // 获取目标坐标向量长度
        let len = target_pos.mag();
        // 最大可移动距离
        let maxLen = this.node.width / 2;
        // 目标移动距离与最大可移动距离的比例
        let rate = len / maxLen;
        if (rate > 1) {
            // 移动超出最大距离，进行等比例修正
            target_pos = target_pos.div(rate);
        }
        this.point.setPosition(target_pos);

        // 弧度
        let rad = cc.v2(0, 1).signAngle(this.point.getPosition().normalize()) ;
        // let angle = cc.v2(1, 0).signAngle(this.point.getPosition().normalize()) * 180 / Math.PI;
        // console.log("摇杆角度:", angle)
        ShipCtrl.ins.move(true,rad);
        // this.dir = delta.normalize();
    }

    /**
     * 点击完成
     */
    onTouchEnd() {
        ShipCtrl.ins.move(false);

        // this.moving = false;
        this.point.setPosition(cc.v2(0, 0));
    }

    /**
     * 点击取消
     */
    onTouchCancel() {
        ShipCtrl.ins.move(false);
        this.point.setPosition(cc.v2(0, 0))
    }
    start() {

    }

    // update(dt) {
    //     if (!this.moving) return;
    //     let target_pos = this.point.getPosition();
    //     // 获取目标坐标向量长度
    //     let len = target_pos.mag();
    //     // 最大可移动距离
    //     let maxLen = this.node.width / 2;
    //     // 目标移动距离与最大可移动距离的比例
    //     let rate = len / maxLen;
    //     if (rate > 1) {
    //         // 移动超出最大距离，进行等比例修正
    //         target_pos = target_pos.div(rate);
    //         // 修正按钮坐标
    //         this.point.setPosition(target_pos);
    //     }



    //     // 船只移动
    //     // let dis = this.dir.mul(ShipCtrl.ins.maxSpeed * rate);
    //     // ShipCtrl.ins.addPos(dis);




    //     // let angle = cc.v2(0, 1).signAngle(this.point.position.normalize()) * 180 / Math.PI;
    //     //  console.log(angle)
    //     //  ShipCtrl.ins.setAngle(angle);


    // }
}
