import { _decorator, Component, director, find, Node, Animation, SpriteFrame, Prefab, instantiate } from 'cc';
const { ccclass, property, } = _decorator;

@ccclass('SongInfo')
export class SongInfo {
    @property
    id = 0;
    @property
    itemName = '';
    @property
    itemDescription = '';
    @property
    itemPath = '';
    @property
    itemSongFile = '';
}