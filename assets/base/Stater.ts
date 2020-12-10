const {ccclass, property, menu, mixins} = cc._decorator;


/**
 * !#zh 
 * @class Stater
 */
@ccclass
@menu("base/Stater")
export default class Stater extends cc.Component {

    @property
    bindState = ""

    @property(cc.Integer)
    _state = 0

    @property({type:cc.Integer})
    get state(){
        return this._state
    }

    set state(val){
        let newVal = this.onSetState(val)
        let oldVal = this._state
        this._state = newVal
        if (oldVal !== newVal) {
            for (const n of this.subStaters) {
                if (n) {
                    for (const s of n.getComponents(Stater)) {
                        this.state = this._state
                    }
                }
            }
            this.onStateChanged(oldVal)
        }
    }

    @property([Stater])
    subStaters:Stater[] = []

    protected onSetState(state:number):number{
        return state
    }

    protected onStateChanged(oldState){
        
    }
}
