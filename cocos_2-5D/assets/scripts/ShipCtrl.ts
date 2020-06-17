// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShipCtrl extends cc.Component {

    /**脚本单例对象 */
    static ins: ShipCtrl = null;

    /**3D 模型 */
    @property({ type: cc.Node, displayName: "3D模型节点" })
    ship3D: cc.Node = null;

    @property(cc.Node)
    nameNode:cc.Node = null;

    @property({ type: cc.Integer, displayName: "移动速度" })
    speed: number = 1;

    /**Canvas 节点 */
    canvasNode: cc.Node = null;
    /**最小移动边界 */
    min_inclusive: cc.Vec2 = null;
    /**最大移动边界 */
    max_inclusive: cc.Vec2 = null;
    /**是否移动中 */
    moving: boolean = false;
    /**3d模型初始角度四元数 */
    init_quat: cc.Quat = cc.quat();
    /**当前旋转弧度 */
    radian: number = 0;

    onLoad() {
        ShipCtrl.ins = this;
        this.canvasNode = cc.find("Canvas");

        // 可移动范围
        this.min_inclusive = cc.v2(-this.canvasNode.width / 2 + this.node.height / 2, -this.canvasNode.height / 2 + this.node.height / 2)
        this.max_inclusive = cc.v2(this.canvasNode.width / 2 - this.node.height / 2, this.canvasNode.height / 2 - this.node.height / 2)

        // 初始化3d模型角度四元素
        this.ship3D.getRotation(this.init_quat);
    }

    /**
     * 移动事件
     * @param moving 移动状态
     * @param rad 旋转弧度
     */
    move(moving = false, rad?) {
        if (rad !== undefined) {
            this.radian = rad;
            // 设置当前节点角度
            this.node.angle = rad * 180 / Math.PI;
        }
        this.moving = moving;
    }

    /**
     * 模型旋转
     */
    updateModelEuler() {
        let q = cc.quat();
        cc.Quat.fromAxisAngle(q, cc.v3(0, 1, 0), this.radian);
        cc.Quat.multiply(q, this.init_quat, q)
        this.ship3D.setRotation(q);
    }

    update(dt) {
        if (this.moving) {
            let angle = this.node.angle;
            let moveDist = this.speed * dt;
            let x = Math.cos((angle + 90) * Math.PI / 180);
            let y = Math.sin((angle + 90) * Math.PI / 180);
            let toPos = this.node.getPosition().add(cc.v2(x, y).mulSelf(moveDist));
            toPos = toPos.clampf(this.min_inclusive,this.max_inclusive)
            this.node.setPosition(toPos);
            this.nameNode.setPosition(cc.v2(toPos.x,toPos.y+200))
            this.ship3D.position = this.node.position;
            this.updateModelEuler();
        }
    }

}
