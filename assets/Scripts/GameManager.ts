import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    // Người chơi
    public static readonly speedPlayer: number = 400;
    public static readonly zoneMove = {
        x: { min: 50, max: 1870 },
        y: { min: 50, max: 780 }
    };

    //Đạn
    public static readonly speedBulletNomal: number = 250;
    public static readonly speedBulletFast: number[] = [100, 500];
    public static readonly speedBulletSlow: number[] = [500, 100];

    //Bot_1
    public static readonly timeShootB1: number = 1; // tốc độ bắn

    //Bot_2
    public static readonly timeShootB2: number = 1; // tốc độ bắn
    public static readonly speedGunRotation: number = 1; // số s quay được độ

    //Bot_3
    public static readonly timeShootB3: number = 1; // tốc độ bắn
    public static readonly speedB3: number = 150; // tốc độ di chuyển
    public static readonly arrMoveB3: number[] = [-800, 800]; // giới hạn di chuyển

    //Bot_3
    public static readonly timeShootB4: number = 5; // tốc độ bắn
    public static readonly speedB4: number = 150; // tốc độ di chuyển
    public static readonly arrMoveB4: number[] = [-400, 200]; // giới hạn di chuyển

}


