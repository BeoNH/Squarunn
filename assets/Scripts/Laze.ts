import { _decorator, Component, Node, PolygonCollider2D, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Laze')
export class Laze extends Component {
    start() {
        this.animateLaze();
    }

    // Hiệu ứng mở rộng tia laze
    private animateLaze() {
        let collider = this.node.getComponent(PolygonCollider2D);
        if(!collider) collider.enabled = false;
        this.node.setScale(new Vec3(1, 0.01, 0.01));

        tween(this.node)
            .to(0.3, { scale: new Vec3(1, 1, 0.01) }, { easing: 'quadOut' })
            .call(()=>{
                collider.enabled = true;
            })
            .to(0.7, { scale: new Vec3(1, 0.01, 0.01) }, { easing: 'quadIn' })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}


