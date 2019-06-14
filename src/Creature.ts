import { Genome, GeneType } from "./Genome"
import { ProgressBar } from "./ProgressBar"
import { Environment } from "./Environment"
import { Pool } from "./ObjectPool"

const MAX_CREATURES_AMOUNT = 10

export let chipaPool = new Pool(MAX_CREATURES_AMOUNT)

//let basicChipaShape = new GLTFShape("models/Chippy.glb")

// Components
@Component("creature")
export class Creature {
  health: number = 100
  healthDecaySpeed: number = 3
  healthBar: ProgressBar
  name: string
  oldPos: Vector3 = Vector3.Zero()
  nextPos: Vector3 = Vector3.Zero()
  movementFraction: number = 1
  movementPauseTimer: number = 0
  transform: Transform
  genome: Genome
  environment: Environment
  shape: GLTFShape
  temperatureText: TextShape
  walkAnim: AnimationState
  entity: IEntity

  constructor(entity: IEntity) {
    this.entity = entity

    this.transform = new Transform()
    entity.addComponent(this.transform)

    let speed = 0.5
	let temperature = 20
	let ears = 0.5
	let eyes = 0.5
	let feet = 0.5
	let mouth = 0.5
	let nose = 0.5
	let tail = 0.5
	let wings = 0.5

    this.genome = new Genome([speed, temperature, ears, eyes, feet, mouth, nose, tail, wings])
    entity.addComponent(this.genome)

    // TODO :  change depending on case
    //this.shape = basicChipaShape
	//entity.addComponentOrReplace(this.shape)
	

    let animator = new Animator()
    this.walkAnim = animator.getClip("Walking")
    entity.addComponent(animator)

    let healthBarEntity = new Entity()
    healthBarEntity.setParent(entity)
    healthBarEntity.addComponent(
      new Transform({
        position: new Vector3(0, 1.5, 0),
        rotation: Quaternion.Euler(0, 180, 0)
      })
    )
    this.healthBar = new ProgressBar(healthBarEntity)
    healthBarEntity.addComponent(this.healthBar)
    // engine.addEntity(healthBarEntity)

    let nameTextEntity = new Entity()
    nameTextEntity.setParent(healthBarEntity)
    this.name = RandomizeName()
    let nameText = new TextShape(this.name)
    nameText.fontSize = 3
    nameText.color = Color3.White()
    nameText.hTextAlign = "center"
    nameText.vTextAlign = "center"
    nameText.billboard = true
    nameTextEntity.addComponent(nameText)
    nameTextEntity.addComponent(
      new Transform({
        position: new Vector3(-7.6, -2.8, -2.65)
      })
    )
    // engine.addEntity(nameTextEntity)

    let temperatureTextEntity = new Entity()
    temperatureTextEntity.setParent(healthBarEntity)
    this.temperatureText = new TextShape(temperature + "°")
    this.temperatureText.fontSize = 2.5
    this.temperatureText.color = Color3.Green()
    this.temperatureText.hTextAlign = "center"
    this.temperatureText.vTextAlign = "center"
    this.temperatureText.billboard = true
    temperatureTextEntity.addComponent(this.temperatureText)
    temperatureTextEntity.addComponent(
      new Transform({
        position: new Vector3(-7.6, -3.1, -2.65)
      })
    )
	// engine.addEntity(temperatureTextEntity)
	
	// TODO  onclick should be on body, maybe also on parts

    /* entity.addComponentOrReplace(
      new OnClick(() => {
        // TODO: GET GRABBED HERE
      })
    ) */

    this.UpdateScale()

    engine.addEntity(entity)
  }

  TargetRandomPosition() {
    this.oldPos = this.transform.position
    this.oldPos.y = 0
    this.nextPos = newCenteredRandomPos(neutralEnvironmentPosition, 8) // (24, 0, 24) is the center of a 3x3 scene

    this.movementFraction = 0

    this.transform.lookAt(this.nextPos)
  }

