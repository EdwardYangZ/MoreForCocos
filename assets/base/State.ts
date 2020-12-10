import Stater from "./Stater";

export declare class State<T> extends cc.EventTarget{
    state:T;
    _stateEnum:(new ()=> T);
    stateNames: string[];
    public setState(state:T): T;
    public isState(state:T): boolean;
    public subStaters:Stater[]
}

export function newState(name, enumType) {
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
                    if (this.state === oldVal) {
                        return
                    }
                    // cc.log(name, oldVal, this.state)
                    this.emit("state", this.state, oldVal)
                    this.emit(this._stateEnum[this.state])
                    this._flushSubStaters()
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
            let staters = []
            let nodes = {}
            for (const stater of this.subStaters) {
                if (stater) {
                    if (nodes[stater.node.uuid]) {
                        continue
                    }
                    nodes[stater.node.uuid] = stater.node
                    for (const s of stater.getComponents(Stater)) {
                        if (!s.bindState && CC_EDITOR) {
                            s.bindState = name
                        }
                        if (s.bindState == name) {
                            staters.push(s)
                            s.state = this.state
                        }
                    }
                }
            }
            if (!CC_EDITOR) {
                return
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
