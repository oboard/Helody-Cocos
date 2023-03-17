import { _decorator, Component, director, find, Node, Animation, Prefab, instantiate, resources, Vec3, sys, Sprite, SpriteFrame, Label } from 'cc';
import { SongInfo } from './Models/SongInfo';
import { ImageFixedSize } from './Components/ImageFixedSize';
const { ccclass, property } = _decorator;

@ccclass('GameScript')
export class GameScript extends Component {
    static data: SongInfo | null = null;
    start() {
        find('Game/Canvas/PauseMask').active = false;
    }

    onLoad() {

    }

    onPauseButtonClick() {
        find('Game/Canvas/PauseMask').active = true;
    }

    onContinueButtonClick() {

        this.closePauseLayout();
    }

    onRestartButtonClick() {

        this.closePauseLayout();
    }

    onBackButtonClick() {
        this.node.active = false;
        this.closePauseLayout();
    }

    closePauseLayout() {
        find('Game/Canvas/PauseMask').active = false;
    }

    startGame() {
        //let data: SongInfo | null = JSON.parse(sys.localStorage.getItem('current'));
        let data = GameScript.data;
        console.log(data);
        if (data) {
            resources.load('BeatMaps/' + data.itemPath + '/preview/spriteFrame', SpriteFrame, function (err, spriteFrame) {
                // 设置当前节点的spriteFrame
                find('Game/Canvas/Bar/Name').getComponent(Label).string = data.itemName;
                (find('Game/Canvas/Bg') as any).getComponent(Sprite).spriteFrame = spriteFrame;
                (find('Game/Canvas/Bg') as any).getComponent(ImageFixedSize).onSizeChanged();
            });
            data.itemSongFile;
        }
    }

    update(deltaTime: number) {

    }
}