  SpawnChild() {
    if (creatures.entities.length >= MAX_CREATURES_AMOUNT) return

    let sonEntity = chipaPool.getEntity()
    if (!sonEntity) return

    let childCreature = new Creature(sonEntity)
    sonEntity.addComponentOrReplace(childCreature)

    childCreature.environment = this.environment

    childCreature.transform.position = this.transform.position
    childCreature.TargetRandomPosition()

    /* childCreature.genome.genes[GeneType.speed] =
      this.genome.genes[GeneType.speed] + (Math.random() - 0.5) * 2
    childCreature.genome.genes[GeneType.size] =
      this.genome.genes[GeneType.size] + (Math.random() - 0.5) * 2 */

    childCreature.genome.CopyFrom(this.genome)
	childCreature.Mutate()
	BuildBody(sonEntity)

    childCreature.movementPauseTimer = Math.random() * 5
  }

  Mutate() {
    this.genome.Mutate()
    this.UpdateTemperatureText()
    
    this.UpdateScale()
  }

  UpdateScale(){
    let size = Scalar.Lerp(MinCreatureScale, MaxCreatureScale, Scalar.InverseLerp(ColdEnvironmentTemperature, HotEnvironmentTemperature, this.genome.genes[GeneType.temperature]))

    this.transform.scale.x = size
    this.transform.scale.y = size
    this.transform.scale.z = size
  }

  UpdateHealthbar() {
    this.healthBar.UpdateNormalizedValue(this.health / 100)
  }

  UpdateTemperatureText() {
    this.temperatureText.value = this.genome.genes[GeneType.temperature] + "°"

    if(this.GetTemperatureDif() > MinTemperatureDiffForDamage)
      this.temperatureText.color = Color3.Red()
    else
      this.temperatureText.color = Color3.Green()
  }

  takeDamage() {
    let temperatureDif = this.GetTemperatureDif()

    if (temperatureDif > MinTemperatureDiffForDamage) {
      let temperatureDamage = temperatureDif * temperatureDif * DamageCoeff
      this.health -= temperatureDamage

      if (this.health < 0) this.health = 0

      this.UpdateHealthbar()
    }
  }

  GetTemperatureDif(){
    if(!this.environment)
      return 0

    return Math.abs(this.environment.temperature - this.genome.genes[GeneType.temperature])
  }
}
export const creatures = engine.getComponentGroup(Creature)

// Systems
export class DieSLowly implements ISystem {
  update(dt: number) {
    for (let entity of creatures.entities) {
      let creature = entity.getComponent(Creature)

      creature.takeDamage()
      if (creature.health <= 0) {
        log("RIP")
        ClearCreatureEntity(entity)
        engine.removeEntity(entity)
      }
    }
  }
}
engine.addSystem(new DieSLowly())

export class Wander implements ISystem {
  sinTime: number = 0

  update(dt: number) {
    for (let entity of creatures.entities) {
      let creature = entity.getComponent(Creature)

      if (creature.movementPauseTimer > 0) {
        creature.movementPauseTimer -= dt

        if (creature.movementPauseTimer > 0) continue
      }

      if (creature.movementFraction >= 1) continue

      let speed = Math.abs(creature.genome.genes[GeneType.speed])
      if (!creature.walkAnim.playing) {
        creature.walkAnim.speed = speed
        creature.walkAnim.playing = true
      }

      creature.movementFraction += speed * dt
      if (creature.movementFraction > 1) {
        creature.movementFraction = 1
      }
      
      creature.transform.position = Vector3.Lerp(
        creature.oldPos,
        creature.nextPos,
        creature.movementFraction
        )
      
      this.sinTime += dt * speed * 4
      let verticalOffset = new Vector3(0, Math.abs(Math.sin(this.sinTime)) * Math.abs(creature.genome.genes[GeneType.temperature]/30), 0)
      creature.transform.position = Vector3.Add(creature.transform.position, verticalOffset)

      // reached destination
      if (creature.movementFraction == 1) {
        creature.walkAnim.stop()

        creature.movementPauseTimer = Math.random() * 5

        let minDistanceTraveledForBreeding = 3
        if (
          Math.random() < 0.7 && // 70% chance of spawning a child
          Vector3.Distance(creature.oldPos, creature.transform.position) >=
            minDistanceTraveledForBreeding
        ) {
          creature.SpawnChild()
        }

        creature.TargetRandomPosition()
      }
    }
  }
}
engine.addSystem(new Wander())

// Extra functions
export function newCenteredRandomPos(centerPos: Vector3, radius: number) {
  let randomPos = new Vector3(Math.random() * radius, 0, Math.random() * radius)

  if (Math.random() < 0.5) randomPos.x *= -1

  if (Math.random() < 0.5) randomPos.z *= -1

  return Vector3.Add(centerPos, randomPos)
}

