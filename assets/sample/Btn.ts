
import {State, newState } from "../base/State";

const {ccclass, property, inspector} = cc._decorator;

export enum BtnState {
    nor,
    down,
    disable,
}

@ccclass
export default class Btn extends cc.Component {

    static EventType = {
        click: "click"
    }

    @property(newState("BtnState", BtnState))
    btnState:State<BtnState> = null

    @property
    get interactable(){
        return this.btnState && this.btnState.state != BtnState.disable
    }

    set interactable(val:boolean){
        if (this.btnState) {
            this.btnState.state = !!val? BtnState.nor: BtnState.disable
        }
    }

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START, ()=>{
            if (this.btnState.state == BtnState.disable) {
                return false
            }
            this.btnState.state = BtnState.down
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            if (this.btnState.state != BtnState.down) {
                return false
            }
            this._onClick()
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, ()=>{
            this.touchCancel()
        }, this)
    }

    touchCancel(){
        if (this.btnState.state == BtnState.disable) {
            return false
        }
        this.btnState.state = BtnState.nor
    }

    private _onClick(){
        cc.log("click", this.node.name)
        this.node.emit(Btn.EventType.click)
        this.btnState.state = BtnState.nor
    }
}

