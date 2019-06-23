import { Creature, chipaPool, creatures, BuildBody } from "./Creature"
import { Environment } from "./Environment"
import { ButtonData, PushButton } from "./Button"
import { ObjectGrabberSystem } from "./grabableObjects";

// systems
engine.addSystem(new PushButton())

engine.addSystem(new ObjectGrabberSystem())

// Instanciar Terreno
let parkEntity = new Entity()
parkEntity.addComponent(new GLTFShape("models/Environment_01.glb"))
parkEntity.addComponent(
  new Transform()
)
engine.addEntity(parkEntity)

// Instanciar environments
let hotEnvironment = new Entity()
let hot = new Environment(HotEnvironmentTemperature, hotEnvironmentPosition)
hotEnvironment.addComponent(hot)
hotEnvironment.addComponent(new PlaneShape())
hotEnvironment.addComponent(
  new Transform({
    position: hotEnvironmentPosition,
    scale: new Vector3(8, 8, 8),
    rotation: Quaternion.Euler(90, 0, 0)
  })
)
hotEnvironment.addComponent(hotMaterial)
engine.addEntity(hotEnvironment)

// Instanciar environments
let coldEnvironment = new Entity()
let cold = new Environment(ColdEnvironmentTemperature, coldEnvironmentPosition)
coldEnvironment.addComponent(cold)
coldEnvironment.addComponent(new PlaneShape())
coldEnvironment.addComponent(
  new Transform({
    position: coldEnvironmentPosition,
    scale: new Vector3(8, 8, 8),
    rotation: Quaternion.Euler(90, 0, 0)
  })
)
coldEnvironment.addComponent(coldMaterial)
engine.addEntity(coldEnvironment)

// neutral environment
let neutralEnvironment = new Entity()
export let neutral = new Environment(20, neutralEnvironmentPosition)
neutralEnvironment.addComponent(neutral)
neutralEnvironment.addComponent(new PlaneShape())
neutralEnvironment.addComponent(
  new Transform({
    position: neutralEnvironmentPosition,
    scale: new Vector3(16, 16, 16),
    rotation: Quaternion.Euler(270, 0, 0)
  })
)

// Configure callback for updating texts when the creatures count change
neutral.onCreaturesCountUpdated = function(creaturesCount) {
  if(creaturemeterText)
    creaturemeterText.value = creaturesCount + "/10"
}

engine.addEntity(neutralEnvironment)

// Instantiate first creature
let adamEntity = chipaPool.getEntity()
let adam = new Creature(adamEntity, neutral)
adamEntity.addComponent(adam)
adam.transform.position = new Vector3(24, 0, 24)
adam.TargetRandomPosition()
BuildBody(adamEntity)
adam.UpdateTemperatureText()
adam.UpdateScale()

// Console Machine
let machine = new Entity()
// machine.addComponent(new BoxShape())
machine.addComponent(
  new Transform({
    position: new Vector3(26, -0.5, 40),
    scale: new Vector3(2, 3, 6),
    rotation: Quaternion.Euler(0, 0, -35)
  })
)
engine.addEntity(machine)
// machine.setParent(neutralEnvironment)

