const {ccclass, property, menu} = cc._decorator;


/**
 * !#zh 
 * @class 
 */
@ccclass
export default class Setter extends cc.Component {

    @property
    get value(){
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
        for (const comp of this.getComponents(cc.Component)) {
            if (this.propName in comp) {
                return comp[this.propName]
            }
        }
    }

    set value(val){
        let value = this.convert(val)
        let target = this.getTarget()
        if (target) {
            target[this.propName] = value
        }
    }

    @property(cc.Node)
    targetNode:cc.Node = null

    @property
    compName = ""

    @property
    propName = ""

    getTarget(){
        let targetNode = this.targetNode || this.node
        if (this.compName) {
            let comp = targetNode.getComponent(this.compName)
            return comp
        }
        if (this.propName in targetNode) {
            return targetNode
        }
        for (const comp of this.getComponents(cc.Component)) {
            if (this.propName in comp) {
                comp
            }
        }
        return targetNode
    }

    convert(val){
        return val
    }
}
