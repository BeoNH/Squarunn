import { _decorator, Component, EPhysics2DDrawFlags, Node, PhysicsSystem2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Squarun')
export class Squarun extends Component {
    onLoad() {
        // this.debugPhysics();
    }

    update(deltaTime: number) {

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
}


