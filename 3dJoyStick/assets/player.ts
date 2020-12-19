import { _decorator, Component, Node, CameraComponent, Vec3, v3, macro, quat, Quat } from 'cc';
import { JoyStick } from './JoyStick';
const { ccclass, property } = _decorator;

const vector = v3();
const rot_q = quat();
const targetRot_q = quat();
@ccclass('Player')
export class Player extends Component {

    @property({type:Node,displayName:"模型"})
    modelNode:Node = null;

    @property({ type: Node })
    cameraNode: Node = null;

    @property({ displayName: "移动速度" })
    moveSpeed:number = 10;

    @property({ displayName: "阻尼系数", slide: true, range: [0.05, 0.5, 0.01] })
    public damp = 0.2;

    dir: Vec3 = v3();
    start() {
        // Your initialization goes here.
    }

    update(deltaTime: number) {
        deltaTime = Math.min(deltaTime,1/60);
        if(JoyStick.ins.dir.length()){
            // 根据摄像机的角度旋转
            Vec3.rotateZ(vector, JoyStick.ins.dir, Vec3.ZERO, this.cameraNode.eulerAngles.y * macro.RAD);
            this.dir = vector.normalize();
            // 获取当前旋转四元素
            this.modelNode.getRotation(rot_q);

            // 模型旋转 模型初始朝前，补个90度
            let targetRot = v3(0, JoyStick.ins.angle -90 + this.cameraNode.eulerAngles.y, 0);    
            // 获取旋转后的四元素
            Quat.fromEuler(targetRot_q,targetRot.x,targetRot.y,targetRot.z);

            // 使用四元素球面插值防止使用欧拉角线性插值时变形
            rot_q.slerp(targetRot_q,deltaTime / this.damp);
            this.modelNode.setRotation(rot_q)
            // this.modelNode.eulerAngles = this.modelNode.eulerAngles.lerp(targetRot, deltaTime / this.damp)

            // 人物移动
            this.node.setPosition(this.node.position.add3f(-this.dir.x * this.moveSpeed * deltaTime, 0, this.dir.y * this.moveSpeed * deltaTime));
        }

    }
}
