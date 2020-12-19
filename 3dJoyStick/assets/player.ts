import { _decorator, Component, Node, CameraComponent, Vec3, v3, macro } from 'cc';
import { JoyStick } from './JoyStick';
const { ccclass, property } = _decorator;

const vector = v3();
@ccclass('Player')
export class Player extends Component {

    @property({type:Node,displayName:"模型"})
    modelNode:Node = null;

    @property({ type: CameraComponent })
    camera: CameraComponent = null;

    @property({ displayName: "移动速度" })
    moveSpeed:number = 10;

    dir: Vec3 = v3();
    start() {
        // Your initialization goes here.
    }

    update(deltaTime: number) {
        if(JoyStick.ins.dir.length()){
            // 根据摄像机的角度旋转
            Vec3.rotateZ(vector, JoyStick.ins.dir, Vec3.ZERO, this.camera.node.eulerAngles.y * macro.RAD);
            this.dir = vector.normalize();
            // 模型旋转 模型初始朝前，补个90度
            this.modelNode.eulerAngles = new Vec3(0, JoyStick.ins.angle + 90 + this.camera.node.eulerAngles.y, 0);
            // 人物移动
            this.node.setPosition(this.node.position.add3f(this.dir.x * this.moveSpeed * deltaTime, 0, -this.dir.y * this.moveSpeed * deltaTime));
        }

    }
}
