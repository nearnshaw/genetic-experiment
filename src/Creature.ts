import { Genome, GeneType } from "./Genome"
import { ProgressBar } from "./ProgressBar"
import { Environment } from "./Environment";
import { Pool } from "./ObjectPool";

const MAX_CREATURES_AMOUNT = 10

let chipaPool = new Pool(MAX_CREATURES_AMOUNT)

let basicChipaShape = new GLTFShape("models/Chippy.glb")

// Components
@Component("creature")
export class Creature {
  health: number = 100
  healthDecaySpeed: number = 3
  healthBar: ProgressBar
  oldPos: Vector3 = Vector3.Zero()
  nextPos: Vector3 = Vector3.Zero()
  movementFraction: number = 1
  movementPauseTimer: number = 0
  transform: Transform
  genome: Genome
  environment: Environment
  shape: GLTFShape
  walkAnim: AnimationState
  entity: IEntity

  constructor(entity: IEntity) {
    this.entity = entity

	if (!entity.hasComponent(Transform)){
		this.transform = new Transform()
		entity.addComponent(this.transform)
	} else {
		this.transform = entity.getComponent(Transform)
	}

    let speed = Math.max(Math.random() * 0.3, 0.2)
    let size = Math.max(Math.random() * 0.3, 0.2)
    let temperature = Math.max(Math.random() * 0.3, 0.2)

	if (!entity.hasComponent(Genome)){
    	this.genome = new Genome([speed, size, temperature])
		entity.addComponent(this.genome)
	} else {
		log("reusing existing ent")
		this.genome = entity.getComponent(Genome)
		this.genome.genes = [speed, size, temperature]
	}

	// TODO :  change depending on case
    this.shape = basicChipaShape
    entity.addComponentOrReplace(this.shape)

	if (!entity.hasComponent(Animator)){
		let animator = new Animator()
		this.walkAnim = animator.getClip("Walking")
		entity.addComponent(animator)
	} else {
		this.walkAnim = entity.getComponent(Animator).getClip("Walking")
	}

	// TODO  do old healthbars remain w old reused entity from pool?
    let healthBarEntity = new Entity();
    healthBarEntity.setParent(entity)
    healthBarEntity.addComponent(new Transform({
      position: new Vector3(0, 1.5, 0),
      rotation: Quaternion.Euler(0, 180, 0)
    }))
    this.healthBar = new ProgressBar(healthBarEntity)
    healthBarEntity.addComponent(this.healthBar)
    // engine.addEntity(healthBarEntity)

	
    entity.addComponentOrReplace(
      new OnClick(() => {
        // TODO: GET GRABBED HERE
      })
    )

    engine.addEntity(entity)
  }

  TargetRandomPosition() {
    this.oldPos = this.transform.position
    this.nextPos = newCenteredRandomPos(new Vector3(24, 0, 24), 8) // (24, 0, 24) is the center of a 3x3 scene

    this.movementFraction = 0

    this.transform.lookAt(this.nextPos)
  }

  SpawnChild() {
    //if (creatures.entities.length >= MAX_CREATURES_AMOUNT) return
	let sonEntity = chipaPool.getEntity()
    if (!sonEntity) return
    
    let childCreature = new Creature(sonEntity)
    sonEntity.addComponentOrReplace(childCreature)

    childCreature.transform.position = this.transform.position
    childCreature.TargetRandomPosition()

    /* childCreature.genome.genes[GeneType.speed] =
      this.genome.genes[GeneType.speed] + (Math.random() - 0.5) * 2
    childCreature.genome.genes[GeneType.size] =
      this.genome.genes[GeneType.size] + (Math.random() - 0.5) * 2 */

    childCreature.genome.CopyFrom(this.genome)
    childCreature.genome.Mutate()
    childCreature.transform.scale.x = childCreature.genome.genes[GeneType.temperature] * 5
    childCreature.transform.scale.y = childCreature.genome.genes[GeneType.temperature] * 5
    childCreature.transform.scale.z = childCreature.genome.genes[GeneType.temperature] * 5

    childCreature.environment = this.environment

    childCreature.movementPauseTimer = Math.random() * 5

    log("new child with temp ", childCreature.genome.genes)
    //log("new child with temp ", childCreature.genome.genes[GeneType.temperature])
  }

  UpdateNormalizedValue() {
    this.healthBar.UpdateNormalizedValue(this.health / 100)
  }

  takeDamage() {
    let temperatureDif = Math.abs(this.genome.genes[GeneType.temperature] - this.environment.temperature) * 10
    let temperatureDamage = (temperatureDif * temperatureDif) * DamageCoeff
    this.health -= temperatureDamage
  }
}
export const creatures = engine.getComponentGroup(Creature)

// Systems
export class DieSLowly implements ISystem {
  update(dt: number) {
    for (let entity of creatures.entities) {
      let creature = entity.getComponent(Creature)

      creature.takeDamage()
      creature.UpdateNormalizedValue()

      if (creature.health < 0) {
        engine.removeEntity(entity)
        log("RIP")
      }
    }
  }
}
engine.addSystem(new DieSLowly())

export class Wander implements ISystem {
  update(dt: number) {
    for (let entity of creatures.entities) {
      let creature = entity.getComponent(Creature)

      if (creature.movementPauseTimer > 0) {
        creature.movementPauseTimer -= dt

        if (creature.movementPauseTimer > 0) continue
      }

      if (creature.movementFraction >= 1) continue

      if (!creature.walkAnim.playing) {
        creature.walkAnim.speed = creature.genome.genes[GeneType.speed]
        creature.walkAnim.playing = true
      }

      creature.movementFraction += creature.genome.genes[GeneType.speed] * dt
      if (creature.movementFraction > 1) {
        creature.movementFraction = 1
      }

      creature.transform.position = Vector3.Lerp(
        creature.oldPos,
        creature.nextPos,
        creature.movementFraction
      )

      // reached destination
      if (creature.movementFraction == 1) {
        creature.walkAnim.stop()

        creature.movementPauseTimer = Math.random() * 5

        let minDistanceTraveledForBreeding = 3
        if (
          Math.random() < 0.5 && // 50% chance of spawning a child
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

// TODO: Add healthbar component/s update, based on creatures health, here.

// Extra functions
export function newCenteredRandomPos(centerPos: Vector3, radius: number) {
  let randomPos = new Vector3(Math.random() * radius, 0, Math.random() * radius)

  if (Math.random() < 0.5) randomPos.x *= -1

  if (Math.random() < 0.5) randomPos.z *= -1

  return Vector3.Add(centerPos, randomPos)
}
