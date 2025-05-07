import { _decorator, Animation, Component, EPhysics2DDrawFlags, instantiate, Label, Node, PhysicsSystem2D, Prefab, Sprite, sys, Toggle, tween, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('Squarun')
export class Squarun extends Component {
    public static Instance: Squarun;

    @property({ type: Node, tooltip: "Điểm sinh quái" })
    protected spawnPos: Node = null;

    @property({ type: Node, tooltip: "Map chứa Bot" })
    protected Map: Node = null;

    @property({ type: Node, tooltip: "Node chứa đạn" })
    protected Bullet: Node = null;

    @property({ type: Prefab, tooltip: "DSach các con Bot" })
    protected listBot: Prefab[] = [];

    @property({ type: Label, tooltip: "Số điểm người chơi đạt được" })
    protected labelScore: Label = null;

    @property({ type: Label, tooltip: "Bộ đếm thời gian tăng dần" })
    protected labelTime: Label = null;

    @property({ type: Label, tooltip: "Thời gian sống lâu nhất" })
    protected labelHighTime: Label = null;

    @property({ type: Label, tooltip: "Số lần chết của tài khoản" })
    protected labelDead: Label = null;
    
    @property({ type: Node, tooltip: "Node chứa Joystick" })
    protected Joystick: Node = null;

    @property({ type: Node, tooltip: "Hướng dẫn ban đầu cho Mobile" })
    protected mobileGuide: Node = null;

    @property({ readonly: true, editorOnly: true, serializable: false })
    private HEADER_UI: string = "========== CÁC NODE TEST ==========";

    private score: number = 0 // Điểm người chơi
    private highTime: number = 0; // Thời gian chơi cao nhất trong phiên
    private elapsedTime: number = 0; // Thời gian đã trôi qua
    private isMobileGameStarted: boolean = false;

    onLoad() {
        Squarun.Instance = this;

        // this.debugPhysics();
        if (sys.isMobile) {
            this.Joystick.active = true;
            this.mobileGuide.active = true;
            this.isMobileGameStarted = false;
        }
    }

    hideMobileGuide() {
        this.mobileGuide.active = false;
        if (sys.isMobile && !this.isMobileGameStarted) {
            this.isMobileGameStarted = true;
            this.startGame();
        }
    }

    update(dt: number) {}

    // Hiển thị hệ va chạm
    debugPhysics() {
        const physics = PhysicsSystem2D.instance;

        physics.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;
    }

    // rizeScene(){
    //     const screenSize = screen.windowSize;
    //     if (screenSize.width > screenSize.height) {
    //         view.setDesignResolutionSize(1920, 1080, ResolutionPolicy.FIXED_HEIGHT | ResolutionPolicy.FIXED_WIDTH); 
    //     } else {
    //         view.setDesignResolutionSize(1920, 1080, ResolutionPolicy.FIXED_HEIGHT | ResolutionPolicy.FIXED_WIDTH);
    //     }
    // }

    //Data mặc định
    defausData() {
        this.elapsedTime = 0;
        this.highTime = Number(sys.localStorage.getItem('highTime')) ? Number(sys.localStorage.getItem('highTime')) : 0;
        this.score = Number(sys.localStorage.getItem(`Score`)) ? Number(sys.localStorage.getItem(`Score`)) : 0;
    }

    // Đặt lại bộ đếm
    resetGame() {
        Player.Instance.activatePlayer();
        this.unschedule(this.updateTimer);
        this.clearBots();
        
        if (sys.isMobile && !this.isMobileGameStarted) return;
        
        this.startGame();
    }

    // Bắt đầu chơi
    startGame() {
        this.elapsedTime = 0;
        GameManager.numWave = 0;
        this.schedule(this.updateTimer, 1);
        this.runWave();
    }

    // Dừng game
    stopGame() {
        this.unschedule(this.updateTimer);
        this.clearBots();
        //Kiểm tra top thành tích
        if (this.highTime < this.elapsedTime) {
            this.highTime = this.elapsedTime;
            sys.localStorage.setItem('highTime', String(this.highTime));
        }
        this.mobileGuide.active = false;
    }

    // Trả về thời gian hiện tại
    getTimer() {
        return {
            sTime: this.formatTime(this.elapsedTime),
            bTime: this.formatTime(this.highTime),
        }
    }

    // Format thời gian từ giây đi sang định dạng phút:giây
    formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
    }

    // Update thành tích
    updateScore() {
        let txtScore = Number(sys.localStorage.getItem('Score')) ? Number(sys.localStorage.getItem('Score')) : 0;
        let numActive = this.score + 1;

        if (this.labelScore) {
            this.labelScore.string = `${numActive}`;
        }

        if (this.labelDead) {
            this.labelDead.string = `${Number(sys.localStorage.getItem(`Dead`)) ? Number(sys.localStorage.getItem(`Dead`)) : 0}`;
        }

        if (this.labelHighTime) {
            this.labelHighTime.string = this.formatTime(this.highTime);
        }

        this.score = numActive;
        sys.localStorage.setItem('Score', String(numActive > txtScore ? numActive : txtScore));
    }

    // Cập nhật giao diện thời gian chơi
    updateTimer() {
        this.elapsedTime += 1;

        if (this.labelTime) {
            this.labelTime.string = this.formatTime(this.elapsedTime);
        }
    }

    // Chạy anim sinh bot từ góc phải trên
    spawnTopRight(){
        // Nếu GameManager.spawnTopRight chưa được định nghĩa, tạo một config mặc định
        const config = [
            { posIndex: 1, botIndex: 0, flip: 1, timeDestroy: 10, delay: 0 }
        ];

        for (let i = 0; i < config.length; i++) {
            const { posIndex, botIndex, flip, timeDestroy, delay } = config[i];
            const tagetNode = this.spawnPos.getChildByPath(`${posIndex}`);
            if (!tagetNode) continue;
            this.spawnBot(botIndex, tagetNode, flip, timeDestroy);
        }
    }

    // Sinh bot theo cấu hình
    runWave() {
        const config = GameManager.spawnConfig;
        for (let i = 0; i < config.length; i++) {
            const { posIndex, botIndex, flip, timeDestroy, delay } = config[i];
            const tagetNode = this.spawnPos.getChildByPath(`${posIndex}`);
            if (!tagetNode) continue;

            this.scheduleOnce(() => {
                this.playSpawnAnimation(tagetNode, () => {
                    this.spawnBot(botIndex, tagetNode, flip, timeDestroy);
                });
            }, delay);

            //===== Endless vô hạn =====//
            if (i === config.length - 1) {
                this.scheduleOnce(() => {
                    this.runWave();
                    GameManager.numWave += 0.1;
                }, delay + timeDestroy + 5)
            }
        }
    }

    // Chạy anim sinh bot
    private playSpawnAnimation(pos: Node, callback: () => void) {
        const animation = pos.getComponent(Animation);
        if (animation) {
            animation.play();
            animation.once(Animation.EventType.FINISHED, callback, this);
        } else {
            console.warn(`Không tìm thấy Animation trên node: ${pos.name}`);
            callback();
        }
    }

    // Dừng tất cả animation
    stopSpawnAnimation() {
        for (let i = 1; i <= 11; i++) {
            const tagetNode = this.spawnPos.getChildByPath(`${i}`);
            if (!tagetNode) continue;

            const animation = tagetNode.getComponent(Animation);
            if (animation) {
                animation.stop();
                tagetNode.getComponent(Sprite).spriteFrame = null;
            }
        }
    }

    // Sinh bot và đặt vào map
    spawnBot(botIndex: number, pos: Node, flip: number, timeDead: number) {
        const botPrefab = this.listBot[botIndex];
        if (!botPrefab) {
            console.error(`Không tìm thấy bot với index: ${botIndex}`);
            return;
        }

        const bot = instantiate(botPrefab);
        bot.parent = this.Map;
        bot.worldPosition = pos.worldPosition;
        bot.angle = flip < 0 ? 180 : 0;

        //Huỷ bot
        this.scheduleOnce(() => {
            tween(bot)
                .to(0.2, { scale: new Vec3(0, 0, 0) })
                .call(() => bot.destroy())
                .start();
        }, timeDead);
    }

    // Xoá tất cả bot hiện có trên game
    clearBots() {
        this.unscheduleAllCallbacks();
        this.stopSpawnAnimation();
        if (this.Map) {
            this.Map.destroyAllChildren();
        }

        if (this.Bullet) {
            this.Bullet.destroyAllChildren();
        }
    }
}


