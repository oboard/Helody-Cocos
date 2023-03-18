import { _decorator, Component, director, find, Node, Animation, SpriteFrame, Prefab, instantiate, assetManager, resources, Sprite, Label, Button, sys } from 'cc';
import { GameScript } from '../GameScript';
import { SongInfo } from '../Models/SongInfo';
const { ccclass, property, } = _decorator;

@ccclass('SongItemList')
export class SongItemList extends Component {
    // @property([SongInfo])
    items: SongInfo[] = [
        {
            id: 0,
            itemName: 'Barroom Ballet',
            itemPath: 'BarroomBallet',
            itemSongFile: 'Barroom Ballet',
            itemDescription: 'the first song'
        },
        {
            id: 1,
            itemName: 'Memento',
            itemPath: 'Memento',
            itemSongFile: 'audio',
            itemDescription: 'MementoMemento~'
        },
        {
            id: 2,
            itemName: 'Animals',
            itemPath: 'Animals',
            itemSongFile: 'Animals',
            itemDescription: 'Animals~'
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
            eventHandler.customEventData = i.toString();
            // eventHandler.emit([i])
            button.clickEvents.push(eventHandler);
            // (item.getComponent('SongTemplate') as SongTemplate).init(data);
        }
    }

    clickItem(event, customEventData) {
        let index = Number(customEventData);
        console.log(customEventData);
        let data = this.items[index];
        // sys.localStorage.setItem('current', JSON.stringify(data));
        GameScript.data = data;
        let game = find('Game');
        game.active = true;
        console.log(game);
        game.getComponent(GameScript).startGame();
    }
}