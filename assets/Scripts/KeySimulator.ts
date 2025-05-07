import { _decorator, Component, EventTouch, KeyCode, Node } from 'cc';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('KeySimulator')
export class KeySimulator extends Component {
    @property({ type: Node, tooltip: 'Nút Lên' })
    public upNode: Node = null!;

    @property({ type: Node, tooltip: 'Nút Xuống' })
    public downNode: Node = null!;

    @property({ type: Node, tooltip: 'Nút Trái' })
    public leftNode: Node = null!;

    @property({ type: Node, tooltip: 'Nút Phải' })
    public rightNode: Node = null!;

    private activeKeys = new Set<KeyCode>();
    private boundHandlers: Map<Node, Function> = new Map();

    onLoad() {
        // Đăng ký sự kiện chạm cho các nút đã được gán
        this.registerTouch(this.upNode, KeyCode.ARROW_UP);
        this.registerTouch(this.downNode, KeyCode.ARROW_DOWN);
        this.registerTouch(this.leftNode, KeyCode.ARROW_LEFT);
        this.registerTouch(this.rightNode, KeyCode.ARROW_RIGHT);
    }

    onDestroy() {
        // Dọn dẹp tất cả sự kiện
        this.unregisterAllTouches();
    }

    private registerTouch(node: Node, keyCode: KeyCode) {
        if (!node) return;
        const handler = (e: EventTouch) => this.simulateKey(e, keyCode);
        this.boundHandlers.set(node, handler);
        
        node.on(Node.EventType.TOUCH_START, handler);
        node.on(Node.EventType.TOUCH_END, handler);
        node.on(Node.EventType.TOUCH_CANCEL, handler);
    }

    private unregisterAllTouches() {
        this.unregisterTouch(this.upNode);
        this.unregisterTouch(this.downNode);
        this.unregisterTouch(this.leftNode);
        this.unregisterTouch(this.rightNode);
        this.boundHandlers.clear();
    }

    private unregisterTouch(node: Node) {
        if (!node) return;
        
        const handler = this.boundHandlers.get(node);
        if (handler) {
            node.off(Node.EventType.TOUCH_START, handler);
            node.off(Node.EventType.TOUCH_END, handler);
            node.off(Node.EventType.TOUCH_CANCEL, handler);
            this.boundHandlers.delete(node);
        }
    }

    private simulateKey(event: EventTouch, keyCode: KeyCode) {
        const isPressed = event.type === Node.EventType.TOUCH_START;

        if (isPressed) this.activeKeys.add(keyCode);
        else this.activeKeys.delete(keyCode);

        if (Player.Instance) {
            Player.Instance.updateMoveDir(this.activeKeys);
        }
    }
}


