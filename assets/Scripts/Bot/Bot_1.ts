import { _decorator, find, misc, Node, tween, Vec3 } from 'cc';
import { BotBase } from './BotBase';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('Bot_1')
export class Bot_1 extends BotBase {

    private targetNode: Node = null;
    private lastTargetPos: Vec3 = new Vec3();

    protected start(): void {
        this.targetNode = find('Canvas').getChildByPath('GamePlay/Player');
        super.autoShot(GameManager.timeShootB1);
    }

    // Theo dõi Player
    update(dt: number) {
        if (this.targetNode) {
            const targetPos = this.targetNode.worldPosition.clone();
            if (!targetPos.equals(this.lastTargetPos)) {
                this.lastTargetPos.set(targetPos);

                const currentPos = this.gunNode.worldPosition.clone();
                const direction = targetPos.subtract(currentPos);
                const angleRad = Math.atan2(direction.y, direction.x);
                const angleDeg = misc.radiansToDegrees(angleRad);

                this.gunNode.angle = angleDeg;
            }
        }
    }

}


