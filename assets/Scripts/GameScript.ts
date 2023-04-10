import { _decorator, Component, director, find, Node, Animation, Prefab, instantiate, resources, Vec3, sys, Sprite, SpriteFrame, Label, JsonAsset, error, AudioSource, AudioClip, UITransform, math, Vec2, UIOpacity, Game } from 'cc';
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
            GameScript.pauseStartTime = 0;
        }, 3000);

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

        if(time > GameScript.audio.duration) {
            this.onBackButtonClick();
            find('Result').active = true;
        }

        GameScript.beatmap.clips.map(clip => {
            // 片段，每个片段一条判定线
            const now = time * clip.bpm;
            const view = clip.bpm * 5;

            const w = 960, h = 640;

            const lineOffset = new Vec3(0, - h / 4, 0);

            const blockHeight = h / 20;


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

            let notes = clip.notes.filter(item => {
                // if (distance >= Math.abs(item.start - now)) {
                //   nearest = index;
                //   distance = Math.abs(item.start - now);
                // }
                if(clip.bpm == 0) return true;
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
            notes.forEach(note => {
                let ceilHeight = getNoteHeight(note, blockHeight, now, w);
                if (ceilHeight < 0) ceilHeight = 0;
                const ceilWidth = (note.type == 2) ? w / 8 * 0.8 : w / 8;
                const x = note.x / 100 * w;
                const y = (note.start - now) * blockHeight + ((note.type === 2) ? (ceilHeight / 2) : 0);

                let node: Node | null = null;
                if (!note._node) {
                    // 创建
                    note._node = node = new Node();
                    const uiTransform = node.addComponent(UITransform);
                    const sprite = node.addComponent(Sprite);
                    node.addComponent(UIOpacity);
                    // node.position = new Vec3(x, y, 0);
                    screen.insertChild(node, 0);
                    note.judged = false;
                    note.miss = false;
                    node.on(Node.EventType.TOUCH_START, event => {
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
                        const difficulty = 200;
                        const hitJudge = Math.round(Math.abs(note.start / clip.bpm - time1) * difficulty);
                        if(hitJudge > 4) {
                            return;
                        }
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
                        } else if (hitJudge === 4) {
                            this.enmiss(note);
                        }
                        console.log(hitJudgeList[hitJudge]);
                        if (note) {
                            note.judged = true;
                            if (note.type === 2) {

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

                                let anim = 0;
                                const destroyAnim = () => {
                                    if (animNode) {
                                        animNode.destroy();
                                        animNode = null;
                                    }
                                    if (anim) {
                                        clearInterval(anim);
                                        anim = 0;
                                    }
                                }

                                const lastTime = Date.now();
                                anim = setInterval((handler, timeout) => {
                                    if (uiOpacity) {
                                        uiOpacity.opacity = 200 - (Date.now() - lastTime);
                                        if (uiOpacity.opacity < 0) {
                                            destroyAnim();
                                        }
                                    }
                                    if (!animNode || !uiOpacity) {
                                        destroyAnim();
                                    }
                                }, 10);

                                setTimeout(() => destroyAnim(), 1000);
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


                    switch (note.type) {
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
                    uiTransform.setContentSize(new math.Size(ceilWidth, ceilHeight));
                } else {
                    node = note._node;
                }
                if (node) {
                    if (note.judged && note.type === 2 && !note.miss && note.start < now) {
                        // Holding
                        node.getComponent(UITransform).setContentSize(new math.Size(ceilWidth, ceilHeight));
                        node.position = new Vec3(x, ceilHeight / 2, 0).add(lineOffset);
                    } else {
                        node.position = new Vec3(x, y, 0).add(lineOffset);
                    }

                    if (y < -blockHeight && !(note.type === 2 && note.judged) && GameScript.audio.playing) {
                        node.getComponent(UIOpacity).opacity = 100;
                        if (!note.judged) {
                            this.enmiss(note);
                        }
                    }
                    if (note.miss) {
                        // spriteFrame改变后会重置大小
                        node.getComponent(Sprite).spriteFrame = this.miss;
                        node.getComponent(UITransform).setContentSize(ceilWidth, ceilHeight);
                    }
                }
            });
        });
    }

    enmiss(item: Note) {
        item.miss = item.judged = true;
        GameScript.result.combo = 0;
        GameScript.result.miss++;
    }
}

function getNoteHeight(item: Note, blockHeight: number, now: number, w: number):number {
    return (item.type === 2) ?
    ((now > item.start && item.judged && !item.miss) ?
        ((item.length - (now - item.start)) * blockHeight)
        : (item.length * blockHeight)
    )
    : w / 10;
}

