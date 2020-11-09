
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    center: cc.Node = null;

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        
    }

    onTouchStart(e:cc.Event.EventTouch){
        
        let pos = e.getLocation();
        let _pos = this.node.convertToNodeSpaceAR(pos);
        this.player.setPosition(_pos)
        this.resetAngle();
    }
    onTouchMove(e:cc.Event.EventTouch){
        let delta = e.getDelta();
        this.player.setPosition(this.player.getPosition().add(delta))
        this.resetAngle();
    }


    resetAngle(){
        // 中心点
        let center_pos = this.center.convertToWorldSpaceAR(cc.Vec2.ZERO);
        // 物体坐标点
        let player_pos = this.player.convertToWorldSpaceAR(cc.Vec2.ZERO);

        let v = player_pos.sub(center_pos).normalize();
        // 角度变化以y轴正方向为起点，逆时针角度递增
        this.player.angle = cc.v2(0, 1).signAngle(v) * 180 / Math.PI + 180;
    }


    // update (dt) {}
}
