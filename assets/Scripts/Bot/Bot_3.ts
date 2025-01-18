import { _decorator, Component, Node, v3, Vec3 } from 'cc';
import { BotBase } from './BotBase';
import { Move } from '../Move';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('Bot_3')
export class Bot_3 extends BotBase {

    botDir: Vec3 = v3(1, 0, 0);  // Hướng di chuyển

    start() {
        this.node.getComponent(Move).setDirection(this.botDir);
        super.autoShot(GameManager.timeShootB3);
    }

    protected onEnable(): void {
        this.node.getComponent(Move).speed = GameManager.speedB3;
    }

    protected update(dt: number): void {
        const nodePos = this.node.position.clone();
        if (nodePos.x <= GameManager.arrMoveB3[0] || nodePos.x >= GameManager.arrMoveB3[1]) {
            this.botDir.x = -this.botDir.x;
            this.node.getComponent(Move).setDirection(this.botDir);
        }
    }
}


