import LimitedList from "../base/LimitedList";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SampleLimitedList extends cc.Component {

    @property(LimitedList)
    limitedList:LimitedList = null

    @property(cc.Node)
    btn1:cc.Node = null

    @property(cc.Node)
    btn2:cc.Node = null

    @property(cc.Node)
    btn3:cc.Node = null

    @property(cc.Node)
    btn4:cc.Node = null

    onLoad(){
        this.btn1.on("click", ()=>{
            this.limitedList.setLength(10000, (item, idx)=>{
                item.getComponentInChildren(cc.Label).string = idx.toString()
            })
        }, this)
        this.btn2.on("click", ()=>{
            let datas = [7,5,6,4,1,8,9,3,5,6,7]
            this.limitedList.setDatas(datas, (item, data, idx)=>{
                item.getComponentInChildren(cc.Label).string = data.toString()
            })
        }, this)
        this.btn3.on("click", ()=>{
            cc.log("当前可见:", this.limitedList.getVisibleIdxs())
        }, this)
        this.btn4.on("click", ()=>{
            this.limitedList.setLength(100, (item, idx)=>{
                item.getComponentInChildren(cc.Label).string = idx.toString()
                item.height = 50 + idx * 5
            })
        }, this)
    }
}
