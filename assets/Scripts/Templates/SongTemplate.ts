import { _decorator, Component, Node, Sprite, Label } from 'cc';
import { SongInfo } from '../Models/SongInfo'
const { ccclass, property } = _decorator;

@ccclass('SongTemplate')
export class SongTemplate extends Component {
    @property
    public id = 0;
    @property(Sprite)
    public itemBackground: Sprite | null = null;
    @property(Label)
    public itemName: Label | null = null;
    @property(Label)
    public itemDescription: Label | null = null;
}