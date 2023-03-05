'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectAsset = exports.EFFECTASSET = void 0;
exports.EFFECTASSET = {
    "__type__": "cc.EffectAsset",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "techniques": [],
    "shaders": [],
    "combinations": [],
};
class EffectAsset {
    static create() {
        return JSON.parse(JSON.stringify(exports.EFFECTASSET));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.EFFECTASSET));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                source[key] = value;
            }
            return source;
        });
    }
    static apply(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield EffectAsset.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.EffectAsset = EffectAsset;
