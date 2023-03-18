import { _decorator, Component, director, find, Node, Animation, Prefab, instantiate, resources, Vec3, sys, Sprite, SpriteFrame, Label, JsonAsset, error, AudioSource, AudioClip, UITransform, math, Vec2, UIOpacity } from 'cc';
import { SongInfo } from './Models/SongInfo';
import { ImageFixedSize } from './Components/ImageFixedSize';
import { BeatMapInfo, Note } from './Models/BeatMapInfo';
import { ResultInfo } from './Models/ResultInfo';
const { ccclass, property } = _decorator;

@ccclass('GameScript')
export class GameScript extends Component {
    static startTime = 0;
    static pauseStartTime = 0;
    static timeOffset = 1600000000000;
    static data: SongInfo | null = null;
    static screen: Node | null = null;
    static audio: AudioSource | null = null;
    static result: ResultInfo = {
        perfect: 0,
        great: 0,
        good: 0,
        bad: 0,
        miss: 0,
        score: 0,
        combo: 0,
        max_combo: 0
    };
    static beatmap: BeatMapInfo = {
        title: '',
        composer: '',
        illustrator: '',
        beatmapper: '',
        beatmapUID: '',
        version: '',
        difficulty: 0,
        previewTime: 0,
        songOffset: 0,
        description: '',
        clips: []
    };

    @property(Label)
    public songNameLable: Label | null = null;
    @property(Label)
    public comboLable: Label | null = null;

    @property(Node)
    public pauseMask: Node | null = null;

    @property(Label)
    public scoreLable: Label | null = null;

    @property(Node)
    public Bg: Node | null = null;

    @property(SpriteFrame)
    public spriteSplash: SpriteFrame | null = null;

    @property(SpriteFrame)
    public perfect: SpriteFrame | null = null;

    @property(SpriteFrame)
    public good: SpriteFrame | null = null;

    @property(SpriteFrame)
    public miss: SpriteFrame | null = null;

    @property(SpriteFrame)
    public tap: SpriteFrame | null = null;

    @property(SpriteFrame)
    public hold: SpriteFrame | null = null;

    @property(SpriteFrame)
    public drag: SpriteFrame | null = null;

    @property(SpriteFrame)
    public flick: SpriteFrame | null = null;

    start() {
        this.pauseMask.active = false;
    }

    onLoad() {
    }

    // Pause 暂停
    onPauseButtonClick() {
        this.pauseMask.active = true;
        GameScript.audio.pause();
        GameScript.pauseStartTime = Date.now() - GameScript.timeOffset;
    }

    // Continue 继续
    onContinueButtonClick() {
        setTimeout(() => {
            GameScript.startTime = Date.now() - GameScript.timeOffset - GameScript.audio.currentTime * 1000;
            GameScript.audio.play();
        }, 3000);
        GameScript.pauseStartTime = 0;

        this.closePauseLayout();
    }

    onRestartButtonClick() {
        this.startGame()
        this.closePauseLayout();
    }

    // Back
    onBackButtonClick() {
        GameScript.audio.currentTime = 0;

        this.closePauseLayout();
        this.node.active = false;
        find('SongPicker').active = true;
    }

    closePauseLayout() {
        this.pauseMask.active = false;
    }

    startGame() {
        let that = this;
        GameScript.pauseStartTime = 0;
        GameScript.result = {
            perfect: 0,
            great: 0,
            good: 0,
            bad: 0,
            miss: 0,
            combo: 0,
            max_combo: 0,
            score: 0
        };
        if (GameScript.audio)
            GameScript.audio.stop();
        GameScript.screen = find('Game/Canvas/Map');
        GameScript.screen.destroyAllChildren();
        find('SongPicker').active = false;
        //let data: SongInfo | null = JSON.parse(sys.localStorage.getItem('current'));
        let data = GameScript.data;
        console.log(data);
        if (data) {
            resources.load('BeatMaps/' + data.itemPath + '/beatmap', (err: any, res: JsonAsset) => {
                if (err) {
                    error(err.message || err);
                    return;
                }
                // 获取到 Json 数据
                const jsonData: BeatMapInfo = res.json! as BeatMapInfo;

                GameScript.beatmap = JSON.parse(JSON.stringify(jsonData));

                resources.load('BeatMaps/' + data.itemPath + '/preview/spriteFrame', SpriteFrame, function (err, spriteFrame) {
                    if (err) {
                        error(err.message || err);
                        return;
                    }

                    // 设置当前节点的spriteFrame
                    that.songNameLable.string = data.itemName;
                    that.Bg.getComponent(Sprite).spriteFrame = spriteFrame;
                    that.Bg.getComponent(ImageFixedSize).onSizeChanged();

                    resources.load(`BeatMaps/${data.itemPath}/${data.itemSongFile}`, AudioClip, function (err, audioClip) {
                        let audio = GameScript.audio = that.node.getComponent(AudioSource);
                        audio.clip = audioClip;

                        GameScript.startTime = Date.now() - GameScript.timeOffset + 2000;
                        setTimeout(() => {
                            audio.play();
                            GameScript.startTime = Date.now() - GameScript.timeOffset;
                        }, 2000);

                    });
                });

            })
        }
    }

