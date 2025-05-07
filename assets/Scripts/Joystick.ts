import { _decorator, Component, Enum, EventTarget, EventTouch, Node, UIOpacity, UITransform, v3, Vec3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Khởi tạo event emitter toàn cục
 */
export const eventTarget = new EventTarget();

/**
 * Enum loại tốc độ
 */
// export enum SpeedType {
//   STOP,   // Dừng
//   NORMAL, // Thường
//   FAST,   // Nhanh
// }

/**
 * Enum loại joystick
 */
export enum JoystickType {
    FIXED,  // Cố định
    FOLLOW, // Di chuyển theo
}

/**
 * Định nghĩa các sự kiện joystick để tương thích với code cũ
 */
export const JOYSTICK_EVENTS = {
    MOVE: 'joystick-move',
    END: 'joystick-end'
};

/**
 * Lớp Joystick
 */
@ccclass('Joystick')
export class Joystick extends Component {
    private static _instance: Joystick = null;
    public static get instance(): Joystick {
        return this._instance;
    }

    @property({ type: Node, tooltip: "Dot - Nút điều khiển" })
    public dot: Node = null;

    @property({ type: Node, tooltip: "Ring - Vòng tròn nền" })
    public ring: Node = null;

    @property({ type: Enum(JoystickType), tooltip: "Loại joystick (Cố định hoặc Di chuyển theo)" })
    public joystickType = JoystickType.FIXED;

    // Các biến private
    private _stickPos: Vec3 = null;           // Vị trí của cần điều khiển
    private _touchLocation: Vec2 = null;      // Vị trí chạm
    private _radius: number = 0;              // Bán kính của vòng tròn

    onLoad() {
        Joystick._instance = this;

        this._radius = this.ring.getComponent(UITransform).width / 2;
        this._initTouchEvent();

        const opacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
        opacity.opacity = this.joystickType === JoystickType.FIXED ? 255 : 0;
    }

    /**
     * Khởi tạo sự kiện touch
     */
    private _initTouchEvent() {
        this.node.on(Node.EventType.TOUCH_START, this._touchStartEvent, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this._touchMoveEvent, this);
        this.node.on(Node.EventType.TOUCH_END, this._touchEndEvent, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._touchEndEvent, this);
    }

    /**
     * Sự kiện bắt đầu chạm
     * @param event Sự kiện touch
     */
    private _touchStartEvent(event: EventTouch) {
        // eventTarget.emit(Node.EventType.TOUCH_START, event);

        // Lấy vị trí chạm
        let localMouse = event.getUILocation();
        const touchPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(localMouse.x, localMouse.y));

        if (this.joystickType === JoystickType.FIXED) {
            this._stickPos = this.ring.getPosition();

            // Tính khoảng cách từ điểm chạm đến trung tâm vòng tròn
            const distance = touchPos.subtract(this.ring.getPosition()).length();

            // Nếu chạm trong vòng tròn, di chuyển dot đến vị trí chạm
            this._radius > distance && this.dot.setPosition(touchPos);
        } else if (this.joystickType === JoystickType.FOLLOW) {
            // Lưu vị trí joystick cho touch move
            this._stickPos = touchPos;
            this.node.getComponent(UIOpacity).opacity = 255;
            this._touchLocation = event.getUILocation();

            // Di chuyển vòng tròn và dot đến vị trí chạm
            this.ring.setPosition(touchPos);
            this.dot.setPosition(touchPos);
        }
    }

    /**
     * Sự kiện di chuyển ngón tay
     * @param event Sự kiện touch
     */
    private _touchMoveEvent(event: EventTouch) {
        // Nếu vị trí touch start giống với touch move, không cho di chuyển
        if (
            this.joystickType === JoystickType.FOLLOW &&
            this._touchLocation &&
            this._touchLocation.equals(event.getUILocation())
        ) {
            return;
        }

        // Lấy vị trí chạm tương đối với ring
        let localMouse = event.getUILocation();
        const touchPos = this.ring.getComponent(UITransform).convertToNodeSpaceAR(v3(localMouse.x, localMouse.y));
        const distance = touchPos.length();

        // Vị trí mới là vị trí ban đầu cộng với vị trí di chuyển
        const posX = this._stickPos.x + touchPos.x;
        const posY = this._stickPos.y + touchPos.y;

        // Chuẩn hóa vector hướng
        const direction = v3(posX, posY).subtract(this.ring.getPosition()).normalize();


        if (this._radius > distance) {
            // Nếu trong bán kính, di chuyển tự do
            this.dot.setPosition(posX, posY);
        } else {
            // Nếu vượt quá bán kính, giới hạn trong vòng tròn
            const x = this._stickPos.x + direction.x * this._radius;
            const y = this._stickPos.y + direction.y * this._radius;
            this.dot.setPosition(v3(x, y));
        }

        // Phát sự kiện trong Joystick
        const joystickData = {
            direction: direction
        };
        eventTarget.emit(JOYSTICK_EVENTS.MOVE, joystickData);
    }

    /**
     * Sự kiện kết thúc chạm
     * @param event Sự kiện touch
     */
    private _touchEndEvent(event: EventTouch) {
        this.dot.setPosition(this.ring.getPosition());
        if (this.joystickType === JoystickType.FOLLOW) {
            this.node.getComponent(UIOpacity).opacity = 0;
        }

        eventTarget.emit(JOYSTICK_EVENTS.END);
    }

    /**
     * Phương thức on() cho tương thích ngược với code cũ
     */
    public on(eventName: string, callback: (...any: any[]) => void, target?: any) {
        eventTarget.on(eventName, callback, target);
    }

    /**
     * Phương thức off() cho tương thích ngược với code cũ
     */
    public off(eventName: string, callback: (...any: any[]) => void, target?: any) {
        eventTarget.off(eventName, callback, target);
    }
}


