
const {ccclass, property, requireComponent, menu} = cc._decorator;

/* 
    有限item展示无限列表
    以父节点或者指定非其子节点为显示区域, item 只在显示范围内真实创建
    常和 cc.Layout 配合使用, 空Node作为 item 的容器
*/
@ccclass
@menu('base/LimitedList')
export default class LimitedList extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: "设定item, 该item会被放进节点池中, 复制创建多个item"
    })
    item:cc.Node = null

    viewRect:cc.Node = null

    /* 列表长度 */
    length = 0

    /* item 节点池 */
    _itemPool = new cc.NodePool()

    /* 占位格节点池 */
    _blankPool = new cc.NodePool()

    _items = {}

    /* 设定数据项 */
    _datas = null

    itemFlusher = null

    _dirty = false

    onLoad(){
        if (!this.item) {
            cc.error('no item')
            return
        }
        if (this.item && this._itemPool.size() == 0) {
            this._itemPool.put(this.item)
        }
        this.node.on(cc.Node.EventType.POSITION_CHANGED, this._updItems, this)
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updItemsDelay, this)
    }

    start(){
        this._updItems()
    }

    setLength(length:number, itemFlusher?:(item:cc.Node, idx?:number)=>void){
        if (!this.item) {
            cc.error('no item')
            return
        }
        if (this.item && this._itemPool.size() == 0) {
            this._itemPool.put(this.item)
        }
        if (itemFlusher) {
            this.itemFlusher = itemFlusher
        }
        this.length = length
        this._datas = null
        this._updBlanks()
        if (this.getComponent(cc.Layout)) {
            this.getComponent(cc.Layout).updateLayout()
        }
        this._updItems()
    }

    setDatas<T>(datas:T[], itemFlusher?:(item:cc.Node, dataOrIdx:T[], idx?:number)=>void){
        if (!this.item) {
            cc.error('no item')
            return
        }
        if (this.item && this._itemPool.size() == 0) {
            this._itemPool.put(this.item)
        }
        if (itemFlusher) {
            this.itemFlusher = itemFlusher
        }
        this._datas = datas
        this.length = datas.length

        this._updBlanks()
        if (this.getComponent(cc.Layout)) {
            this.getComponent(cc.Layout).updateLayout()
        }
        this._updItems()
    }

    _updBlanks(){
        // for (const key in this._items) {
        //     if (this._items.hasOwnProperty(key)) {
        //         this._itemPool.put(this._items[key])
        //     }
        // }
        // this._items = {}
        let children = this.node.children.slice()
        for (let i = this.length; i < children.length; i++) {
            let child = children[i]
            this._blankPool.put(child)
        }
        for (let i = this.node.children.length; i < this.length; i++) {
            let node:cc.Node
            if (this._blankPool.size() > 0) {
                node = this._blankPool.get()
            }else{
                node = new cc.Node(String(i))
            }
            node.name = String(i)
            node.setAnchorPoint(this.item.getAnchorPoint())
            node.setContentSize(this.item.getContentSize())
            node.parent = this.node
        }
    }

    /* 得到当前可见项的索引列表 */
    getVisibleIdxs(){
        let idxs = []
        for (const key in this._items) {
            if (this._items.hasOwnProperty(key)) {
                idxs.push(Number(key))
            }
        }
        return idxs
    }

    /* 主动刷新当前所有可见item */
    flush(){
        for (const key in this._items) {
            if (this._items.hasOwnProperty(key)) {
                const item = this._items[key];
                if (this.itemFlusher) {
                    if (this._datas) {
                        this.itemFlusher(item, this._datas[key], Number(key))
                    }else{
                        this.itemFlusher(item, Number(key))
                    }
                }
            }
        }
    }

    getItems(){
        return this._items
    }

    _updItemsDelay(){
        this.unschedule(this._updItems)
        this.scheduleOnce(this._updItems)
    }

    _updItems(){
        let left = this.node.parent.width * (-this.node.parent.anchorX) - this.node.x
        let right = this.node.parent.width * (1-this.node.parent.anchorX) - this.node.x
        let bottom = this.node.parent.height * (-this.node.parent.anchorY) - this.node.y
        let top = this.node.parent.height * (1-this.node.parent.anchorY) - this.node.y
        for (let i = 0; i < this.node.children.length; i++) {
            const child = this.node.children[i];
            if (child.x + child.anchorX * child.width < left
                || child.x - child.anchorX * child.width > right
                || child.y + child.anchorY * child.height < bottom
                || child.y - child.anchorY * child.height > top) {
                if (this._items[i]) {
                    this._itemPool.put(this._items[i])
                    delete this._items[i]
                }
            }else{
                if (!this._items[i]) {
                    let item:cc.Node
                    if (this._itemPool.size() > 1) {
                        item = this._itemPool.get()
                    }
                    if (!item) {
                        item = cc.instantiate(this.item)
                    }
                    item.parent = child
                    item.x = 0
                    item.y = 0
                    this._items[i] = item
                }
                if (this.itemFlusher) {
                    if (this._datas) {
                        this.itemFlusher(this._items[i], this._datas[i], Number(i))
                    }else{
                        this.itemFlusher(this._items[i], Number(i))
                    }
                    child.setContentSize(this._items[i].getContentSize())
                }
            }
        }
    }
}
