import { Creature } from "./Creature"
import { Environment } from "./Environment";

// TODO: Instantiate 'experimentation corral' here. We can use the 'memory game' buttons for the environmental control buttons.


// temp textures
let hotMaterial = new Material()
hotMaterial.albedoColor = Color3.Red()

let coldMaterial = new Material()
coldMaterial.albedoColor = Color3.Blue()


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


// Instanciar environments
let hotEnvironment = new Entity()
let hot = new Environment(1)
hotEnvironment.addComponent(hot)
hotEnvironment.addComponent(new PlaneShape())
hotEnvironment.addComponent(new Transform({
	position: new Vector3(8,0,8),
	scale: new Vector3(16,16,16),
	rotation: Quaternion.Euler(90,0,0)
}))
hotEnvironment.addComponent(hotMaterial)
engine.addEntity(hotEnvironment)


// Instanciar environments
let coldEnvironment = new Entity()
let cold = new Environment(0)
coldEnvironment.addComponent(cold)
coldEnvironment.addComponent(new PlaneShape())
coldEnvironment.addComponent(new Transform({
	position: new Vector3(40,0,40),
	scale: new Vector3(16,16,16),
	rotation: Quaternion.Euler(90,0,0)
}))
coldEnvironment.addComponent(coldMaterial)
engine.addEntity(coldEnvironment)


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



let tempUp = new Entity()
tempUp.addComponent(new Transform({
	position: new Vector3(15,0,20),
	scale: new Vector3(0.5,0.5,0.5)
}))
tempUp.addComponent(new BoxShape())
tempUp.addComponent(hotMaterial)
tempUp.addComponent(new OnClick(e => {
	neutral.temperature += 0.2
	log("new temperature: ", neutral.temperature)
  }))
engine.addEntity(tempUp)

let tempDown = new Entity()
tempDown.addComponent(new Transform({
	position: new Vector3(15,0,22),
	scale: new Vector3(0.5,0.5,0.5)
}))
tempDown.addComponent(new BoxShape())
tempDown.addComponent(coldMaterial)
tempDown.addComponent(new OnClick(e => {
	neutral.temperature -= 0.2
	log("new temperature: ", neutral.temperature)
  }))
engine.addEntity(tempDown)