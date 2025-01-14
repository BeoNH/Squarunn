import { _decorator, Component, find, Node, v3, Vec3 } from 'cc';
import { BotBase } from './BotBase';
import { Move } from '../Move';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('Bot_4')
export class Bot_4 extends BotBase {

    botDir: Vec3 = v3(0, 1, 0);  // Hướng di chuyển

    start() {
        this.node.getComponent(Move).setDirection(this.botDir);
        // super.autoShot(GameManager.timeShootB4);
    }

    protected onEnable(): void {
        this.node.getComponent(Move).speed = GameManager.speedB4;
    }

    protected update(dt: number): void {
        const nodePos = this.node.position.clone();
        if (nodePos.y <= GameManager.arrMoveB4[0] || nodePos.y >= GameManager.arrMoveB4[1]) {
            this.botDir.y = -this.botDir.y;
            this.node.getComponent(Move).setDirection(this.botDir);
        }
    }

    // Ghi đè phương thức createBullet
    protected createBullet(shootPos: Node): Node {
        const parent = this.gunNode || find('Canvas');
        const bullet = super.createBullet(shootPos);
        bullet.setParent(parent);
        bullet.setWorldPosition(shootPos.worldPosition);
        return bullet;
    }
}


