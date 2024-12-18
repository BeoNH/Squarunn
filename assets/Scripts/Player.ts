import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Node, v3, Vec3 } from 'cc';
import { Move } from './Move';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    private activeKeys: Set<KeyCode> = new Set(); // Các phím đang được nhấn

    // Gọi khi bắt đầu trò chơi
    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    // Gọi khi node bị phá hủy
    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    // Khi node được khởi tạo
    onEnable(): void {
        this.node.getComponent(Move).speed = GameManager.speedPlayer;
    }

    // Bấm nút
    private onKeyDown(event: EventKeyboard) {
        this.activeKeys.add(event.keyCode);
        this.updateMoveDir();
    }

    // Nhả nút
    private onKeyUp(event: EventKeyboard) {
        this.activeKeys.delete(event.keyCode);
        this.updateMoveDir();
    }

    // Cập nhật hướng di chuyển
    private updateMoveDir() {
        const playerMoveDir = this.node.getComponent(Move).moveDir;
        playerMoveDir.set(0, 0, 0);
        if (this.activeKeys.has(KeyCode.ARROW_LEFT)) playerMoveDir.x -= 1;
        if (this.activeKeys.has(KeyCode.ARROW_RIGHT)) playerMoveDir.x += 1;
        if (this.activeKeys.has(KeyCode.ARROW_UP)) playerMoveDir.y += 1;
        if (this.activeKeys.has(KeyCode.ARROW_DOWN)) playerMoveDir.y -= 1;
    }
}


