import { _decorator, Component, Node, CameraComponent, view, SystemEventType, systemEvent } from "cc";
const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent(CameraComponent)
export class FitWidthCamerats extends Component {

    private _camera!: CameraComponent;
    private _defaultTanFov!: number;

    onLoad() {
        this._camera = this.getComponent(CameraComponent)!;
        this._defaultTanFov = Math.tan(this._camera.fov / 180 * Math.PI);
        this.updateFov();
        window.addEventListener('resize', this.updateFov);
    }

    updateFov = () => {
        let tan2 = view.getVisibleSize().height / view.getDesignResolutionSize().height * this._defaultTanFov;
        this._camera.fov = Math.atan(tan2) / Math.PI * 180;
    }

    onDestroy() {
        window.removeEventListener('resize', this.updateFov);
    }
}