    update() {
        if (!GameScript.audio || !GameScript.screen || GameScript.pauseStartTime != 0) return;

        if (this.scoreLable) {
            this.scoreLable.string = GameScript.result.score.toFixed(0);
        }
        if (this.comboLable) {
            if (GameScript.result.combo == 0) {
                this.comboLable.string = '';
            } else {
                this.comboLable.string = 'COMBO ' + GameScript.result.combo.toFixed(0);
            }
        }

        let screen = GameScript.screen;

        let time = (Date.now() - GameScript.timeOffset - GameScript.startTime) / 60000;

        GameScript.beatmap.clips.map((clip) => {
            // 片段，每个片段一条判定线
            let now64 = time * clip.bpm;
            let now = time * clip.bpm * 64;
            let view = clip.bpm * 5;

            let w = 960, h = 640;

            let lineOffset = new Vec3(0, - h / 4, 0);

            let blockHeight = h / 20;


            let lineNode: Node | null = null;
            if (!clip._node) {
                // 创建
                clip._node = lineNode = new Node();
                let uiTransform = lineNode.addComponent(UITransform);
                let sprite = lineNode.addComponent(Sprite);
                sprite.spriteFrame = this.spriteSplash;
                sprite.setEntityColor(new math.Color(255, 255, 255, 255));
                screen.addChild(lineNode);
                uiTransform.setContentSize(new math.Size(w, 4));
            } else {
                lineNode = clip._node;
            }
            if (lineNode) {
                // 判定线位置
                lineNode.position = lineOffset;
            }

            let elements = clip.notes.filter(function (item, index, array) {
                // if (distance >= Math.abs(item.start - now)) {
                //   nearest = index;
                //   distance = Math.abs(item.start - now);
                // }
                let show = false;
                switch (item.type) {
                    case 2:
                        show = (item.start + ((item.type === 2) ? item.length : 0)) > now - view && item.start < now + view;
                    default:
                        show = item.start > now - view && item.start < now + view;
                        break;
                }
                if (!show && item._node) {
                    item._node.destroy();
                    item._node = null;
                    // this.splice(index, 1);
                }
                return show;
            });
            for (let index in elements) {
                const item = elements[index];
                let ceilHeight = (item.type === 2) ?
                    (now > item.start ?
                        ((item.length - (now - item.start)) / 64 * blockHeight)
                        : (item.length / 64 * blockHeight)
                    )
                    : w / 10;
                if (ceilHeight < 0) ceilHeight = 0;
                const x = item.x / 100 * w;
                const y = (item.start / 64 - now64) * blockHeight + ((item.type === 2) ? (ceilHeight / 2) : 0);

                let node: Node | null = null;
                if (!item._node) {
                    // 创建
                    item._node = node = new Node();
                    const uiTransform = node.addComponent(UITransform);
                    const sprite = node.addComponent(Sprite);
                    node.addComponent(UIOpacity);
                    // node.position = new Vec3(x, y, 0);
                    screen.insertChild(node, 0);
                    item.judged = false;
                    item.miss = false;
                    node.on(Node.EventType.TOUCH_START, function (event) {
                        // console.log('Touch Start');
                        // console.log(y);
                        const hitJudgeList = [
                            'Perfect',
                            'Great',
                            'Good',
                            'Bad',
                            'Miss'
                        ];
                        const time1 = (Date.now() - GameScript.timeOffset - GameScript.startTime) / 60000;
                        const now1 = time1 * clip.bpm;
                        const difficulty = 4;
                        const hitJudge = Math.round(Math.abs(item.start / 64 - now1) / difficulty);
                        // console.log(item.start-now1);
                        if (hitJudge < 4) {
                            GameScript.result.combo++;
                            if (GameScript.result.combo > GameScript.result.max_combo) GameScript.result.max_combo = GameScript.result.combo;
                        }
                        if (hitJudge == 0) {
                            GameScript.result.perfect++;
                            GameScript.result.score += 4;
                        } else if (hitJudge === 1) {
                            GameScript.result.great++;
                            GameScript.result.score += 3;
                        } else if (hitJudge === 2) {
                            GameScript.result.good++;
                            GameScript.result.score += 2;
                        } else if (hitJudge === 3) {
                            GameScript.result.bad++;
                            GameScript.result.score += 1;
                        } else if (hitJudge >= 4) {
                            this.enmiss(item);
                        }
                        console.log(hitJudgeList[hitJudge]);
                        if (item) {
                            item.judged = true;
                            if (item.type === 2) {

                            } else {
                                node.active = false;
                                let animNode: Node | null = new Node();
                                const uiTransform = animNode.addComponent(UITransform);
                                const sprite = animNode.addComponent(Sprite);
                                const uiOpacity = animNode.addComponent(UIOpacity);
                                if (hitJudge == 0)
                                    sprite.spriteFrame = this.perfect;
                                else
                                    sprite.spriteFrame = this.good;
                                uiTransform.setContentSize(w / 8, w / 8);
                                animNode.setPosition(new Vec3(x, 0, 0).add(lineOffset));
                                screen.addChild(animNode);
                                const anim = setInterval((handler, timeout) => {
                                    const time1 = (Date.now() - GameScript.timeOffset - GameScript.startTime) / 60000;
                                    const now1 = time1 * clip.bpm;
                                    if (uiOpacity) {
                                        uiOpacity.opacity = 200 - Math.abs(item.start / 64 - now1) * 20;
                                        if (uiOpacity.opacity < 0) {
                                            if (animNode) {
                                                animNode.destroy();
                                                animNode = null;
                                            }
                                        }
                                    }
                                    if (!animNode || !uiOpacity) {
                                        clearInterval(anim);
                                    }
                                }, 10);

                                setTimeout(() => clearInterval(anim), 1000);
                            }
                        }
                        // event.getID(); //Touch事件的ID
                        // event.getLocation(); //Touch事件的手指位置
                        // event.getLocationX(); //获取X轴位置
                        // event.getLocationY();	//获取触点的 Y 轴位置
                        // event.getPreviousLocation();	//获取触点上一次触发事件时的位置对象，对象包含 x 和 y 属性
                        // event.getStartLocation(); 	//获取触点初始时的位置对象，对象包含 x 和 y 属性
                        // event.getDelta();	//获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性
                    }, this);


                    switch (item.type) {
                        case 1:
                            sprite.spriteFrame = this.tap;
                            break;
                        case 2:
                            sprite.spriteFrame = this.hold;
                            break;
                        case 3:
                            sprite.spriteFrame = this.drag;
                            break;
                        case 4:
                            sprite.spriteFrame = this.flick;
                            break;
                        default:
                            sprite.spriteFrame = this.tap;
                            break;
                    }
                    uiTransform.setContentSize(new math.Size(w / 8, ceilHeight));
                } else {
                    node = item._node;
                }
                if (node) {
                    if (item.judged && item.type === 2) {
                        // Holding
                        node.getComponent(UITransform).setContentSize(new math.Size(w / 8, ceilHeight));
                        node.position = new Vec3(x, ceilHeight / 2 - 8, 0).add(lineOffset);
                    } else {
                        node.position = new Vec3(x, y, 0).add(lineOffset);
                    }

                    if (y < -blockHeight) {
                        node.getComponent(UIOpacity).opacity = 100;
                        if (!item.judged) {
                            this.enmiss(item);
                        }
                    }
                    if (item.miss) {
                        node.getComponent(Sprite).spriteFrame = this.miss;
                        node.getComponent(UITransform).setContentSize(new math.Size(w / 8, ceilHeight));
                    }
                }
            }

        })

    }

    enmiss(item: Note) {
        item.miss = item.judged = true;
        GameScript.result.combo = 0;
        GameScript.result.miss++;
    }
}

