import { Creature } from "./Creature"
import { Environment } from "./Environment";
import { ButtonData, PushButton } from "./button";



// systems
engine.addSystem(new PushButton())


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



let machine = new Entity()
machine.addComponent(new BoxShape())
machine.addComponent(new Transform({
	position: new Vector3(15,0,22),
	scale: new Vector3(1,1,4)
}))
engine.addEntity(machine)


let tempUp = new Entity()
tempUp.addComponent(new Transform({
	position: new Vector3(14.5,0,21),
	scale: new Vector3(0.5,0.5,0.5),
	rotation: Quaternion.Euler(0, 0, 90)
}))
tempUp.addComponent(new GLTFShape("models/Button.glb"))
tempUp.addComponent(hotMaterial)
tempUp.addComponent(new OnClick(e => {
	neutral.temperature += 0.2
	tempUp.getComponent(ButtonData).pressed = true
	log("new temperature: ", neutral.temperature)
  }))
tempUp.addComponent(new ButtonData(14.5, 14.7))
engine.addEntity(tempUp)

let tempDown = new Entity()
tempDown.addComponent(new Transform({
	position: new Vector3(14.5,0,23),
	scale: new Vector3(0.5,0.5,0.5),
	rotation: Quaternion.Euler(0, 0, 90)
}))
tempDown.addComponent(new GLTFShape("models/Button.glb"))
tempDown.addComponent(coldMaterial)
tempDown.addComponent(new OnClick(e => {
	neutral.temperature -= 0.2
	tempDown.getComponent(ButtonData).pressed = true
	log("new temperature: ", neutral.temperature)
  }))
tempDown.addComponent(new ButtonData(14.5, 14.7))
engine.addEntity(tempDown)

