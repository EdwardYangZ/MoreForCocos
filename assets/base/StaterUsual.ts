import Stater from "./Stater";

const {ccclass, property, menu} = cc._decorator;


/**
 * !#zh 
 * @class StaterUsual
 */
@ccclass
@menu("base/StaterUsual")
export default class StaterUsual extends Stater {

    @property(cc.Node)
    targetNode:cc.Node = null

    @property([cc.SpriteFrame])
    spriteFrames = []

    @property([cc.Color])
    colors = []

    @property([cc.String])
    strings = []
    
    @property([cc.Boolean])
    actives = []

    @property({
        type: cc.Float,
        tooltip: "旋转角度"
    })
    angles: number[] = []
    
    @property({
        type: cc.Float,
        tooltip: "透明度"
    })
    opacitys: number[] = []
    
    @property({
        type: cc.Float,
        tooltip: "缩放"
    })
    scales: number[] = []

    @property([cc.Vec2])
    positions:Array<cc.Vec2> = []

    @property()
    get savePosition(){
        return false
    }
    set savePosition(val){
        if (CC_EDITOR) {
            this.positions[this.state] = cc.v2(this.node.x, this.node.y)
        }
    }

    protected onStateChanged (){
        let targetNode = this.targetNode || this.node
        let spriteFrame = this.spriteFrames[this.state]
        if (spriteFrame != undefined) {
            targetNode.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }
        let color = this.colors[this.state]
        if (color) {
            targetNode.color = color
        }
        let str = this.strings[this.state]
        if (str != undefined) {
            targetNode.getComponent(cc.Label).string = str
        }
        let active = this.actives[this.state]
        if (typeof active == "boolean") {
            targetNode.active = active
        }
        let pos = this.positions[this.state]
        if (pos) {
            targetNode.setPosition(pos)
        }
        let angle = this.angles[this.state]
        if (angle != undefined) {
            targetNode.angle = angle
        }
        let opacity = this.opacitys[this.state]
        if (opacity != undefined) {
            targetNode.opacity = opacity
        }
        let scale = this.scales[this.state]
        if (scale != undefined) {
            targetNode.scale = scale
        }
    }

    protected start (){
        this.onStateChanged()
    }

}
