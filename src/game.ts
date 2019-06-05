import { Creature } from "./Creature"

let adamEntity = new Entity()
let adam = new Creature(adamEntity)
adamEntity.addComponent(adam)
adam.transform.position = new Vector3(24, 0, 24)
adam.TargetRandomPosition()

let testCreature = new Entity()
testCreature.addComponent(new Transform({
	position: new Vector3(5, 0, 5)
}))
testCreature.addComponent(new GLTFShape("models/testCreature.glb"))

engine.addEntity(testCreature)