import { newRandomPos, LerpData } from "./random-walking";
import { Health } from "./survival";



// GENES array
/*
speed 
size
warm
water
height
promiscuity   ( more sons, lives less)

*/

let geneLength = 2

@Component('traits')
export class Traits {
  //model:
  genes: number[]
 
  constructor(genes: number[]){
	this.genes = genes
  }

  copy() {
    // should switch to fancy JS array copy
    var newgenes = [];
    for (var i = 0; i < this.genes.length; i++) {
      newgenes[i] = this.genes[i];
    }

    return new Traits(newgenes);
  }

  // Based on a mutation probability, picks a new random character in array spots
  mutate(m) {
    for (var i = 0; i < this.genes.length; i++) {
      if (Math.random() < m) {
         this.genes[i] += (Math.random()-0.5);
      }
    }
  }
}

export const chabones = engine.getComponentGroup(Traits)

let dogShape = new GLTFShape("models/BlockDog.glb")


// Base entity to generate all others
let adan = new Entity()
adan.addComponent(new Traits([1,1]))


export function newSon( parent: IEntity = null ){
	if (chabones.entities.length > 10) {return}
	
	const son = new Entity()

	let traits

	if( parent == null){
		let randomGenes = []
		for (var i = 0; i < 3; i++) {
			randomGenes[i] = Math.random()
		  }
		traits = new Traits(randomGenes)
	}
	else {
		traits = randomVariation(parent)
	}


	son.addComponent(traits)

	let startPosition: Vector3

	if(parent != null){
		startPosition = parent.getComponent(Transform).position
	} else {
		startPosition = newRandomPos()
	}
	

    son.addComponent(new Transform({
      position: startPosition,
      scale: new Vector3(traits.genes[1], traits.genes[1], traits.genes[1])
    }))

	let avatar = dogShape


	son.addComponent(avatar)
	
    let sonAmim = new Animator()
	
	
    const walkAnim = sonAmim.getClip('Walking_Armature_0')
    walkAnim.speed = traits.genes[0]
   
    //sonAmim.addClip(walkAnim)
	walkAnim.play()
	son.addComponent(sonAmim)
   
    const nextPos = newRandomPos()
    son.addComponent(new LerpData(startPosition, nextPos, 0, 200))
    
	son.addComponent(new Health())
	
    son.getComponent(Transform).lookAt(nextPos)
    
    engine.addEntity(son)
}

function randomVariation(parent: IEntity){
	let speedDif = (Math.random() - 0.5)*2
	let sizeDif = (Math.random() - 0.5)*2

	let speedParent = parent.getComponent(Traits).genes[0]
	let sizeParent = parent.getComponent(Traits).genes[1]

	let sonTraits = new Traits([speedParent+ speedDif, sizeParent+ sizeDif])
	
	return sonTraits
}



  // At any moment there is a teeny, tiny chance a bloop will reproduce
  function reproduce(parent: IEntity) {
    // asexual reproduction
    if (Math.random() < 0.0005) {
      // Child is exact copy of single parent
      var childDNA = parent.getComponent(Traits);
      // Child DNA can mutate
      childDNA.mutate(0.01);
      newSon(parent);
    }
    else {
      return null;
    }
  }