import { _decorator, Collider2D, Color, Component, Contact2DType, EventKeyboard, Input, input, IPhysics2DContact, KeyCode, Node, ParticleSystem2D, Sprite, sys, v3, Vec3 } from 'cc';
import { Move } from './Move';
import { GameManager } from './GameManager';
import { Squarun } from './Squarun';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    public static Instance: Player;

    @property({ type: Node, tooltip: "Hình ảnh người chơi" })
    protected playerBody: Node = null;

    private activeKeys: Set<KeyCode> = new Set(); // Các phím đang được nhấn
    private collider: Collider2D; // Vòng va chạm
    private particle: ParticleSystem2D; // Hiệu ứng hạt

    onLoad() {
        Player.Instance = this;

        if (!this.collider) {
            this.collider = this.node.getChildByPath(`body`).getComponent(Collider2D);
            if (this.collider) {
                this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }
        }

        if (!this.particle) {
            this.particle = this.node.getChildByPath(`Particle2D`).getComponent(ParticleSystem2D);
        }

        this.activatePlayer();
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

    // Khởi tạo lại người chơi
    activatePlayer() {
        this.node.getComponent(Move).speed = GameManager.speedPlayer;
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

        this.node.setPosition(Vec3.ZERO);
        this.playerBody.active = true

        this.blinkEffect();
    }

    // Vô hiệu hoá người chơi
    disablePlayer() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);

        this.playerBody.active = false;
        if (this.particle) {
            this.particle.stopSystem(); // Tắt hiệu ứng hạt
        }
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

    // HIệu ứng xuất hiện / khi trúng đạn
    private blinkEffect() {
        if (!this.playerBody) return;

        this.collider.enabled = false;
        if (this.particle) {
            this.particle.stopSystem(); // Tắt hiệu ứng hạt
        }

        let isVisible = true;
        let elapsedTime = 0;

        // Hàm lặp nhấp nháy
        const blinkAction = () => {
            isVisible = !isVisible;
            let sprite = this.playerBody.getComponent(Sprite);
            sprite.color = isVisible ? Color.WHITE : new Color(255, 255, 255, 100); //giảm độ mờ
            elapsedTime += 0.2;

            if (elapsedTime >= GameManager.immortalTime) {
                // Kết thúc nhấp nháy
                sprite.color = Color.WHITE;
                this.unschedule(blinkAction);
                this.collider.enabled = true;
                if (this.particle) {
                    this.particle.resetSystem();
                }

            }
        };

        // Bắt đầu nhấp nháy
        this.schedule(blinkAction, 0.2);
    }

    // Xử lý logic va chạm
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        this.scheduleOnce(() => {
            switch (otherCollider.group) {
                case 4:
                    console.log(`Bullet`);
                case 16:
                    console.log(`Bot`);

                    Squarun.Instance.stopGame();
                    Squarun.Instance.popupGameover.active = true;
                    let numDead = Number(sys.localStorage.getItem(`Dead`)) ? Number(sys.localStorage.getItem(`Dead`)) : 0;
                    sys.localStorage.setItem(`Dead`, `${numDead + 1}`);
                    this.disablePlayer();

                    break;
            }
        }, 0.01)
    }
}


