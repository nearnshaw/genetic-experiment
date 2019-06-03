import { newRandomPos, LerpData } from "./random-walking";

@Component('traits')
export class Traits {
  //model:
  speed: number = 1
  size: number = 1
  constructor(speed: number, size: number){
	this.speed = speed
	this.size = size
  }
}

export const chabones = engine.getComponentGroup(Traits)

let dogShape = new GLTFShape("models/BlockDog.glb")


// Base entity to generate all others
let adan = new Entity()
adan.addComponent(new Traits(1,1))


export function newSon( parent: IEntity = adan ){
  if (chabones.entities.length > 10) {return}
	const son = new Entity()
	
	let traits = randomVariation(parent)

	son.addComponent(traits)

	let startPosition = newRandomPos()

    son.addComponent(new Transform({
      position: startPosition,
      scale: new Vector3(traits.size, traits.size, traits.size)
    }))

	let avatar = dogShape


	son.addComponent(avatar)
	
    let sonAmim = new Animator()
	
	
    const walkAnim = sonAmim.getClip('Walking_Armature_0')
    walkAnim.speed = traits.speed
   
    //sonAmim.addClip(walkAnim)
	walkAnim.play()
	son.addComponent(sonAmim)
   
    const nextPos = newRandomPos()
    son.addComponent(new LerpData(startPosition, nextPos, 0, 200))
    

    son.getComponent(Transform).lookAt(nextPos)
    
    engine.addEntity(son)
}

function randomVariation(parent: IEntity){
	let speedDif = (Math.random() - 0.5)*2
	let sizeDif = (Math.random() - 0.5)*2

	let speedParent = parent.getComponent(Traits).speed
	let sizeParent = parent.getComponent(Traits).size

	let sonTraits = new Traits(speedParent+ speedDif, sizeParent+ sizeDif)
	
	return sonTraits
}
