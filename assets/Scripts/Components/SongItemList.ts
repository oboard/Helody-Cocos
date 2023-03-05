import { _decorator, Component, director, find, Node, Animation, SpriteFrame, Prefab, instantiate, assetManager, resources, Sprite, Label, Button, sys } from 'cc';
import { SongInfo } from '../Models/SongInfo';
const { ccclass, property, } = _decorator;

@ccclass('SongItemList')
export class SongItemList extends Component {
    // @property([SongInfo])
    items: SongInfo[] = [
        {
            id:0,
            itemName: 'Beat Thee',
            itemPath: 'BeatThee',
            itemSongFile: 'Beat Thee',
            itemDescription:'the first song'
        },
        {
            id:0,
            itemName: 'Beat Thee',
            itemPath: 'BeatThee',
            itemSongFile: 'Beat Thee',
            itemDescription:'the first song'
        },
        {
            id:0,
            itemName: 'Beat Thee',
            itemPath: 'BeatThee',
            itemSongFile: 'Beat Thee',
            itemDescription:'the first song'
        },
        
    ];
    @property(Prefab)
    itemPrefab: Prefab | null = null;

    onLoad() {
        for (let i = 0; i < this.items.length; ++i) {
            const item = instantiate(this.itemPrefab);
            const data = this.items[i];
            this.node.addChild(item);
            item.getChildByName('Name').getComponent(Label).string = data.itemName;
            item.getChildByName('Description').getComponent(Label).string = data.itemDescription;

            // console.log(resources.getInfoWithPath('BeatMaps/' + data.itemPath + '/preview'));
            resources.load('BeatMaps/' + data.itemPath + '/preview/spriteFrame', SpriteFrame, function (err, spriteFrame) {
                // 设置当前节点的spriteFrame
                item.getChildByName('Mask').getChildByName('Background').getComponent(Sprite).spriteFrame = spriteFrame;
            });
            let button = item.addComponent(Button);

            var eventHandler = new Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "SongItemList";
            eventHandler.handler = "clickItem"
            eventHandler.emit([data])
            button.clickEvents.push(eventHandler);
            // (item.getComponent('SongTemplate') as SongTemplate).init(data);
        }
    }

    clickItem(data: SongInfo) {
        sys.localStorage.setItem('current', JSON.stringify(data));
        let game = find('Game');
        game.active = true;
        game.getComponent('GameScript')
    }
}