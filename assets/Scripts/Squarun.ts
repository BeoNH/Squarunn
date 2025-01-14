import { _decorator, Animation, AnimationState, Component, EPhysics2DDrawFlags, instantiate, Node, PhysicsSystem2D, Prefab, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Squarun')
export class Squarun extends Component {

    @property({ type: Node, tooltip: "Điểm sinh quái" })
    protected spawnPos: Node = null;

    @property({ type: Node, tooltip: "Map chứa Bot" })
    protected Map: Node = null;

    @property({ type: Prefab, tooltip: "DSach các con Bot" })
    protected listBot: Prefab[] = [];

    @property({ visible: true }) private __nodeReferencesHeader = "--- Node References ---";

    onLoad() {
        // this.debugPhysics();
        this.runWave();
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

    // Cấu hình spawn (vị trí, loại bot, lật, thời gian bot huỷ, thời gian sinh bot)
    private spawnConfig = [
        //wave 1
        { posIndex: 1, botIndex: 1, flip: 1, timeDestroy: 13, delay: 1 },
        { posIndex: 2, botIndex: 3, flip: 1, timeDestroy: 25, delay: 3 },
        { posIndex: 3, botIndex: 1, flip: 1, timeDestroy: 7, delay: 7 },
        { posIndex: 4, botIndex: 3, flip: -1, timeDestroy: 17, delay: 12 },
        { posIndex: 5, botIndex: 1, flip: 1, timeDestroy: 12, delay: 18 },
        //wave 2

    ];

    // Sinh bot theo cấu hình
    runWave() {
        for (const config of this.spawnConfig) {
            const { posIndex, botIndex, flip, timeDestroy, delay } = config;
            const tagetNode = this.spawnPos.getChildByPath(`${posIndex}`);
            if (!tagetNode) continue;

            this.scheduleOnce(() => {
                this.playSpawnAnimation(tagetNode, () => {
                    this.spawnBot(botIndex, tagetNode, flip, timeDestroy);
                });
            }, delay);
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
        bot.scale = new Vec3(flip, flip, bot.scale.z)

        //Huỷ bot
        this.scheduleOnce(() => {
            tween(bot)
                .to(0.2, { scale: new Vec3(0, 0, 0) })
                .call(() => bot.destroy())
                .start();
        }, timeDead);
    }


}


