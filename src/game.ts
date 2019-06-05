import { newSon } from "./reproduce";
import { WalkAround } from "./random-walking";
import { DieSLowly } from "./survival";


engine.addSystem(new WalkAround())
engine.addSystem(new DieSLowly())

// first dogs

newSon()
newSon()
// newSon()
// newSon()
// newSon()



let testCreature = new Entity()
testCreature.addComponent(new Transform({
	position: new Vector3(20, 0, 20)
}))
testCreature.addComponent(new GLTFShape("models/testCreature.glb"))

engine.addEntity(testCreature)