function RandomizeName() {
  let randomNumber = Math.random()

  if (randomNumber < 0.01) {
    return "Pumbi"
  } else if (randomNumber < 0.05) {
    return "Kalifa"
  } else if (randomNumber < 0.1) {
    return "Pumpi"
  } else if (randomNumber < 0.15) {
    return "Bimbo"
  } else if (randomNumber < 0.175) {
    return "Falopon"
  } else if (randomNumber < 0.2) {
    return "Troncho"
  } else if (randomNumber < 0.25) {
    return "Mika"
  } else if (randomNumber < 0.3) {
    return "Plinky"
  } else if (randomNumber < 0.35) {
    return "Faloppy"
  } else if (randomNumber < 0.4) {
    return "Sputnik"
  } else if (randomNumber < 0.45) {
    return "Satoshi"
  } else if (randomNumber < 0.475) {
    return "Bilbo"
  } else if (randomNumber < 0.5) {
    return "Falchor"
  } else if (randomNumber < 0.55) {
    return "Pipo"
  } else if (randomNumber < 0.575) {
    return "Keanu"
  } else if (randomNumber < 0.6) {
    return "Kinky"
  } else if (randomNumber < 0.65) {
    return "Buddy"
  } else if (randomNumber < 0.675) {
    return "Ryan"
  } else if (randomNumber < 0.7) {
    return "Slimy"
  } else if (randomNumber < 0.75) {
    return "JoJo"
  } else if (randomNumber < 0.775) {
    return "OraOraOra"
  } else if (randomNumber < 0.8) {
    return "Chippy"
  } else if (randomNumber < 0.85) {
    return "Chiffy"
  } else if (randomNumber < 0.875) {
    return "Satatus"
  } else if (randomNumber < 0.9) {
    return "Chippu"
  } else if (randomNumber < 0.95) {
    return "Kurtnus"
  } else {
    return "Kax"
  }
}

function ClearCreatureEntity(entity: IEntity) {
  for (const key in entity.components) {
    entity.removeComponent(entity.components[key])
  }

  for (const key in entity.children) {
    ClearCreatureEntity(entity.children[key])

    engine.removeEntity(entity.children[key])
  }
}

///  GLTF declarations

//body
let neutralChipaBody = new GLTFShape("models/Creature/Body.glb")
let winterChipaBody1 = new GLTFShape("models/Creature/Winter_Lv1.glb")
let winterChipaBody2 = new GLTFShape("models/Creature/Winter_Lv2.glb")

//feet
let feet_spider = new GLTFShape("models/Creature/Feet_Spider.glb")
let feet_big = new GLTFShape("models/Creature/Feet_Big.glb")
let feet_centi = new GLTFShape("models/Creature/Feet_Centipede.glb")

//ears
let ears_acua = new GLTFShape("models/Creature/Ears_AcuaticFin.glb")
let ears_cat = new GLTFShape("models/Creature/Ears_Cat.glb")
let ears_bear = new GLTFShape("models/Creature/Ears_Bear.glb")
let ears_cute = new GLTFShape("models/Creature/Ears_Cute.glb")
let ears_bunny = new GLTFShape("models/Creature/Ears_Bunny.glb")

//eyes
let eyes_cyclop = new GLTFShape("models/Creature/Eyes_Cyclop.glb")
let eyes_biclop = new GLTFShape("models/Creature/Eyes_Biclop.glb")
let eyes_nerd = new GLTFShape("models/Creature/Eyes_Nerd.glb")
let eyes_nerdor = new GLTFShape("models/Creature/Eyes_Nerdor.glb")
let eyes_spider = new GLTFShape("models/Creature/Eyes_Spider.glb")

// mouth
let mouth_acuatic = new GLTFShape("models/Creature/Mouth_Acuatic.glb")
let mouth_smile = new GLTFShape("models/Creature/Mouth_Smile.glb")
let mouth_fangs = new GLTFShape("models/Creature/Mouth_Fangs.glb")

// nose
let nose_bear = new GLTFShape("models/Creature/Nose_Bear.glb")
let nose_horn = new GLTFShape("models/Creature/Nose_Horn.glb")

