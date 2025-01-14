import { _decorator, Collider2D, Component, Contact2DType, EventKeyboard, Input, input, IPhysics2DContact, KeyCode, Node, v3, Vec3 } from 'cc';
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

        const collider = this.node.getChildByPath(`body`).getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    // Cập nhật vị trí nếu vượt quá giới hạn
    update(dt: number) {
        const wPosition = this.node.worldPosition;

        let newX = Math.max(GameManager.zoneMove.x.min, Math.min(wPosition.x, GameManager.zoneMove.x.max));
        let newY = Math.max(GameManager.zoneMove.y.min, Math.min(wPosition.y, GameManager.zoneMove.y.max));


        if (wPosition.x !== newX || wPosition.y !== newY) {
            this.node.worldPosition = v3(newX, newY, wPosition.z);
        }
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
        const playerMoveDir = v3(Vec3.ZERO);
        if (this.activeKeys.has(KeyCode.ARROW_LEFT)) playerMoveDir.x -= 1;
        if (this.activeKeys.has(KeyCode.ARROW_RIGHT)) playerMoveDir.x += 1;
        if (this.activeKeys.has(KeyCode.ARROW_UP)) playerMoveDir.y += 1;
        if (this.activeKeys.has(KeyCode.ARROW_DOWN)) playerMoveDir.y -= 1;

        this.node.getComponent(Move).setDirection(playerMoveDir);
    }

    // Xử lý logic va chạm
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.node.name === "Wall") {
            console.log("Stop.");
        }
    }
}


