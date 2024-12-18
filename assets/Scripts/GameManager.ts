import { _decorator, Component} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    public static readonly speedPlayer: number = 500;
}


