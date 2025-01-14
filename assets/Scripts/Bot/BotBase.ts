// BotBase.ts
import { _decorator, Component, Prefab, Node, instantiate, Vec3, find, tween, v3 } from 'cc';
import { GameManager } from '../GameManager';
import { Move } from '../Move';
const { ccclass, property } = _decorator;

export class BotBase extends Component {

    @property({ type: Prefab, tooltip: "Đạn" })
    private bulletPrefab: Prefab = null;

    @property({ type: Node, tooltip: "Node súng" })
    protected gunNode: Node = null;

    @property({ type: Node, tooltip: "Điểm bắn đạn" })
    private arrShootPos: Node[] = [];

    protected onLoad(): void {
        this.node.setScale(new Vec3(0, 0, 0));

        tween(this.node)
            .to(0.2, { scale: new Vec3(1, 1, 0) })
            .start();
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
    }

    // Bắn đạn tự động theo thời gian
    protected autoShot(timeShoot) {
        this.schedule(() => {
            this.arrShootPos.forEach(pos => {
                this.Shot(pos);
            });
        }, timeShoot);
    }

    // Phương thức bắn đạn
    protected Shot(shootPos: Node) {
        if (!this.bulletPrefab || !shootPos) {
            console.warn('Bullet prefab or shoot point is not set!');
            return;
        }

        const bullet = this.createBullet(shootPos);
        this.setBulletDirection(bullet, shootPos);
    }

    // Hàm khởi tạo viên đạn từ prefab
    protected createBullet(shootPos: Node): Node {
        const canvas = find('Canvas');
        const bullet = instantiate(this.bulletPrefab);
        bullet.setParent(canvas);
        bullet.setWorldPosition(shootPos.worldPosition);
        return bullet;
    }

    // Hàm tính toán hướng và gán cho viên đạn
    private setBulletDirection(bullet: Node, shootPos: Node) {
        const direction = new Vec3();
        Vec3.subtract(direction, shootPos.worldPosition, this.node.worldPosition);

        const bulletScript = bullet.getComponent(Move);
        if (bulletScript) {
            bulletScript.setDirection(direction);
        }
    }
}
