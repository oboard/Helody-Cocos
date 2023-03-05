import { _decorator, Component, director, find, Node, Animation, Prefab, instantiate, resources, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Home')
export class Home extends Component {

    loaded = false;

    start() {
    }

    onLoad() {
        // find('SongPicker').setScale(new Vec3(0,0,0));
        find('Game').active = false;
        
    }

    go() {
        if(this.loaded) return;

        // find('SongPicker').setScale(new Vec3(1,1,1));
        // find('SongPicker').active = true;
        // 动态加载prefab
        // resources.load("Prefabs/SongPicker", Prefab, (err, prefab) => {
        //     if(err) return;
        //     const newNode = instantiate(prefab);
        //     this.node.addChild(newNode);
        // });
        // find('Background/Canvas/tip').active = false;
        find('Splash').active = false;

        // const animationComponent = this.node.getComponent(Animation);
        // animationComponent.crossFade('start_game', 1);
        this.loaded = true;
        // const animationComponent = find('SongPicker/Canvas/ScrollView').addComponent();
        // tip.destroy();
    }

    update(deltaTime: number) {
        
    }
}

