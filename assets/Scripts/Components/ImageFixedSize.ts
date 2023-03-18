import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ImageFixedSize')
export class ImageFixedSize extends Component {
    @property({ tooltip: "固定尺寸" })
    public set fixedSize(value) {
        this._fixedSize = value;
        this.onSizeChanged();
    }
 
    public get fixedSize() {
        return this._fixedSize;
    }
 
    @property({ tooltip: "固定尺寸" })
    private _fixedSize: number = 1;
 
    onLoad() {
        this._fixedSize = this.fixedSize;
        this.node.on(Node.EventType.SIZE_CHANGED, this.onSizeChanged, this);
        this.onSizeChanged();
    }
 
    /**当尺寸变化时，重置node节点大小 */
    public onSizeChanged() {
        let t = this.node.getComponent(UITransform);
        var width = t.width;
        var height = t.height;
        var max = Math.min(width, height);
        this.node.setScale(new Vec3(this.fixedSize / max,this.fixedSize / max,this.fixedSize / max));
    }
}

