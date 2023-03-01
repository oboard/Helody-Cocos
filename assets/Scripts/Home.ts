import { _decorator, Component, director, find, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Home')
export class Home extends Component {

    start() {
        find('SongPicker').active = false;
    }

    go() {
        find('SongPicker').active = true;
    }

    update(deltaTime: number) {
        
    }
}

