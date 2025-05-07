import { _decorator, Collider2D, Color, Component, Contact2DType, EventKeyboard, EventTouch, Input, input, IPhysics2DContact, KeyCode, Node, ParticleSystem2D, Sprite, sys, v3, Vec3 } from 'cc';
import { Move } from './Move';
import { GameManager } from './GameManager';
import { Squarun } from './Squarun';
import { UIControler } from './UIControler';
import { Joystick, JOYSTICK_EVENTS } from './Joystick';
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
        this.connectToJoystick();

        this.node.setPosition(Vec3.ZERO);
        this.playerBody.active = true

        this.blinkEffect();
    }

    // Vô hiệu hoá người chơi
    disablePlayer() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.disconnectJoystick();

        this.playerBody.active = false;
        if (this.particle) {
            this.particle.stopSystem(); // Tắt hiệu ứng hạt
        }
    }

    // Bấm nút
    private onKeyDown(event: EventKeyboard) {
        this.activeKeys.add(event.keyCode);
        this.updateMoveDir(this.activeKeys);
    }

    // Nhả nút
    private onKeyUp(event: EventKeyboard) {
        this.activeKeys.delete(event.keyCode);
        this.updateMoveDir(this.activeKeys);
    }

    // Cập nhật hướng di chuyển
    public updateMoveDir(activeKeys) {
        const playerMoveDir = v3(Vec3.ZERO);
        if (activeKeys && activeKeys.has(KeyCode.ARROW_LEFT)) playerMoveDir.x -= 1;
        if (activeKeys && activeKeys.has(KeyCode.ARROW_RIGHT)) playerMoveDir.x += 1;
        if (activeKeys && activeKeys.has(KeyCode.ARROW_UP)) playerMoveDir.y += 1;
        if (activeKeys && activeKeys.has(KeyCode.ARROW_DOWN)) playerMoveDir.y -= 1;

        this.node.getComponent(Move).setDirection(playerMoveDir);
    }

    // Kết nối Player với Joystick
    private connectToJoystick() {
        if (Joystick.instance) {
            Joystick.instance.on(JOYSTICK_EVENTS.MOVE, this.onJoystickMoveEvent, this);
            Joystick.instance.on(JOYSTICK_EVENTS.END, this.onJoystickEndEvent, this);
        }
    }

    // Hủy lắng nghe khi không cần thiết
    private disconnectJoystick() {
        if (Joystick.instance) {
            Joystick.instance.off(JOYSTICK_EVENTS.MOVE, this.onJoystickMoveEvent, this);
            Joystick.instance.off(JOYSTICK_EVENTS.END, this.onJoystickEndEvent, this);
        }
    }

    // Phương thức lắng nghe sự kiện từ Joystick
    private onJoystickMoveEvent(joystickEvent: any): void {
        this.node.getComponent(Move).setDirection(joystickEvent.direction);
    }

    // Phương thức lắng nghe sự kiện từ Joystick
    private onJoystickEndEvent(): void {
        this.node.getComponent(Move).setDirection(Vec3.ZERO);
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
                    UIControler.instance.onOpen(null, `over`);
                    let time = Squarun.Instance.getTimer();
                    UIControler.instance.timeResults(time.sTime, time.bTime);
                    let numDead = Number(sys.localStorage.getItem(`Dead`)) ? Number(sys.localStorage.getItem(`Dead`)) : 0;
                    sys.localStorage.setItem(`Dead`, `${numDead + 1}`);
                    this.disablePlayer();
                    this.updateMoveDir(null);

                    break;
            }
        }, 0.01)
    }
}


