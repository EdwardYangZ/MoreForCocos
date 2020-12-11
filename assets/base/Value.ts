import Setter from "./Setter";

const {ccclass, property, menu} = cc._decorator;


/**
 * !#zh 
 * @class 
 */
@ccclass("Value")
export default class Value {

    _value = null

    @property()
    get value(){
        return this._value
    }

    set value(val){
        this._value = val
        for (const setter of this.setters) {
            for (const s of setter.getComponents(Setter)) {
                s.value = val
            }
        }
        this.emit()
    }

    @property([Setter])
    setters:Setter[] = []

    _binders:any[][] = []

    on(callback:Function, target){
        for (const binder of this._binders) {
            if (binder[0] === target) {
                return
            }
        }
        this._binders.push([target, callback])
        callback.call(target, this.value)
    }

    emit(){
        for (const [target, callback] of this._binders) {
            if (cc.isValid(target)) {
                callback.call(target, this.value)
            }
        }
    }
}
