import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    // Người chơi
    public static readonly speedPlayer: number = 350;
    public static readonly zoneMove = {
        x: { min: 50, max: 1870 },
        y: { min: 50, max: 780 }
    };

    //Đạn
    public static readonly speedBulletNomal: number[] = [200, 350];
    public static readonly speedBulletFast: number[] = [150, 350, 550, 800];
    public static readonly speedBulletSlow: number[] = [800, 450, 250, 150];

    public static readonly colorBulletFast: string = `#00FF1F`;
    public static readonly colorBulletSlow: string = `#00A3FF`;

    // Logic điểm
    // public static readonly scoreMultiplier: number = 10;

    // ============================================================= //
    // Cấu hình spawn (vị trí, loại bot, lật, thời gian bot huỷ, thời gian sinh bot)
    public static readonly spawnConfig = [
        //wave 1
        { posIndex: 1, botIndex: 1, flip: 1, timeDestroy: 13, delay: 1 },
        { posIndex: 2, botIndex: 2, flip: 1, timeDestroy: 25, delay: 3 },
        { posIndex: 3, botIndex: 1, flip: 1, timeDestroy: 7, delay: 7 },
        { posIndex: 4, botIndex: 3, flip: -1, timeDestroy: 17, delay: 12 },
        { posIndex: 5, botIndex: 4, flip: 1, timeDestroy: 12, delay: 18 },
        //wave 2

    ];

    //Bot_1.x
    public static readonly timeShootB1: number = 1.5; // tốc độ bắn

    //Bot_2
    public static readonly timeShootB2: number = 1.5; // tốc độ bắn
    public static readonly speedGunRotation: number = 1; // số s quay được độ

    //Bot_3
    public static readonly timeShootB3: number = 1.5; // tốc độ bắn
    public static readonly speedB3: number = 150; // tốc độ di chuyển
    public static readonly arrMoveB3: number[] = [-800, 800]; // giới hạn di chuyển trục X

    //Bot_4
    public static readonly timeShootB4: number = 5; // tốc độ bắn
    public static readonly speedB4: number = 150; // tốc độ di chuyển
    public static readonly arrMoveB4: number[] = [-400, 200]; // giới hạn di chuyển trục Y

}


