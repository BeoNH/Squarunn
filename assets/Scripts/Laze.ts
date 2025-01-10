import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Laze')
export class Laze extends Component {
    start() {
        // Bắt đầu hiệu ứng mở rộng
        this.animateLaze();
    }

    private animateLaze() {
        // Bắt đầu từ scale 0
        this.node.setScale(new Vec3(1, 0, 0));

        // Tạo hiệu ứng tween
        tween(this.node)
            .to(0.3, { scale: new Vec3(1, 1, 0) }) 
            .to(0.5, { scale: new Vec3(1, 0, 0) })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}


