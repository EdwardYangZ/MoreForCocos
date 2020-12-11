
import {State, newState as defineState } from "../base/State";
import Value from "../base/Value";

const {ccclass, property, inspector} = cc._decorator;

export enum BtnState {
    nor,
    down,
    disable,
}

export let BtnStateClass = defineState("BtnState", BtnState)


@ccclass
export default class Btn extends cc.Component {

    static EventType = {
        click: "click"
    }

    @property(BtnStateClass)
    btnState:State<BtnState> = new BtnStateClass()

    @property
    get interactable(){
        return this.btnState && this.btnState.state != BtnState.disable
    }

    set interactable(val:boolean){
        if (this.btnState) {
            this.btnState.state = !!val? BtnState.nor: BtnState.disable
        }
    }

    @property(Value)
    touch:Value = new Value()

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START, (evt)=>{
            this._updTouch(evt.touch)
            if (this.btnState.state == BtnState.disable) {
                return false
            }
            this.btnState.state = BtnState.down
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (evt)=>{
            this._updTouch(evt.touch)
            if (this.btnState.state != BtnState.down) {
                return false
            }
            this._onClick()
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_END, (evt)=>{
            this._updTouch(evt.touch)
            if (this.btnState.state != BtnState.down) {
                return false
            }
            this._onClick()
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (evt)=>{
            this._updTouch(evt.touch)
            this.touchCancel()
        }, this)
    }

    _updTouch(touch:cc.Event.EventTouch){
        this.touch.value = touch
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

cc.log("Btn", cc.js.getClassByName("BtnState"))