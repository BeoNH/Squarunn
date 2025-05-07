import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    // Người chơi
    public static readonly speedPlayer: number = 450;
    public static readonly zoneMove = {
        x: { min: 60, max: 1860 },
        y: { min: 60, max: 770 }
    };
    public static readonly immortalTime: number = 3;

    //Đạn
    public static readonly speedBulletNomal: number[] = [200, 350];
    // public static readonly speedBulletNomal: number[] = [100, 150]; // Đạn test
    public static readonly speedBulletFast: number[] = [150, 270, 400, 500];
    public static readonly speedBulletSlow: number[] = [800, 450, 250, 150];

    public static readonly colorBulletFast: string = `#00FF1F`;
    public static readonly colorBulletSlow: string = `#00A3FF`;

    // Logic điểm
    // public static readonly scoreMultiplier: number = 10;

    // ============================================================= //
    // Cấu hình spawn (vị trí, loại bot, lật, thời gian bot huỷ, thời gian sinh bot)
    public static readonly spawnConfig = [
        // Số s thực tế = số s cuối wave + 2s anim
        //wave 1
        { posIndex: 1, botIndex: 1, flip: 1, timeDestroy: 23, delay: 1 },
        { posIndex: 2, botIndex: 5, flip: 1, timeDestroy: 20, delay: 8 },
        { posIndex: 3, botIndex: 1, flip: 1, timeDestroy: 15, delay: 10 },
        { posIndex: 4, botIndex: 5, flip: -1, timeDestroy: 16, delay: 12 },//28s
        //wave 2
        { posIndex: 5, botIndex: 4, flip: 1, timeDestroy: 25, delay: 28 },
        { posIndex: 1, botIndex: 2, flip: 1, timeDestroy: 26, delay: 32 },
        { posIndex: 3, botIndex: 3, flip: 1, timeDestroy: 25, delay: 33 },
        { posIndex: 6, botIndex: 0, flip: 1, timeDestroy: 7, delay: 51 },
        { posIndex: 7, botIndex: 0, flip: 1, timeDestroy: 7, delay: 51 },
        { posIndex: 8, botIndex: 0, flip: 1, timeDestroy: 7, delay: 51 },
        { posIndex: 9, botIndex: 0, flip: 1, timeDestroy: 7, delay: 51 },//58s
        //wave 3
        { posIndex: 10, botIndex: 6, flip: 1, timeDestroy: 17, delay: 58 },
        { posIndex: 11, botIndex: 6, flip: -1, timeDestroy: 15, delay: 60 },
        { posIndex: 6, botIndex: 1, flip: 1, timeDestroy: 15, delay: 73 },
        { posIndex: 7, botIndex: 1, flip: 1, timeDestroy: 10, delay: 78},
        { posIndex: 8, botIndex: 1, flip: 1, timeDestroy: 15, delay: 73 },
        { posIndex: 9, botIndex: 1, flip: 1, timeDestroy: 10, delay: 78 },
        { posIndex: 5, botIndex: 0, flip: 1, timeDestroy: 10, delay: 78 },//88s
    ];

    public static numWave: number = 0; //tăng thêm 0,1 (10%) tốc độ bắn mỗi lần chạy hết spawnConfig

    //Bot_1.x
    public static readonly timeShootB1: number = 1.7; // tốc độ bắn

    //Bot_2
    public static readonly timeShootB2: number = 1.7; // tốc độ bắn
    public static readonly speedGunRotation: number = 1; // số s quay được độ

    //Bot_3
    public static readonly timeShootB3: number = 1.7; // tốc độ bắn
    public static readonly speedB3: number = 150; // tốc độ di chuyển
    public static readonly arrMoveB3: number[] = [-800, 800]; // giới hạn di chuyển trục X

    //Bot_4
    public static readonly timeShootB4: number = 4; // tốc độ bắn
    public static readonly speedB4: number = 150; // tốc độ di chuyển
    public static readonly arrMoveB4: number[] = [-400, 200]; // giới hạn di chuyển trục Y

}


