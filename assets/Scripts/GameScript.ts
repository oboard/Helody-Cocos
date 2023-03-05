import { _decorator, Component, director, find, Node, Animation, Prefab, instantiate, resources, Vec3, sys, Sprite, SpriteFrame } from 'cc';
import { SongInfo } from './Models/SongInfo';
const { ccclass, property } = _decorator;

@ccclass('GameScript')
export class GameScript extends Component {
    static data: SongInfo | null = null;
    start() {
    }

    onLoad() {
        
    }

    startGame() {
        //let data: SongInfo | null = JSON.parse(sys.localStorage.getItem('current'));
        let data = GameScript.data;
        console.log(data);
        if(data) {
            resources.load('BeatMaps/' + data.itemPath + '/preview/spriteFrame', SpriteFrame, function (err, spriteFrame) {
                // 设置当前节点的spriteFrame
                (find('Game/Canvas/Bg') as any).getComponent(Sprite).spriteFrame = spriteFrame;
            });
            data.itemSongFile;
        }
    }

    update(deltaTime: number) {
        
    }
}

