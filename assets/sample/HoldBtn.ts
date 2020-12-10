
import {State, newState } from "../base/State";
import Btn, { BtnState } from "./Btn";

const {ccclass, property, requireComponent} = cc._decorator;

export enum HoldBtnState {
    nor,
    down,
    hold,
    disable,
}

@ccclass
@requireComponent(Btn)
export default class HoldBtn extends cc.Component {

    static EventType = {
        holdClick: "holdClick"
    }

    @property
    holdStart = 1

    @property
    holdEnd = 2.5

    holdTime = 0

    @property(newState("HoldBtnState", HoldBtnState))
    holdBtnState:State<HoldBtnState> = null

    onLoad(){
        this.holdTime = 0
        let btn = this.getComponent(Btn)
        btn.btnState.on("state", this._updState, this)
    }

    _updState(){
        let btn = this.getComponent(Btn)
        if (btn.btnState.isState(BtnState.disable)) {
            this.holdBtnState.setState(HoldBtnState.disable)
        }else
        if (btn.btnState.isState(BtnState.down)) {
            if (this.holdBtnState.isState(HoldBtnState.nor)) {
                // 按住开始
                this.holdTime = 0
                this.holdBtnState.setState(HoldBtnState.down)
            }
        }else{
            this.holdBtnState.setState(HoldBtnState.nor)
        }
    }

    onHoldClick(){
        cc.log("holdClick", this.node.name)
        this.holdTime = 0
        this.getComponent(Btn).touchCancel()
        this.node.emit(HoldBtn.EventType.holdClick)
        this._updState()
    }

    update(dt){
        if (this.holdBtnState.isState(HoldBtnState.down)) {
            this.holdTime += dt
            if (this.holdTime >= this.holdStart) {
                this.holdBtnState.setState(HoldBtnState.hold)
            }
        }else
        if (this.holdBtnState.isState(HoldBtnState.hold)) {
            this.holdTime += dt
            if (this.holdTime >= this.holdEnd) {
                this.onHoldClick()
            }
        }
    }
}