// tail
let tail_acuatic = new GLTFShape("models/Creature/Tail_Acuatic.glb")
let tail_pig = new GLTFShape("models/Creature/Tail_Pig.glb")

// wings
let wings_acuatic = new GLTFShape("models/Creature/Wings_Acuatic.glb")
let wings_bat = new GLTFShape("models/Creature/Wings_Bat.glb")
let wings_dragon = new GLTFShape("models/Creature/Wings_Dragon.glb")

export function BuildBody(creature: IEntity){
	let genes = creature.getComponent(Genome).genes

	let temperature = genes[GeneType.temperature]
	let body = new Entity()
	body.setParent(creature)
	body.addComponent(neutralChipaBody)

	if (temperature < -30) {
		let coat = new Entity()
		coat.addComponent(winterChipaBody2)
		coat.setParent(creature)
	  } else if (temperature < 5) {
		let coat = new Entity()
		coat.addComponent(winterChipaBody1)
		coat.setParent(creature)
	  } else if (temperature < 30) {
		// normal chipa
	  } else if (temperature < 70) {
		// heat 1
	  } else if (temperature >= 70) {
		// heat 2
	}

	let feetGene = genes[GeneType.feet]
	let feet = new Entity()
	feet.setParent(creature)
	
	if (feetGene < 0.3) {
		feet.addComponent(feet_centi)
	  } else if (feetGene < 0.7) {
		feet.addComponent(feet_big)
	  } else if (feetGene <= 1) {
		feet.addComponent(feet_spider)
	}

	let earsGene = genes[GeneType.ears]
	let ears = new Entity()
	ears.setParent(creature)

	if (earsGene < 0.15) {
		ears.addComponent(ears_acua)
	  } else if (earsGene < 0.30) {
		ears.addComponent(ears_cat)
	  } else if (earsGene < 0.45) {
		ears.addComponent(ears_bear)
	  } else if (earsGene < 0.70) {
		// no ears
	  } else if (earsGene < 0.85) {
		ears.addComponent(ears_cute)
	  } else if (earsGene <= 1) {
		ears.addComponent(ears_bunny)
	}	


	let eyesGene = genes[GeneType.eyes]
	let eyes = new Entity()
	eyes.setParent(creature)

	if (eyesGene < 0.2) {
		eyes.addComponent(eyes_cyclop)
	  } else if (eyesGene < 0.4) {
		eyes.addComponent(eyes_biclop)
	  } else if (eyesGene < 0.6) {
		eyes.addComponent(eyes_nerd)
	  } else if (eyesGene < 0.8) {
		eyes.addComponent(eyes_nerdor)
	  } else if (eyesGene <= 1) {
		eyes.addComponent(eyes_spider)
	}	


	let mouthGene = genes[GeneType.mouth]
	let mouth = new Entity()
	mouth.setParent(creature)
	
	if (mouthGene < 0.2) {
		mouth.addComponent(mouth_acuatic)
	  } else if (mouthGene < 0.4) {
		// no mouth
	  } else if (mouthGene < 0.6) {
		mouth.addComponent(mouth_smile)
	  } else if (mouthGene < 0.8) {
		mouth.addComponent(mouth_fangs)
	}

	let noseGene = genes[GeneType.nose]
	let nose = new Entity()
	nose.setParent(creature)
	
	if (noseGene < 0.3) {
		nose.addComponent(nose_bear)
	  } else if (noseGene < 0.7) {
		// no nose
	  } else if (noseGene <= 1) {
		nose.addComponent(nose_horn)
	}

	let tailGene = genes[GeneType.tail]
	let tail = new Entity()
	tail.setParent(creature)
	
	if (tailGene < 0.3) {
		tail.addComponent(tail_acuatic)
	  } else if (tailGene < 0.7) {
		// no tail
	  } else if (tailGene <= 1) {
		tail.addComponent(tail_pig)
	}

	let wingsGene = genes[GeneType.wings]
	let wings = new Entity()
	wings.setParent(creature)
	
	if (wingsGene < 0.2) {
		wings.addComponent(wings_acuatic)
	  } else if (wingsGene < 0.6) {
		// no mouth
	  } else if (wingsGene < 0.8) {
		wings.addComponent(wings_bat)
	  } else if (wingsGene <= 1) {
		wings.addComponent(wings_dragon)
	}



}