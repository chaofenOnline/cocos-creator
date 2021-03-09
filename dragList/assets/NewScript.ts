// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

   @property({type:cc.Node})
   content:cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // 是否拖拽中
    isDrag:boolean = false;
    // 坐标集合
    posArr:cc.Vec2[] = [];

    start () {
        this.content.children.forEach((e:cc.Node,i:number)=>{
            // 记录子节点坐标 用于还原
            this.posArr.push(e.getPosition())

            e.name = i.toString();
            e.getComponent(cc.Label).string = i.toString();

            e.on(cc.Node.EventType.TOUCH_START,(event)=>{
                this.itemTouchStart(e);
            },this)
            e.on(cc.Node.EventType.TOUCH_END,(event)=>{
               this.itemTouchEnd(e,i)
            },this)
            e.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
                this.itemTouchEnd(e,i)
            },this)
            e.on(cc.Node.EventType.TOUCH_MOVE,(event:cc.Event.EventTouch)=>{
                this.itemTouchMove(event,e)
            },this)
        })

    }

    // 点击开始  改变颜色
    itemTouchStart(node:cc.Node){
        node.color = cc.Color.RED;
    }

    // 点击结束 恢复颜色
    itemTouchEnd(node:cc.Node,i:number){
        node.color = cc.Color.BLACK;
        // 从拖拽状态还原
        if(this.isDrag){
            this.isDrag = false;
            // 恢复原父节点 同级索引 坐标
            node.parent = this.content;
            node.setSiblingIndex(i);
            node.setPosition(this.posArr[i])
            // 恢复滚动
            this.node.getComponent(cc.ScrollView).vertical = true;
        }
    }

    // 触摸移动
    itemTouchMove(event:cc.Event.EventTouch,node:cc.Node){
        let disX = event.getLocation().x - event.getStartLocation().x;
        let disY = event.getLocation().y - event.getStartLocation().y;

        // 进入拖拽状态
        if(Math.abs(disY) <= 10 && Math.abs(disX) >= 10){
            console.log("拖拽")
            this.isDrag = true;
            // 禁用滚动
            this.node.getComponent(cc.ScrollView).vertical = false;
        }

        if(this.isDrag){
            // 当前拖拽节点操作 ==》 提升层级
            let parentNode = cc.find("Canvas");
            let pos = parentNode.convertToNodeSpaceAR(event.getLocation());
            node.parent = parentNode;
            node.setPosition(pos)
        }
    }

    // update (dt) {}
}
