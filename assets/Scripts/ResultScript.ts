import { _decorator, Component, director, find, Node, Animation, Prefab, instantiate, resources, Vec3, sys, Sprite, SpriteFrame, Label, JsonAsset, error, AudioSource, AudioClip, UITransform, math, Vec2, UIOpacity, Game } from 'cc';
import { SongInfo } from './Models/SongInfo';
import { ImageFixedSize } from './Components/ImageFixedSize';
import { BeatMapInfo, Note } from './Models/BeatMapInfo';
import { ResultInfo } from './Models/ResultInfo';
import { GameScript } from './GameScript';
const { ccclass, property } = _decorator;

@ccclass('ResultScript')
export class ResultScript extends Component {


    @property(Label)
    public songNameTopLable: Label | null = null;

    @property(Label)
    public scoreTopLable: Label | null = null;

    @property(Label)
    public songNameLable: Label | null = null;
    @property(Label)
    public comboLable: Label | null = null;
    @property(Label)
    public scoreLable: Label | null = null;
    @property(Label)
    public perfectLable: Label | null = null;
    @property(Label)
    public greatLable: Label | null = null;
    @property(Label)
    public goodLable: Label | null = null;
    @property(Label)
    public badLable: Label | null = null;
    @property(Label)
    public missLable: Label | null = null;

    protected onLoad(): void {
        let data = GameScript.data;
        let result = GameScript.result;
        this.songNameTopLable.string =  this.songNameLable.string = data.itemName;
        this.scoreTopLable.string = this.scoreLable.string = result.score.toString();
    }
}