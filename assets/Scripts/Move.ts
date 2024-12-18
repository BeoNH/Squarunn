import { _decorator, Component, v3, Vec3} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Move')
export class Move extends Component {

    public moveDir: Vec3 = v3(Vec3.ZERO);  // Hướng di chuyển
    public speed: number = 0;  // Tốc độ di chuyển

    // Cập nhật vị trí của node mỗi frame
    update(dt: number) {
        if (this.moveDir.length() > 0) {
            const oldWPos = this.node.worldPosition.clone();
            this.moveDir.normalize();
            let newX = oldWPos.x + this.moveDir.x * this.speed * dt;
            let newY = oldWPos.y + this.moveDir.y * this.speed * dt;

            this.node.worldPosition = v3(newX, newY, oldWPos.z);
        }
    }
}