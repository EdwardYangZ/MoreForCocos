import Stater from "./Stater";

export declare class State<T> extends cc.EventTarget{
    state:T;
    _stateEnum:(new ()=> T);
    stateNames: string[];
    setState(state:T): T;
    isState(state:T): boolean;
    subStaters:Stater[]
}

export function newState(enumDef) {
    let name = Object.getOwnPropertyNames(enumDef)[0]
    let enumType = enumDef[name]
    let classDef = {
        name:name,
        extends: cc.EventTarget,
        properties: {
            _state: 0,
            state: {
                default: 0,
                type: cc.Integer,
                notify(oldVal){
                    this._state = oldVal
                    cc.log("state", this.state, oldVal)
                    if (this.state === oldVal) {
                        return
                    }
                    this.emit("state", this.state, oldVal)
                    this.emit(this._stateEnum[this.state])
                    this._flushSubStaters()
                }
            },
            curState:{
                get(){
                    return this._stateEnum[this.state]
                }
            },
            _stateEnum: {
                default: ()=>enumType,
            },
            stateNames:{
                type: [cc.String],
                visible: true,
                get(){
                    let strs = []
                    if (!this._stateEnum) {
                        return strs
                    }
                    let idx = 0
                    while (idx >= 0) {
                        if (idx.toString() in this._stateEnum) {
                            strs[idx] = this._stateEnum[idx]
                            idx += 1
                        }else{
                            idx = -1
                        }
                    }
                    return strs
                }
            },
            subStaters: {
                type: [Stater],
                default: [],
                notify(){
                    this._flushSubStaters()
                }
            }
        },
        _flushSubStaters(){
            let num = this.subStaters.length
            let staters = []
            let nodes = {}
            for (const stater of this.subStaters) {
                if (stater) {
                    if (nodes[stater.node.uuid]) {
                        continue
                    }
                    nodes[stater.node.uuid] = stater.node
                    for (const s of stater.getComponents(Stater)) {
                        if (!s.bindState) {
                            s.bindState = name
                        }
                        if (s.bindState == name) {
                            staters.push(s)
                            s.state = this.state
                        }
                    }
                }
            }
            if (!this.subStaters.every((s,i)=>s && staters[i] && s.uuid == staters[i].uuid)) {
                this.subStaters = staters
            }
        },
        setState(state){
            let sv = this._stateEnum[state]
            if (typeof sv != "number") {
                sv = this._stateEnum[sv]
            }
            if (sv < 0 || sv >= this.stateNames.length) {
                throw "state err"
            }
            this.state = sv
            return this._state
        },
        isState(state){
            let sv = this._stateEnum[state]
            if (typeof sv != "number") {
                sv = this._stateEnum[sv]
            }
            return sv == this.state
        },
    }
    return cc.Class(classDef)
}
