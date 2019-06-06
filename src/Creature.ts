
// Components
@Component('creature')
export class Creature {
    health: number = 100
    healthDecaySpeed: number = 3
    oldPos: Vector3 = Vector3.Zero()
    nextPos: Vector3 = Vector3.Zero()
    movementSpeed: number = (Math.random() - 0.5)*2
    movementFraction: number = 1
    movementPauseTimer: number = 0
    transform: Transform
    shape: GLTFShape
    walkAnim: AnimationState
    entity: IEntity

    constructor(entity: IEntity){
        this.entity = entity

        this.transform = new Transform();
        entity.addComponent(this.transform)
        
        this.shape = new GLTFShape("models/BlockDog.glb")
        entity.addComponent(this.shape)

        let animator = new Animator()
        this.walkAnim = animator.getClip('Walking_Armature_0')
        entity.addComponent(animator)

        engine.addEntity(entity)
    }

    TargetRandomPosition(){
        this.oldPos = this.transform.position
        this.nextPos = newCenteredRandomPos()
        this.movementFraction = 0
        
        this.transform.lookAt(this.nextPos)
    }

    SpawnSon(){
        if (creatures.entities.length >= 10) return

        this.movementPauseTimer = Math.random() * 5

        let sonEntity = new Entity()
        let sonCreature = new Creature(sonEntity)
        sonEntity.addComponent(sonCreature)
        sonCreature.transform.position = this.transform.position
        sonCreature.TargetRandomPosition()
    }
}
export const creatures = engine.getComponentGroup(Creature)

// Systems
export class DieSLowly implements ISystem  {
	update(dt: number) {
        for (let entity of creatures.entities) {
            let creature = entity.getComponent(Creature) 
            creature.health -= creature.healthDecaySpeed * dt * Math.random()
        
            if (creature.health < 0){
                engine.removeEntity(entity)
                log("RIP")
            }
        }
	}
}
engine.addSystem(new DieSLowly())

export class Wander implements ISystem  {
    update(dt: number) {
        for (let entity of creatures.entities) {

            let creature = entity.getComponent(Creature)

            if(creature.movementPauseTimer > 0){
                creature.movementPauseTimer -= dt

                if(creature.movementPauseTimer > 0) continue
            }

            if(creature.movementFraction >= 1) continue

            if(!creature.walkAnim.playing){
                creature.walkAnim.speed = creature.movementSpeed
                creature.walkAnim.play()
            }

            creature.movementFraction += creature.movementSpeed * dt;
            if(creature.movementFraction > 1)
                creature.movementFraction = 1

            creature.transform.position = Vector3.Lerp(creature.oldPos, creature.nextPos, creature.movementFraction)

            if (creature.movementFraction == 1) {
                creature.walkAnim.stop()
                
                creature.SpawnSon()

                creature.TargetRandomPosition()
            }
        }
    }
}
engine.addSystem(new Wander())

// Extra functions
export function newCenteredRandomPos(){
    let x = Math.random() * 3
    let z = Math.random() * 3

    // if(Math.random() < 0.5)
    //     x *= -1

    // if(Math.random() < 0.5)
    //     z *= -1
        
    let pos = new Vector3(24 + x, 0, 24 + z)
    
    return pos 
}