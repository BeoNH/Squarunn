import { _decorator, Component, find, Game, instantiate, Node, Prefab, Vec3 } from 'cc';
import { Move } from '../Move';
import { GameManager } from '../GameManager';
import { BotBase } from './BotBase';
const { ccclass, property } = _decorator;

@ccclass('Bot_2')
export class Bot_2 extends BotBase {

    protected start(): void {
        super.autoShot(GameManager.timeShootB2);
    }

    // Xoay tròn
    update(deltaTime: number) {
        const currentRotation = this.gunNode.eulerAngles;
        const speed = currentRotation.z + 45 * deltaTime * GameManager.speedGunRotation;
        this.gunNode.setRotationFromEuler(new Vec3(currentRotation.x, currentRotation.y, speed));
    }
}


