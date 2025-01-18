import { _decorator, Animation, AnimationState, Component, EPhysics2DDrawFlags, find, instantiate, Label, Node, PhysicsSystem2D, Prefab, Sprite, sys, tween, Vec3 } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Squarun')
export class Squarun extends Component {
    public static Instance: Squarun;

    @property({ type: Node, tooltip: "Điểm sinh quái" })
    protected spawnPos: Node = null;

    @property({ type: Node, tooltip: "Map chứa Bot" })
    protected Map: Node = null;

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

    private score: number = 0 // Điểm người chơi
    private highTime: number = 0; // Thời gian chơi cao nhất trong phiên
    private elapsedTime: number = 0; // Thời gian đã trôi qua
    private numberDead: number = 0; // Số lần chết

    onLoad() {
        Squarun.Instance = this;

        // this.debugPhysics();

        this.defausData();
        this.resetGame();
    }

    protected start(): void {

    }

    debugPhysics() {
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.debugDrawFlags =
            EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;
    }

    //Data mặc định
    defausData() {
        this.elapsedTime = 0;
        this.highTime = Number(sys.localStorage.getItem('highTime')) ? Number(sys.localStorage.getItem('highTime')) : 0;
        this.numberDead = Number(sys.localStorage.getItem(`Dead`)) ? Number(sys.localStorage.getItem(`Dead`)) : 0;
        this.score = Number(sys.localStorage.getItem(`Score`)) ? Number(sys.localStorage.getItem(`Score`)) : 0;
    }

    // Đặt lại bộ đếm
    resetGame() {
        this.stopGame();
        this.startGame();
    }

    // Bắt đầu chơi
    startGame() {
        this.elapsedTime = 0;
        this.schedule(this.updateTimer, 1);
        this.runWave();
    }

    stopGame() {
        this.unschedule(this.updateTimer);
        this.clearBots();

        // Mạng
        if (this.labelDead) {
            this.labelDead.string = `${this.numberDead}`;
        }


        // Thời gian
        if (this.elapsedTime > this.highTime) {
            this.highTime = this.elapsedTime;
            sys.localStorage.setItem('highTime', this.highTime.toString());
        }
        if (this.labelHighTime) {
            this.labelHighTime.string = this.formatTime(this.highTime);
        }
        if (this.labelTime) {
            this.labelTime.string = '00:00';
        }


        // Điểm
        // Xác định điểm số dựa trên mốc thời gian
        let scoreMultiplier: number;

        if (this.elapsedTime <= 30) {
            scoreMultiplier = 10;
        } else if (this.elapsedTime <= 60) {
            scoreMultiplier = 15;
        } else if (this.elapsedTime <= 120) {
            scoreMultiplier = 20;
        } else {
            scoreMultiplier = 30;
        }

        this.score = Math.floor(this.elapsedTime / 10) * scoreMultiplier;

        if (this.labelScore) {
            this.labelScore.string = `${this.score}`;
        }

    }

    // Cập nhật giao diện thời gian chơi
    updateTimer() {
        this.elapsedTime += 1;

        if (this.labelTime) {
            this.labelTime.string = this.formatTime(this.elapsedTime);
        }
    }

    // Định dạng giờ, phút, giây
    formatTime(timer: number): string {
        const minutes = Math.floor(timer / 60);
        const secs = Math.floor(timer % 60);

        const formattedMinute = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSecond = secs < 10 ? `0${secs}` : secs;

        return `${formattedMinute}:${formattedSecond}`;
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

    // Dừng toàn bộ anim sinh bot
    private stopSpawnAnimation() {
        this.spawnPos.children.forEach(e => {
            const animation = e.getComponent(Animation);
            if (animation) {
                animation.stop();
                e.getComponent(Sprite).spriteFrame = null;
            }
        });
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
    }

}


