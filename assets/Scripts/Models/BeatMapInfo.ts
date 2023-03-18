import { Node } from "cc";

export interface Effect {
	type: string;
	start: number;
	end: number;
	curve: string;
	startValue: number;
	endValue: number;
}

export interface Note {
    judged: boolean;
    miss: boolean;
	start: number;
	x: number;
	type: number;
	length: number;
	effects: Effect[];
	_node: Node;
}

export interface Clip {
	bpm: number;
	index: number;
	from: number;
	to: number;
	notes: Note[];
    _node: Node;
}

export interface BeatMapInfo {
	title: string;
	composer: string;
	illustrator: string;
	beatmapper: string;
	beatmapUID: string;
	version: string;
	difficulty: number;
	previewTime: number;
	songOffset: number;
	description: string;
	clips: Clip[];
}