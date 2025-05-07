// BotBase.ts
import { _decorator, Component, Prefab, Node, instantiate, Vec3, find, tween, v3, Enum, Sprite, Color, ParticleSystem2D, BoxCollider2D } from 'cc';
import { GameManager } from '../GameManager';
import { Move } from '../Move';
import { Bullet } from '../Bullet';
import { AudioController } from '../AudioController';
const { ccclass, property } = _decorator;

// Định nghĩa Enum cho trạng thái đạn
export enum BulletSpeedType {
    Normal = 0,
    Fast = 1,
    Slow = 2,
    Laze = 3,
}

export class BotBase extends Component {

    @property({ type: Prefab, tooltip: "Đạn" })
    private bulletPrefab: Prefab = null;

    @property({ type: Enum(BulletSpeedType), tooltip: "Trạng thái tốc độ đạn" })
    private bulletSpeedType: BulletSpeedType = BulletSpeedType.Normal;

    @property({ type: Node, tooltip: "Node súng" })
    protected gunNode: Node = null;

    @property({ type: Node, tooltip: "Điểm bắn đạn" })
    private arrShootPos: Node[] = [];

    protected onLoad(): void {
        this.node.setScale(new Vec3(0.01, 0.01, 0.01));

        tween(this.node)
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
    }

    // Bắn đạn tự động theo thời gian
    protected autoShot(timeShoot: number) {
        let time = timeShoot - GameManager.numWave * timeShoot;
        this.schedule(() => {

            if(this.bulletSpeedType === BulletSpeedType.Laze){
                AudioController.Instance.Laze();
            }else{
                AudioController.Instance.Fire();
            }

            this.arrShootPos.forEach(pos => {
                this.Shot(pos);
            });
        }, time);
    }

    // Phương thức bắn đạn
    protected Shot(shootPos: Node) {
        if (!this.bulletPrefab || !shootPos) {
            console.warn('Bullet prefab or shoot point is not set!');
            return;
        }

        const bullet = this.createBullet(shootPos);
        this.setBulletDirection(bullet, shootPos);
        this.setBulletSpeed(bullet);
    }

    // Hàm khởi tạo viên đạn từ prefab
    protected createBullet(shootPos: Node): Node {
        const parent = find('Canvas/GamePlay/Bullet');
        const bullet = instantiate(this.bulletPrefab);
        bullet.setParent(parent);
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

    // Hàm đặt tốc độ đạn
    private setBulletSpeed(bullet: Node) {
        const bulletControl = bullet.getComponent(Bullet);
        switch (this.bulletSpeedType) {
            case BulletSpeedType.Normal:
                bulletControl.normalSpeed();
                break;
            case BulletSpeedType.Fast:
                bulletControl.fastSpeed();
                break;
            case BulletSpeedType.Slow:
                bulletControl.slowSpeed();
                break;
            case BulletSpeedType.Laze:
                break;
        }
    }
}
