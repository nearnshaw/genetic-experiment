import { Creature } from "./Creature"
import { Environment } from "./Environment";

// TODO: Instantiate 'experimentation corral' here. We can use the 'memory game' buttons for the environmental control buttons.


// Instanciar environments
let neutralEnvironment = new Entity()
let neutral = new Environment(0.5)
neutralEnvironment.addComponent(neutral)
neutralEnvironment.addComponent(new PlaneShape())
neutralEnvironment.addComponent(new Transform({
	position: new Vector3(24,0,24),
	scale: new Vector3(16,16,16),
	rotation: Quaternion.Euler(90,0,0)
}))
engine.addEntity(neutralEnvironment)



// Instantiate first creature
let adamEntity = new Entity()
let adam = new Creature(adamEntity)
adamEntity.addComponent(adam)
adam.transform.position = new Vector3(24, 0, 24)
adam.TargetRandomPosition()
adam.environment = neutral

let testCreature = new Entity()
testCreature.addComponent(
  new Transform({
    position: new Vector3(5, 0, 5)
  })
)
testCreature.addComponent(new GLTFShape("models/testCreature.glb"))

engine.addEntity(testCreature)
