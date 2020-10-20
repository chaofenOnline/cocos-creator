// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    motionstreak: cc.Node = null;

    @property(cc.EditBox)
    jumpTimeInput: cc.EditBox = null;
    @property(cc.Label)
    lbl: cc.Label = null;
    @property
    text: string = 'hello';

    /**跳跃时间 */
    jump_time: number = 1;
    /**跳跃时间增量时间总和 */
    jump_dt: number = 0;
    /**跳跃高度 */
    jump_height: number = 300;
    /**跳跃宽度 */
    jump_width: number = 300;
    /**当前跳跃方向 */
    dir: number = 1;
    /**最左 */
    minX = 0;
    /**最右 */
    maxX = 0;
    /**起跳前位置 */
    pos = cc.v2(0, 0);

    /**帧事件开关 */
    fire: boolean = false;

    start() {
        this.pos = this.node.getPosition();
        this.minX = -cc.winSize.width / 2 + this.node.width / 2;
        this.maxX = cc.winSize.width / 2 - this.node.width / 2;
        this.motionstreak.setPosition(this.pos)
        this.motionstreak.getComponent(cc.MotionStreak).fadeTime = this.jump_time * 2
        this.lbl.string = "开始"
        this.fire = true;
    }

    /**
     * 跳跃时长输入框
     * @param edit 
     */
    changeJumpTime(edit) {
        if (edit.string != "") {
            // 获取上次时间进度
            let preJumpDtRate = this.jump_dt / this.jump_time;
            this.jump_time = parseFloat(edit.string)
            // 等比例还原进度
            this.jump_dt = preJumpDtRate * this.jump_time;

            // 新增拖尾 用于显示上次移动轨迹
            let newStreak = cc.instantiate(this.motionstreak);
            cc.find("Canvas").addChild(newStreak)
            newStreak.getComponent(cc.MotionStreak).fadeTime = this.jump_time * 2;
            this.motionstreak = newStreak;

        }
    }

    update(dt) {
        if (!this.fire) return;

        // 累加增量
        this.jump_dt += dt;
        // 跳跃时间进度
        let pro = this.jump_dt / this.jump_time;
        // 计算曲线x从-1到1之间的插值
        let x = cc.misc.lerp(-1, 1, cc.misc.clamp01(pro))
        // 计算曲线y值
        let y = 1 - Math.pow(Math.abs(x), 3);

        // 下一个位置
        let next_y = this.pos.y + y * this.jump_height;
        let next_x = this.pos.x + pro * this.jump_width * this.dir;
        this.node.setPosition(cc.misc.clampf(next_x,this.minX,this.maxX), next_y)
        this.motionstreak.setPosition(this.node.getPosition())

        // 跳跃完成
        if (pro >= 1) {
            this.lbl.string = "完成"
            this.fire = false;
            this.jump_dt = 0;
            this.pos = this.node.getPosition();
            // 达到边界位置，换方向
            if(this.node.x >= this.maxX || this.node.x <= this.minX){
                this.dir *= -1;
            }
            this.scheduleOnce(() => {
                this.lbl.string = "开始"
                this.fire = true;
            }, 1)
        }
    }
}
