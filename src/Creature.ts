import { Genome, GeneType } from "./Genome"

const MAX_CREATURES_AMOUNT = 10

// Components
@Component("creature")
export class Creature {
  health: number = 100
  healthDecaySpeed: number = 3
  oldPos: Vector3 = Vector3.Zero()
  nextPos: Vector3 = Vector3.Zero()
  // movementSpeed: number = Math.max(Math.random() * 0.3, 0.2)
  movementFraction: number = 1
  movementPauseTimer: number = 0
  transform: Transform
  genome: Genome
  shape: GLTFShape
  walkAnim: AnimationState
  entity: IEntity

  constructor(entity: IEntity) {
    this.entity = entity

    this.transform = new Transform()
    entity.addComponent(this.transform)

    this.genome = new Genome([Math.max(Math.random() * 0.3, 0.2), 1])
    entity.addComponent(this.genome)

    this.shape = new GLTFShape("models/BlockDog.glb")
    entity.addComponent(this.shape)

    let animator = new Animator()
    this.walkAnim = animator.getClip("Walking_Armature_0")
    entity.addComponent(animator)

    entity.addComponent(
      new OnClick(() => {
        // GET GRABBED
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
    if (creatures.entities.length >= MAX_CREATURES_AMOUNT) return

    let sonEntity = new Entity()
    let childCreature = new Creature(sonEntity)
    sonEntity.addComponent(childCreature)

    childCreature.transform.position = this.transform.position
    childCreature.TargetRandomPosition()

    /* childCreature.genome.genes[GeneType.speed] =
      this.genome.genes[GeneType.speed] + (Math.random() - 0.5) * 2
    childCreature.genome.genes[GeneType.size] =
      this.genome.genes[GeneType.size] + (Math.random() - 0.5) * 2 */
    childCreature.genome.Mutate(0.75)
    childCreature.transform.scale.x = childCreature.genome.genes[GeneType.size]
    childCreature.transform.scale.y = childCreature.genome.genes[GeneType.size]
    childCreature.transform.scale.z = childCreature.genome.genes[GeneType.size]

    childCreature.movementPauseTimer = Math.random() * 5
  }
}
export const creatures = engine.getComponentGroup(Creature)

// Systems
export class DieSLowly implements ISystem {
  update(dt: number) {
    for (let entity of creatures.entities) {
      let creature = entity.getComponent(Creature)
      creature.health -= creature.healthDecaySpeed * dt * Math.random()

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
        creature.walkAnim.play()
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

// Extra functions
export function newCenteredRandomPos(centerPos: Vector3, radius: number) {
  let randomPos = new Vector3(Math.random() * radius, 0, Math.random() * radius)

  if (Math.random() < 0.5) randomPos.x *= -1

  if (Math.random() < 0.5) randomPos.z *= -1

  return Vector3.Add(centerPos, randomPos)
}