let tempUp = new Entity()
tempUp.addComponent(
  new Transform({
    position: new Vector3(-0.1, 0.35, -0.325),
    scale: new Vector3(0.7, 0.5, 0.2),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
tempUp.addComponent(new GLTFShape("models/Button.glb"))
tempUp.addComponent(hotMaterial)
tempUp.addComponent(
  new OnClick(e => {
    neutral.temperature += TemperatureButtonValue
    if (neutral.temperature > 100) neutral.temperature = 100

    tempUp.getComponent(ButtonData).pressed = true
    let b = neutralMaterial.albedoColor.b
    let r = neutralMaterial.albedoColor.r
    neutralMaterial.albedoColor = new Color3(r + 0.6, 0.5, b - 0.6)
    // neutralEnvironment.removeComponent(Material)
    neutralEnvironment.addComponentOrReplace(neutralMaterial)

    let tempInC = neutral.temperature.toString()
    temperatureText.value = tempInC + "°"

    for (let entity of creatures.entities) {
      let creature = entity.getComponent(Creature)

      creature.UpdateTemperatureText()
      creature.UpdateTemperatureIcons()
    }

    log("temperature: " + neutral.temperature)
  })
)
tempUp.addComponent(new ButtonData(14.5, 14.7))
engine.addEntity(tempUp)
tempUp.setParent(machine)

let tempDown = new Entity()
tempDown.addComponent(
  new Transform({
    position: new Vector3(0.3, 0.35, -0.325),
    scale: new Vector3(0.7, 0.5, 0.2),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
tempDown.addComponent(new GLTFShape("models/Button.glb"))
tempDown.addComponent(coldMaterial)
tempDown.addComponent(
  new OnClick(e => {
    neutral.temperature -= TemperatureButtonValue
    if (neutral.temperature < -100) neutral.temperature = -100

    tempDown.getComponent(ButtonData).pressed = true
    //neutralMaterial.albedoColor.g = 85
    let b = neutralMaterial.albedoColor.b
    let r = neutralMaterial.albedoColor.r
    neutralMaterial.albedoColor = new Color3(r - 0.6, 0.5, b + 0.6)
    // neutralEnvironment.removeComponent(Material)
    neutralEnvironment.addComponentOrReplace(neutralMaterial)

    let tempInC = neutral.temperature.toString()
    temperatureText.value = tempInC + "°"

    for (let entity of creatures.entities) {
      let creature = entity.getComponent(Creature)

      creature.UpdateTemperatureText()
      creature.UpdateTemperatureIcons()
    }

    log("temperature: " + neutral.temperature)
  })
)
tempDown.addComponent(new ButtonData(14.5, 14.7))
engine.addEntity(tempDown)
tempDown.setParent(machine)

let thermometer = new Entity()
let temperatureText = new TextShape(neutral.temperature.toString() + "°")
temperatureText.fontSize = 4
temperatureText.hTextAlign = "center"
temperatureText.vTextAlign = "center"
thermometer.addComponent(temperatureText)

thermometer.addComponent(
  new Transform({
    position: new Vector3(0, 0.575, 0.15),
    scale: new Vector3(0.2, 0.5, 0.8),
    rotation: Quaternion.Euler(90, 0, 90)
  })
)
engine.addEntity(thermometer)
thermometer.setParent(machine)

let thermometerIconEntity = new Entity()
thermometerIconEntity.setParent(thermometer)
thermometerIconEntity.addComponent(new Transform({
  position: new Vector3(-1, 0, 0),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(0.5, 0.5, 0)
}))
thermometerIconEntity.addComponent(new PlaneShape())
thermometerIconEntity.addComponent(neutralIconMaterial)
engine.addEntity(thermometerIconEntity)

let creaturemeter = new Entity()
export let creaturemeterText = new TextShape("1/10")
creaturemeterText.fontSize = 4
creaturemeterText.hTextAlign = "center"
creaturemeterText.vTextAlign = "center"
creaturemeter.addComponent(creaturemeterText)

creaturemeter.addComponent(
  new Transform({
    position: new Vector3(0.325, 0.57, 0.15),
    scale: new Vector3(0.2, 0.5, 0.8),
    rotation: Quaternion.Euler(90, 0, 90)
  })
)
engine.addEntity(creaturemeter)
creaturemeter.setParent(machine)

let creaturemeterIconEntity = new Entity()
creaturemeterIconEntity.setParent(creaturemeter)
creaturemeterIconEntity.addComponent(new Transform({
  position: new Vector3(-1, 0, 0),
  scale: new Vector3(0.5, 0.5, 0),
  rotation: Quaternion.Euler(0, 0, 180)
}))
creaturemeterIconEntity.addComponent(new PlaneShape())
creaturemeterIconEntity.addComponent(chippaIconMaterial)
engine.addEntity(creaturemeterIconEntity)
