import Stater from "./Stater";

const {ccclass, property, menu, mixins} = cc._decorator;


/**
 * !#zh 
 * @class StaterProp
 */
@ccclass
@menu("base/StaterProp")
export default class StaterProp extends Stater {
    
    @property(cc.Node)
    targetNode:cc.Node = null

    @property
    compName = ""

    @property
    propName = ""

    @property
    get curValue(){
        let targetNode = this.targetNode || this.node
        if (this.compName) {
            let comp = targetNode.getComponent(this.compName)
            if (!comp) {
                return null
            }
            if (this.propName in comp) {
                return comp[this.propName]
            }
            return null
        }
        if (this.propName in targetNode) {
            return targetNode[this.propName]
        }
    }

    @property([cc.Float])
    numbers:number[] = []

    @property([cc.String])
    strings:number[] = []

    protected onStateChanged(oldState){
        let target = this.getTarget()
        if (!target) {
            return
        }
        if (!this.propName || this.propName in target == false) {
            return
        }
        target[this.propName] = this.getValToProp()
    }

    protected getValToProp():any{
        return this._getPropVal()
    }

    private _getPropVal(){
        let val = this.numbers[this.state]
        if (cc.js.isNumber(val)) {
            return val
        }
        val = this.strings[this.state]
        if (cc.js.isString(val)) {
            return val
        }
        return null
    }

    getTarget(){
        let targetNode = this.targetNode || this.node
        if (this.compName) {
            let comp = targetNode.getComponent(this.compName)
            return comp
        }
        return targetNode
    }
}
