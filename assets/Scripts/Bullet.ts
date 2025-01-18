import { _decorator, Collider2D, Color, Component, Contact2DType, IPhysics2DContact, ParticleSystem2D, Sprite } from 'cc';
import { Move } from './Move';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    protected onLoad(): void {
        this.destroyNodeAfterDelay();
    }

    start() {
        const collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onDestroy() {
        const collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    // xử lý logic va chạm
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // console.log('Bullet hit:', otherCollider.node.name);

        this.scheduleOnce(() => {
            selfCollider.node.destroy();
        });
    }

    normalSpeed() {
        const [minSpeed, maxSpeed] = GameManager.speedBulletNomal;
        const randomSpeed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
        this.node.getComponent(Move).speed = randomSpeed;
    }

    fastSpeed() {
        this.setColor(GameManager.colorBulletFast);
        this.node.getComponent(Move).speed = GameManager.speedBulletFast[0];
        this.scheduleOnce(() => {
            this.node.getComponent(Move).speed = GameManager.speedBulletFast[1];
            this.scheduleOnce(() => {
                this.node.getComponent(Move).speed = GameManager.speedBulletFast[2];
                this.scheduleOnce(() => {
                    this.node.getComponent(Move).speed = GameManager.speedBulletFast[3];
                }, 0.1)
            }, 0.1)
        }, 0.8)
    }

    slowSpeed() {
        this.setColor(GameManager.colorBulletSlow);
        this.node.getComponent(Move).speed = GameManager.speedBulletSlow[0];
        this.scheduleOnce(() => {
            this.node.getComponent(Move).speed = GameManager.speedBulletSlow[1];
            this.scheduleOnce(() => {
                this.node.getComponent(Move).speed = GameManager.speedBulletSlow[2];
                this.scheduleOnce(() => {
                    this.node.getComponent(Move).speed = GameManager.speedBulletSlow[3];
                }, 0.1)
            }, 0.1)
        }, 0.8)
    }

    // Thiết lập màu
    setColor(codeHEX: string) {
        const newColor = new Color().fromHEX(codeHEX);

        const sprite = this.node.getChildByPath(`image`)?.getComponent(Sprite);
        const particle = this.node.getChildByPath(`effect`)?.getComponent(ParticleSystem2D);

        if (sprite) sprite.color = newColor;
        if (particle) particle.startColor = newColor;
    }

    // Tạo hẹn giờ để kiểm tra và xóa node
    destroyNodeAfterDelay() {
        if (!this.node) return;

        this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
                this.node.destroy();
            }
        }, 30);
    }
}


