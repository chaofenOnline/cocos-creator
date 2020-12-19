import { _decorator, Component, Node, SystemEvent, systemEvent, Quat, Vec3, director, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TapRotate')
export class TapRotate extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.callback, this)

    }

    
callback(touch,EventTouch:EventTouch) {
    let dif = EventTouch.getDelta();
    let q_tmp = new Quat();
    dif = dif.multiplyScalar(0.5)
    // let v_tmp = new Vec3(-dif.y, dif.x, 0);
    let v_tmp = new Vec3(dif.y, -dif.x, 0);
    v_tmp.normalize();
    let out_Q = Quat.rotateAround(q_tmp, this.node.rotation, v_tmp, Math.PI * 0.01);
    
    Quat.slerp(out_Q, this.node.rotation, out_Q, director.getDeltaTime() / 0.2);

    this.node.setRotation(out_Q.x, out_Q.y, out_Q.z, out_Q.w);
}

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
