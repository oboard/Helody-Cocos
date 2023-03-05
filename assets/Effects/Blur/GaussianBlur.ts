
import { _decorator, Component, Slider, Label, dynamicAtlasManager, find, Node, UIRenderer, Material, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GaussionBlur')
export class GaussionBlur extends Component {

    // private _blurSlider !: Slider;
    // private _blurSliderLabel !: Label;
    // private _examplesParentNode !: Node;
    private _gsFactor : number = 5000; // 调整高斯模糊系数 (建议 50 ~ 5000)

    @property
    blurRadius = 500;

    onLoad () {
        dynamicAtlasManager.enabled = false;
    }

    // update() {
    //     // this.updateRenderComponentMaterial({});
    // }

    /**
     * 更新渲染组件的材质
     *
     * 1. 获取材质
     * 2. 给材质的 unitform 变量赋值
     * 3. 重新将材质赋值回去
     */
    public updateRenderComponentMaterial(param: {}) {
        this.node.children.forEach(childNode => {
            childNode.getComponents(UIRenderer).forEach(renderComponent => {
                let material: Material = renderComponent.getMaterial(0)!;
                let blurRadius = 1000 - this.blurRadius;
                material.setProperty('textureSize', new Vec2(blurRadius, blurRadius));

                renderComponent.setMaterial(material, 0);
            });
        });
    }
}

