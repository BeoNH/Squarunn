import { _decorator, Component, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Move')
export class Move extends Component {
    @property
    public speed: number = 0;  // Tốc độ di chuyển
    
    public moveDir: Vec3 = v3(Vec3.ZERO);  // Hướng di chuyển

    // Cập nhật vị trí của node mỗi frame
    update(dt: number) {
        if (this.moveDir.length() > 0) {
            const oldWPos = this.node.worldPosition.clone();
            const movement = new Vec3();
            Vec3.scaleAndAdd(movement, oldWPos, this.moveDir, this.speed * dt);
            this.node.setWorldPosition(movement);
        }
    }

    // Thiết lập hướng di chuyển
    setDirection(dir: Vec3) {
        Vec3.normalize(this.moveDir, dir);
    }
}