import { _decorator, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    public static Instance: AudioController;

    // @property({ type: Node, tooltip: "Sound" })
    // private iconSound: Node = null;
    // @property({ type: Node, tooltip: "Music" })
    // private iconMusic: Node = null;

    volumeS = 1;
    volumeM = 1;

    protected onLoad(): void {
        AudioController.Instance = this;
    }

    ClickSound() {
        this.volumeS == 1 ? this.volumeS = 0 : this.volumeS = 1;
        this.node.children.forEach((e, index) => { if (index != 0) { e.getComponent(AudioSource).volume = this.volumeS } })
    }

    ClickMusic() {
        this.volumeM == 1 ? this.volumeM = 0 : this.volumeM = 1;
        this.node.children[0].getComponent(AudioSource).volume = this.volumeM;
    }

    // protected update(dt: number): void {
    //     this.iconSound.children[0].active = this.volumeS == 0;
    //     this.iconMusic.children[0].active = this.volumeM == 0;
    // }

    GameOver() {
        this.node.getChildByName("game_over_ghe_ron").getComponent(AudioSource).play();
    }

    Fire() {
        this.node.getChildByName("tank_fire").getComponent(AudioSource).play();
    }

    Laze() {
        this.node.getChildByName("laser1").getComponent(AudioSource).play();
    }
}


