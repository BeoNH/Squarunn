import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact} from 'cc';
import { Move } from './Move';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

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
        this.node.getComponent(Move).speed = GameManager.speedBulletNomal;
    }

    fastSpeed() {
        this.node.getComponent(Move).speed = GameManager.speedBulletFast[0];
        this.scheduleOnce(() => {
            this.node.getComponent(Move).speed = GameManager.speedBulletFast[1];
        })
    }

    slowSpeed() {
        this.node.getComponent(Move).speed = GameManager.speedBulletSlow[0];
        this.scheduleOnce(() => {
            this.node.getComponent(Move).speed = GameManager.speedBulletSlow[1];
        })
    }
}


