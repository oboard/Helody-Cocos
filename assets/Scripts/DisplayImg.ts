import { _decorator, Component, Node, Sprite, Vec2, Vec3, SpriteFrame, UITransform, Size, spriteAssembler } from 'cc';
const { ccclass, property } = _decorator;

// 将任意大小的图片完整显示在屏幕中
@ccclass('DisplayImg')
export class DisplayImg extends Component 
{
    private static readonly minXRatio = 0.05;
    private static readonly maxXRatio = 0.95;
    private static readonly minYRatio = 0.3;
    private static readonly maxYRatio = 0.9;

    private _width: number;
    private _height: number;

    @property({ type: Sprite, visible: true, displayName: '图片' })
    private _sprite: Sprite;
    private _spriteTrans: UITransform;

    start()
    {
        this.init();
    }

    onDestroy()
    { 
        this.myDestroy();
    }
    
    private init(): void
    {
        this.initPos();
    }
    
    private myDestroy(): void
    { 

    }

    private initPos(): void
    { 
        this._spriteTrans = this._sprite.getComponent(UITransform);
        const minPosNode = this.createNode();
        const maxPosNode = this.createNode();
        const centerPosNode = this.createNode();

        centerPosNode.setPosition(Vec3.ZERO);
        const width = centerPosNode.worldPosition.x * 2;
        const height = centerPosNode.worldPosition.y * 2;
        const originalPos = new Vec2(width / 2 * -1, height / 2 * -1);

        const minPos: Vec2 = new Vec2(originalPos.x + width * DisplayImg.minXRatio, originalPos.y + height * DisplayImg.minYRatio);
        const maxPos: Vec2 = new Vec2(originalPos.x + width * DisplayImg.maxXRatio, originalPos.y + height * DisplayImg.maxYRatio);
        const centerPos = new Vec2((minPos.x + maxPos.x) / 2, (minPos.y + maxPos.y) / 2);
        this._width = maxPos.x - minPos.x;
        this._height = maxPos.y - minPos.y;

        minPosNode.setPosition(new Vec3(minPos.x, minPos.y, 0));
        maxPosNode.setPosition(new Vec3(maxPos.x, maxPos.y, 0));
        centerPosNode.setPosition(new Vec3(centerPos.x, centerPos.y, 0))
        this._spriteTrans.node.setPosition(new Vec3(centerPos.x, centerPos.y, 0));
        this._spriteTrans.setContentSize(new Size(this._width, this._height));

        minPosNode.destroy();
        maxPosNode.destroy();
        centerPosNode.destroy();
    }

    // 将Sprite尽量铺满给定区域
    public setSprite(sprite: SpriteFrame): void
    {  
        let w = sprite.width;
        let h = sprite.height;
        if (this._width/this._height > w/ h)
        {
            w = w * this._height / h;
            h = this._height;
        }
        else
        { 
            h = h * this._width / w;
            w = this._width;
        }

        this._sprite.spriteFrame = sprite;
        this._spriteTrans.setContentSize(new Size(w, h));
    }

    private createNode(): Node
    { 
        const node = new Node();
        node.setParent(this._sprite.node.parent);
        return node;
    }
}