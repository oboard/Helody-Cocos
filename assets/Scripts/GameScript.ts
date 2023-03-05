import { _decorator, Component, director, find, Node, Animation, Prefab, instantiate, resources, Vec3, sys } from 'cc';
import { SongInfo } from './Models/SongInfo';
const { ccclass, property } = _decorator;

@ccclass('GameScript')
export class GameScript extends Component {

    start() {
    }

    onLoad() {
        
    }

    startGame() {
        let songInfo: SongInfo | null = JSON.parse(sys.localStorage.getItem('current'));
        if(songInfo) {
            songInfo.itemSongFile;
        }
    }

    update(deltaTime: number) {
        
    }
}

